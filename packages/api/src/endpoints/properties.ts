import type { Property, PropertyEndpoints, CreatePropertyInput, UpdatePropertyInput, ApiResponse, PropertyWithIncludes } from '@prop-track/types';
import type { ApiConfig } from '../types';

export const createPropertyEndpoints = ({ fetcher, baseURL }: ApiConfig): PropertyEndpoints => ({
    list: async () => {
        const response = await fetcher(`/properties`, {
            method: "GET",
            baseURL,
        }) as ApiResponse<PropertyWithIncludes[]>;

        if (response.status === 'error') {
            throw new Error(response.message);
        }

        return response.data;
    },

    create: async (property: CreatePropertyInput) => {
        const response = await fetcher(`/properties`, {
            method: "POST",
            body: property,
            baseURL,
        }) as ApiResponse<Property>;

        if (response.status === 'error') {
            throw new Error(response.message);
        }

        return response.data;
    },

    get: async (id: string) => {
        const response = await fetcher(`/properties/${id}`, {
            method: "GET",
            baseURL,
        }) as ApiResponse<PropertyWithIncludes>;

        if (response.status === 'error') {
            throw new Error(response.message);
        }

        return response.data;
    },

    update: async (id: string, property: UpdatePropertyInput) => {
        const response = await fetcher(`/properties/${id}`, {
            method: "PATCH",
            body: property,
            baseURL,
        }) as ApiResponse<Property>;

        if (response.status === 'error') {
            throw new Error(response.message);
        }

        return response.data;
    },

    delete: async (id: string) => {
        const response = await fetcher(`/properties/${id}`, {
            method: "DELETE",
            baseURL,
        }) as ApiResponse<void>;

        if (response.status === 'error') {
            throw new Error(response.message);
        }
    },
}); 