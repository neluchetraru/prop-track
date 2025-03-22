import type { Property } from '@prop-track/database';
import type { BetterFetch } from 'better-auth/react';


// Create the API factory
export const createApi = (fetcher: BetterFetch, baseURL: string) => {

    return {
        properties: {
            list: async (): Promise<Property[]> => {
                const response = await fetcher(`/properties`, {
                    method: "GET",
                    baseURL,
                }) as { data: Property[] };
                return response.data;
            },

            create: async (property: Omit<Property, 'id'>): Promise<Property> => {
                const response = await fetcher(`/properties`, {
                    method: "POST",
                    body: property,
                    baseURL,
                }) as { data: Property };
                return response.data;
            },

            get: async (id: string): Promise<Property> => {
                const response = await fetcher(`/properties/${id}`, {
                    method: "GET",
                    baseURL,
                }) as { data: Property };
                return response.data;
            },

            update: async (id: string, property: Partial<Property>): Promise<Property> => {
                const response = await fetcher(`/properties/${id}`, {
                    method: "PATCH",
                    body: property,
                    baseURL,
                }) as { data: Property };
                return response.data;
            },

            delete: async (id: string): Promise<void> => {
                await fetcher(`/properties/${id}`, {
                    method: "DELETE",
                    baseURL,
                });
            },
        },
    };
};

// Export types
export type Api = ReturnType<typeof createApi>; 