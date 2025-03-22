import { config } from 'dotenv';
import { betterAuth, BetterAuthClientPlugin } from "better-auth";
import { expo } from "@better-auth/expo";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@prop-track/database";

// Load environment variables
config();

// Validate required environment variables
const requiredEnvVars = [
    'BETTER_AUTH_URL',
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_TRUSTED_ORIGINS',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
] as const;

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

export const auth = betterAuth({
    // Secret key for encryption
    baseURL: process.env.BETTER_AUTH_URL!,
    secret: process.env.BETTER_AUTH_SECRET!,
    trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(","),

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




export type SessionObject = typeof auth.$Infer.Session;
export type User = SessionObject['user'];
export type Session = SessionObject['session'];
export type SessionData = SessionObject;