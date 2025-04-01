import type { BetterFetch } from 'better-auth/react';
import type { Api } from './types';
import { createPropertyEndpoints } from './endpoints/properties';

export * from './types';

export const createApi = (fetcher: BetterFetch, baseURL: string): Api => {
    const config = { fetcher, baseURL };

    return {
        properties: createPropertyEndpoints(config),
    };
}; 