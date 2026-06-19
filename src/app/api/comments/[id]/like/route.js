import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Comment } from "@/lib/db";

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
    
    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }
    
    if (!comment.likedBy) {
      comment.likedBy = [];
    }
    
    const userId = session.user.id;
    const index = comment.likedBy.indexOf(userId);
    let liked = false;
    
    if (index > -1) {
      comment.likedBy.splice(index, 1);
    } else {
      comment.likedBy.push(userId);
      liked = true;
    }
    
    comment.markModified('likedBy');
    await comment.save();
    
    return NextResponse.json({ 
      liked, 
      likesCount: comment.likedBy.length,
      likedBy: comment.likedBy 
    });
  } catch (error) {
    console.error("POST comment like failed:", error);
    return NextResponse.json({ error: "Failed to like comment" }, { status: 500 });
  }
}
