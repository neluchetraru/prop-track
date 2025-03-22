import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

const baseURL = process.env.EXPO_PUBLIC_API_URL;
const authClient = createAuthClient({
    baseURL: `${baseURL}/api/auth`,
    plugins: [
        expoClient({
            scheme: "prop-track",
            storagePrefix: "auth",
            storage: SecureStore,
        })
    ]
});

export { authClient };