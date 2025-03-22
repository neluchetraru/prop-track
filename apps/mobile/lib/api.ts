import { createApi } from "@prop-track/api";
import { authClient } from "@/lib/auth-client";

export const api = createApi(authClient.$fetch); 