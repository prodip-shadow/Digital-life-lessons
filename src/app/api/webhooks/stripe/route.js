import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { User } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  let event;
  const rawBody = await req.text();

  if (!endpointSecret) {
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ STRIPE_WEBHOOK_SECRET is missing. Bypassing signature verification in development mode.");
      try {
        event = JSON.parse(rawBody);
      } catch (parseErr) {
        return new Response("Invalid JSON payload", { status: 400 });
      }
    } else {
      console.error("❌ STRIPE_WEBHOOK_SECRET is missing in production.");
      return new Response("Webhook Secret missing", { status: 500 });
    }
  } else {
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      console.error("⚠️ Webhook signature verification failed.", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.client_reference_id || session.metadata?.userId;
    if (userId) {
      try {
        await User.updateOne({ _id: userId }, { $set: { isPremium: true, premiumExpires: new Date(Date.now() + 365*24*60*60*1000) } });
        console.log(`✅ User ${userId} upgraded to premium.`);
      } catch (dbErr) {
        console.error("Failed to update user premium status:", dbErr);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
