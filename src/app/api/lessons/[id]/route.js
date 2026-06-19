import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Lesson, Comment, User } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }
    
    // Check session to enforce visibility rules
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (lesson.isVisible === false && lesson.userId !== session?.user?.id) {
      return NextResponse.json({ error: "This lesson is currently private." }, { status: 403 });
    }
    
    // Unique views tracking: user is logged in, is not the author, and has not viewed it yet
    if (session?.user?.id && session.user.id !== lesson.userId) {
      if (!lesson.readers) {
        lesson.readers = [];
      }
      if (!lesson.readers.includes(session.user.id)) {
        lesson.readers.push(session.user.id);
        
        // Earning trigger: if lesson is premium, and reader is premium
        if (lesson.isPremium && session.user.isPremium) {
          const authorUser = await User.findById(lesson.userId);
          if (authorUser) {
            if (!authorUser.earningsHistory) {
              authorUser.earningsHistory = [];
            }
            authorUser.earningsHistory.push({
              date: new Date(),
              lessonId: lesson._id.toString(),
              lessonTitle: lesson.title,
              readerName: session.user.name,
              amount: 50
            });
            authorUser.markModified('earningsHistory');
            await authorUser.save();
            console.log(`💰 Added 50 Taka earnings to user ${lesson.userId} for lesson "${lesson.title}" read by premium user ${session.user.name}`);
          }
        }
        
        if (!lesson.stats) {
          lesson.stats = { likes: "0", bookmarks: "0", views: "0" };
        }
        const currentViews = parseInt(lesson.stats.views || "0") || 0;
        lesson.stats.views = (currentViews + 1).toString();
        
        lesson.markModified('readers');
        lesson.markModified('stats');
        await lesson.save();
      }
    }
    
    return NextResponse.json(lesson);
  } catch (error) {
    console.error("GET single lesson failed:", error);
    return NextResponse.json({ error: "Failed to fetch lesson" }, { status: 500 });
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
    
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }
    
    // Authorization: only the author can edit
    if (lesson.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    const body = await req.json();
    const { 
      title, 
      description, 
      content, 
      category, 
      tone, 
      coverImage, 
      quote, 
      closing, 
      isPremium, 
      isVisible 
    } = body;
    
    if (title !== undefined) lesson.title = title;
    if (description !== undefined) lesson.description = description;
    if (content !== undefined) {
      lesson.content = Array.isArray(content) 
        ? content 
        : content.split("\n").map(p => p.trim()).filter(p => p.length > 0);
    }
    if (category !== undefined) lesson.category = category;
    if (tone !== undefined) lesson.tone = tone;
    if (coverImage !== undefined) lesson.coverImage = coverImage;
    if (quote !== undefined) lesson.quote = quote;
    if (closing !== undefined) lesson.closing = closing;
    if (isPremium !== undefined) {
      if (isPremium && !session.user.isPremium) {
        return NextResponse.json({ error: "Only premium users can mark lessons as premium." }, { status: 403 });
      }
      lesson.isPremium = !!isPremium;
    }
    if (isVisible !== undefined) lesson.isVisible = !!isVisible;
    
    await lesson.save();
    return NextResponse.json(lesson);
  } catch (error) {
    console.error("PUT lesson failed:", error);
    return NextResponse.json({ error: "Failed to update lesson" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }
    
    // Authorization: only the author can delete
    if (lesson.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    // Delete comments first
    await Comment.deleteMany({ lessonId: id });
    
    // Delete the lesson
    await Lesson.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true, message: "Lesson and associated comments deleted successfully." });
  } catch (error) {
    console.error("DELETE lesson failed:", error);
    return NextResponse.json({ error: "Failed to delete lesson" }, { status: 500 });
  }
}
