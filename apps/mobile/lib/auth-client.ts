import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

const authClient = createAuthClient({
    baseURL: "http://192.168.0.103:8081/api/auth",
    plugins: [
        expoClient({
            scheme: "prop-track",
            storagePrefix: "auth",
            storage: SecureStore,
        })
    ]
});

export { authClient };