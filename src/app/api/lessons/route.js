import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Lesson } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 0;
    
    let query = Lesson.find({ isVisible: { $ne: false } }).sort({ createdAt: -1 });
    if (limit > 0) {
      query = query.limit(limit);
    }
    
    const lessons = await query;
    return NextResponse.json(lessons);
  } catch (error) {
    console.error("GET lessons failed:", error);
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { title, description, content, category, tone, coverImage, isPremium } = body;
    
    if (!title || !content || !category) {
      return NextResponse.json({ error: "Title, content, and category are required" }, { status: 400 });
    }

    if (isPremium && !session.user?.isPremium) {
      return NextResponse.json({ error: "Only premium members can create premium lessons." }, { status: 403 });
    }

    if (!session.user?.isPremium) {
      // Calculate start of today in BD time (UTC+6)
      const now = new Date();
      const bdTime = new Date(now.getTime() + 6 * 60 * 60 * 1000);
      const bdYear = bdTime.getUTCFullYear();
      const bdMonth = bdTime.getUTCMonth();
      const bdDay = bdTime.getUTCDate();
      const startOfTodayBDInUTC = new Date(Date.UTC(bdYear, bdMonth, bdDay) - 6 * 60 * 60 * 1000);

      const countToday = await Lesson.countDocuments({
        userId: session.user.id,
        createdAt: { $gte: startOfTodayBDInUTC }
      });

      if (countToday >= 5) {
        return NextResponse.json({ 
          error: "Standard members can publish only 5 lessons per day. Upgrade to Premium for unlimited publishing." 
        }, { status: 403 });
      }
    }
    
    // Split content text into paragraphs if it is passed as a string
    const contentParagraphs = Array.isArray(content) 
      ? content 
      : content.split("\n").map(p => p.trim()).filter(p => p.length > 0);
      
    // Generate a short description if not provided
    const resolvedDescription = description || (contentParagraphs[0] ? contentParagraphs[0].slice(0, 150) + "..." : "");
    
    const newLesson = new Lesson({
      title,
      description: resolvedDescription,
      content: contentParagraphs,
      category,
      tone: tone || "Realization",
      coverImage: coverImage || "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80",
      isPremium: !!isPremium,
      userId: session.user.id,
      userEmail: session.user.email,
      author: {
        name: session.user.name,
        avatar: session.user.image || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
        lessonsCount: 1
      },
      tags: [category, "Reflective"],
      likedBy: [],
      favoritesBy: [],
      isVisible: true,
      stats: { likes: "0", bookmarks: "0", views: "0" }
    });
    
    await newLesson.save();
    return NextResponse.json(newLesson);
  } catch (error) {
    console.error("POST lesson failed:", error);
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 });
  }
}
