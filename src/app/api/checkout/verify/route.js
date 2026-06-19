import { NextResponse } from "next/server";
import Stripe from "stripe";
import { User } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Retrieve checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === "paid" || session.status === "complete") {
      const userId = session.client_reference_id || session.metadata?.userId;
      
      if (userId) {
        // Update user to premium
        const result = await User.updateOne(
          { _id: userId },
          { $set: { isPremium: true, premiumExpires: new Date(Date.now() + 365*24*60*60*1000) } }
        );
        console.log(`✅ [Verification API] User ${userId} upgraded to premium. Result:`, result);
        return NextResponse.json({ success: true, isPremium: true });
      } else {
        return NextResponse.json({ error: "User ID not found in session metadata" }, { status: 400 });
      }
    }

    return NextResponse.json({ success: false, status: session.status, payment_status: session.payment_status });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message || "Failed to verify payment" }, { status: 500 });
  }
}
