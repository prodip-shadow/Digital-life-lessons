import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Comment } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const { id: lessonId } = resolvedParams;

    const comments = await Comment.find({ lessonId }).sort({ createdAt: 1 });
    return NextResponse.json(comments);
  } catch (error) {
    console.error("GET comments failed:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const resolvedParams = await params;
    const { id: lessonId } = resolvedParams;
    const { content, parentId } = await req.json();
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }
    
    let replyToUserId = null;
    let replyToUserName = null;
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (parentComment) {
        replyToUserId = parentComment.userId;
        replyToUserName = parentComment.userName;
      }
    }
    
    const newComment = new Comment({
      lessonId,
      userId: session.user.id,
      userName: session.user.name,
      userAvatar: session.user.image || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
      content: content.trim(),
      parentId: parentId || null,
      replyToUserId,
      replyToUserName,
      likedBy: []
    });
    
    await newComment.save();
    return NextResponse.json(newComment);
  } catch (error) {
    console.error("POST comment failed:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
