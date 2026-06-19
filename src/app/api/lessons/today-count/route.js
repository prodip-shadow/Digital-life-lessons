import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Lesson } from "@/lib/db";

export async function GET(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
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

    return NextResponse.json({ count: countToday });
  } catch (error) {
    console.error("Failed to fetch today count:", error);
    return NextResponse.json({ error: "Failed to fetch count" }, { status: 500 });
  }
}
