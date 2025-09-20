// API Configuration
export const API_CONFIG = {
    BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.0.103:3000',
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json',
    },
} as const;

export const API_ENDPOINTS = {
    PROPERTIES: '/api/properties',
    AUTH: '/api/auth',
} as const;
