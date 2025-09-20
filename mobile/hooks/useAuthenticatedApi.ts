import { authClient } from '../lib/auth-client';
import * as propertiesApi from '../api/properties';

export function useAuthenticatedApi() {
    const { data: session, isPending } = authClient.useSession();

    const api = {
        properties: propertiesApi,
    };

    return {
        api,
        session,
        isAuthenticated: !!session?.user,
        isLoading: isPending,
    };
}