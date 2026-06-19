import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Lesson, User } from "@/lib/db";

export async function GET(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = await User.findById(session.user.id);
    const favIds = user?.favorites || [];
    
    const lessons = await Lesson.find({
      $or: [
        { favoritesBy: session.user.id },
        { _id: { $in: favIds } }
      ]
    }).sort({ createdAt: -1 });
    
    return NextResponse.json(lessons);
  } catch (error) {
    console.error("GET dashboard favorites failed:", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}
