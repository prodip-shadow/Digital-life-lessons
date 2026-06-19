import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { User, Lesson } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Get session to check if requester is the user himself
    const session = await auth.api.getSession({
      headers: await headers()
    });
    const isOwner = session?.user?.id === id;
    
    // Find user's lessons
    const query = { userId: id };
    if (!isOwner) {
      query.isVisible = { $ne: false };
    }
    const lessonsList = await Lesson.find(query).sort({ createdAt: -1 });
    
    // Resolve user profiles of people who liked these lessons
    const lessons = [];
    for (const lesson of lessonsList) {
      const likedUsers = await User.find({ _id: { $in: lesson.likedBy || [] } }, 'name image');
      const lessonObj = lesson.toObject();
      lessonObj.likedByUserProfiles = likedUsers.map(u => ({
        id: u._id.toString(),
        name: u.name,
        image: u.image || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
      }));
      lessons.push(lessonObj);
    }
    
    // Calculate total likes received across all lessons
    let totalLikes = 0;
    const allUserLessons = await Lesson.find({ userId: id });
    allUserLessons.forEach(l => {
      if (Array.isArray(l.likedBy)) {
        totalLikes += l.likedBy.length;
      } else {
        totalLikes += parseFloat(l.stats?.likes) || 0;
      }
    });
    
    // Prepare safe user data
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      description: user.description || "",
      studyAt: user.studyAt || "",
      dateOfBirth: user.dateOfBirth || "",
      isPremium: user.isPremium,
      createdAt: user.createdAt,
      totalLikes,
      lessonsCount: allUserLessons.length,
      ...(isOwner && { earningsHistory: user.earningsHistory || [] })
    };
    
    return NextResponse.json({ user: userData, lessons });
  } catch (error) {
    console.error("GET user profile failed:", error);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    if (session.user.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const body = await req.json();
    const { name, description, studyAt, dateOfBirth, image } = body;
    
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    if (name !== undefined) user.name = name;
    if (description !== undefined) user.description = description;
    if (studyAt !== undefined) user.studyAt = studyAt;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (image !== undefined) user.image = image;
    
    user.updatedAt = new Date();
    
    await user.save();
    
    // Also update author info on user's lessons to keep it in sync
    if (name !== undefined || image !== undefined) {
      const lessonsToUpdate = await Lesson.find({ userId: id });
      for (const lesson of lessonsToUpdate) {
        if (!lesson.author) {
          lesson.author = {};
        }
        if (name !== undefined) lesson.author.name = name;
        if (image !== undefined) lesson.author.avatar = image || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png";
        lesson.markModified('author');
        await lesson.save();
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        description: user.description,
        studyAt: user.studyAt,
        dateOfBirth: user.dateOfBirth
      }
    });
  } catch (error) {
    console.error("PUT user profile failed:", error);
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
  }
}
