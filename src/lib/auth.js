import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import "./db"; // Ensure connection is initiated and schemas are registered

const client = mongoose.connection.getClient();
const db = client.db("digital-life-lessons");

export const auth = betterAuth({
    baseURL: process.env.NODE_ENV === "production" ? "https://digital-life-lessons-26.vercel.app" : "http://localhost:3000",
    trustedOrigins: ["http://localhost:3000", "http://localhost:3001", "https://digital-life-lessons-26.vercel.app"],
    database: mongodbAdapter(db, {
        client,
        collectionNames: {
            user: "user",
            session: "user",
            account: "user",
            verification: "user",
        },
    }),
    user: {
        additionalFields: {
            isPremium: {
                type: "boolean",
                required: false,
            },
            premiumExpires: {
                type: "date",
                required: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    return {
                        data: {
                            ...user,
                            isPremium: false,
                            premiumExpires: null,
                        },
                    };
                },
            },
        },
    },
});
