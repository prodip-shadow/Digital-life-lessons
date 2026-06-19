import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Lesson, User } from "@/lib/db";

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
    
    const userId = session.user.id;
    
    // Toggle in lesson favoritesBy
    if (!lesson.favoritesBy) {
      lesson.favoritesBy = [];
    }
    const favIndex = lesson.favoritesBy.indexOf(userId);
    let favorited = false;
    
    if (favIndex > -1) {
      lesson.favoritesBy.splice(favIndex, 1);
    } else {
      lesson.favoritesBy.push(userId);
      favorited = true;
    }
    
    if (!lesson.stats) {
      lesson.stats = { likes: "0", bookmarks: "0", views: "0" };
    }
    lesson.stats.bookmarks = lesson.favoritesBy.length.toString();
    
    lesson.markModified('stats');
    lesson.markModified('favoritesBy');
    await lesson.save();
    
    // Toggle in user favorites list
    const user = await User.findById(userId);
    if (user) {
      if (!user.favorites) {
        user.favorites = [];
      }
      const userFavIndex = user.favorites.indexOf(id);
      if (favorited) {
        if (userFavIndex === -1) {
          user.favorites.push(id);
        }
      } else {
        if (userFavIndex > -1) {
          user.favorites.splice(userFavIndex, 1);
        }
      }
      user.markModified('favorites');
      await user.save();
    }
    
    return NextResponse.json({ 
      favorited, 
      bookmarksCount: lesson.favoritesBy.length 
    });
  } catch (error) {
    console.error("POST favorite failed:", error);
    return NextResponse.json({ error: "Failed to favorite lesson" }, { status: 500 });
  }
}
