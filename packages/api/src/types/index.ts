import type { BetterFetch } from 'better-auth/react';
import type { PropertyEndpoints } from '@prop-track/types';

export interface ApiConfig {
    fetcher: BetterFetch;
    baseURL: string;
}

export interface ApiResponse<T> {
    data: T;
}

export interface Api {
    properties: PropertyEndpoints;
} 