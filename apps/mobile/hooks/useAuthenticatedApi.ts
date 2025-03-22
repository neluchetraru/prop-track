import { createApi } from "@prop-track/api";
import { authClient } from "@/lib/auth-client";
import { useCallback } from "react";

export function useAuthenticatedApi() {
    const api = createApi(authClient.$fetch);

    const withAuth = useCallback(async <T>(
        operation: () => Promise<T>
    ): Promise<T> => {
        const session = await authClient.getSession();
        if (!session?.data?.user) {
            throw new Error("Authentication required");
        }
        return operation();
    }, []);

    return {
        api,
        withAuth,
    };
} 