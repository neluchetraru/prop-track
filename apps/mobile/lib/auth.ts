import { betterAuth } from "better-auth";
import { expo } from "@better-auth/expo";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@prop-track/database";

console.log("BETTER_AUTH_SECRET:", process.env.BETTER_AUTH_SECRET);
export const auth = betterAuth({
    // Secret key for encryption
    baseURL: process.env.BETTER_AUTH_URL!,
    secret: process.env.BETTER_AUTH_SECRET!,
    trustedOrigins: [
        "prop-track://*",
        "exp://*",
        "http://localhost:*",
        "exp.host",
        "*"
    ],
    onAPIError: {
        onError: (error) => {
            console.error("API Error:", error);
        }
    },

    logger: {
        disabled: false,
        level: "debug",
    },

    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),

    // Enable email/password authentication
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false
    },

    socialProviders: {
        google: {
            enabled: true,
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }
    },

    // Add Expo plugin
    plugins: [
        expo({
            overrideOrigin: true
        })
    ]
}); 