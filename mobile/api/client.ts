import { API_CONFIG } from './config';
import { authClient } from '../lib/auth-client';
import * as SecureStore from "expo-secure-store";

export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
}

// Generic API request function with authentication
async function makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const cookies = authClient.getCookie();
    try {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                ...API_CONFIG.HEADERS,
                ...options.headers,
                "Cookie": cookies,
            },
        };


        const response = await fetch(url, config);

        if (!response.ok) {
            console.error('API request failed:', response);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return {
            status: 'success',
            data,
        };
    } catch (error) {
        console.error('API request failed:', error);
        return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// HTTP client with common methods
export const client = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        makeRequest<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, data?: any, options?: RequestInit) =>
        makeRequest<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }),

    put: <T>(endpoint: string, data?: any, options?: RequestInit) =>
        makeRequest<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }),

    delete: <T>(endpoint: string, options?: RequestInit) =>
        makeRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
