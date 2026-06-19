import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Lesson, Comment, User } from "@/lib/db";

export async function GET(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Fetch all lessons created by this user
    const userLessons = await Lesson.find({ userId: session.user.id }).sort({ createdAt: -1 });
    
    const totalLessons = userLessons.length;
    
    // Calculate total views
    let totalViewsNum = 0;
    userLessons.forEach(l => {
      const v = parseFloat(l.stats?.views) || 0;
      if (l.stats?.views?.toLowerCase().includes('k')) {
        totalViewsNum += v * 1000;
      } else {
        totalViewsNum += v;
      }
    });
    
    const totalViews = totalViewsNum >= 1000 ? (totalViewsNum / 1000).toFixed(1) + 'k' : totalViewsNum.toString();
    
    // Calculate total comments (discussions) on these lessons
    const lessonIds = userLessons.map(l => l._id.toString());
    const discussions = await Comment.countDocuments({ lessonId: { $in: lessonIds } });
    
    // Calculate total likes received across all lessons
    let totalLikes = 0;
    userLessons.forEach(l => {
      if (Array.isArray(l.likedBy)) {
        totalLikes += l.likedBy.length;
      } else {
        totalLikes += parseFloat(l.stats?.likes) || 0;
      }
    });
    
    // Calculate total earnings
    const user = await User.findById(session.user.id);
    let totalEarnings = 0;
    if (user && user.earningsHistory) {
      user.earningsHistory.forEach(e => {
        totalEarnings += e.amount || 0;
      });
    }
    
    // Construct metrics object matching the format expected by dashboard page
    const metrics = {
      totalLessons,
      totalLessonsGrowth: 0,
      totalViews,
      totalViewsGrowth: 0,
      discussions,
      discussionsGrowth: 0,
      avgRating: totalLikes.toString(), // Used as "Total Likes" in redesigned UI
      avgRatingGrowth: 0,
      totalEarnings,
      recentLessons: userLessons.slice(0, 5).map(l => ({
        id: l._id.toString(),
        title: l.title,
        category: l.category,
        isPremium: l.isPremium,
        isVisible: l.isVisible !== false,
        createdAt: l.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedAt: l.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }))
    };
    
    return NextResponse.json(metrics);
  } catch (error) {
    console.error("Dashboard metrics failed:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard metrics" }, { status: 500 });
  }
}
