import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

const baseURL = `${process.env.EXPO_PUBLIC_API_BASE_URL || "http://192.168.1.100:3000"}/api`;
export const authClient = createAuthClient({
    baseURL: `${baseURL}/auth`,
    plugins: [
        expoClient({
            scheme: "prop-track",
            storagePrefix: "auth",
            storage: SecureStore,
        })
    ],
});


