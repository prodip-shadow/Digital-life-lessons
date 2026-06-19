import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Lesson } from "@/lib/db";

export async function POST(req, { params }) {
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
    
    if (!lesson.likedBy) {
      lesson.likedBy = [];
    }
    
    const userId = session.user.id;
    const index = lesson.likedBy.indexOf(userId);
    let liked = false;
    
    if (index > -1) {
      lesson.likedBy.splice(index, 1);
    } else {
      lesson.likedBy.push(userId);
      liked = true;
    }
    
    if (!lesson.stats) {
      lesson.stats = { likes: "0", bookmarks: "0", views: "0" };
    }
    
    lesson.stats.likes = lesson.likedBy.length.toString();
    
    // Tell Mongoose that stats and likedBy fields are modified (especially for mixed types)
    lesson.markModified('stats');
    lesson.markModified('likedBy');
    
    await lesson.save();
    
    return NextResponse.json({ 
      liked, 
      likesCount: lesson.likedBy.length,
      likedBy: lesson.likedBy 
    });
  } catch (error) {
    console.error("POST like failed:", error);
    return NextResponse.json({ error: "Failed to like lesson" }, { status: 500 });
  }
}
