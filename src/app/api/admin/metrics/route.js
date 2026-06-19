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
    
    const totalUsers = await User.countDocuments();
    const allLessons = await Lesson.find().sort({ createdAt: -1 });
    const lessonsPublished = allLessons.length;
    
    // Construct metrics object matching format expected by admin panel page
    const adminMetrics = {
      totalUsers,
      usersGrowth: 0,
      lessonsPublished,
      lessonsGrowth: 0,
      totalRevenue: "$0",
      revenueGrowth: 0,
      activeNow: 1,
      reportsPending: 0,
      lessons: allLessons.map(l => ({
        title: l.title,
        creator: l.author?.name || "Unknown",
        category: l.category,
        access: l.isPremium ? "Premium" : "Free",
        status: "PUBLISHED"
      })),
      reports: []
    };
    
    return NextResponse.json(adminMetrics);
  } catch (error) {
    console.error("Admin metrics failed:", error);
    return NextResponse.json({ error: "Failed to fetch admin metrics" }, { status: 500 });
  }
}
