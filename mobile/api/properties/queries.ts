import { client } from '../client';
import { API_ENDPOINTS } from '../config';
import type { PropertyWithIncludes } from './types';

export const getProperties = async (): Promise<PropertyWithIncludes[]> => {
    const response = await client.get<PropertyWithIncludes[]>(API_ENDPOINTS.PROPERTIES);

    if (response.status === 'error') {
        throw new Error(response.message || 'Failed to fetch properties');
    }

    return response.data || [];
};

export const getProperty = async (id: string): Promise<PropertyWithIncludes> => {
    const response = await client.get<PropertyWithIncludes>(`${API_ENDPOINTS.PROPERTIES}/${id}`);

    if (response.status === 'error') {
        throw new Error(response.message || 'Failed to fetch property');
    }

    if (!response.data) {
        throw new Error('Property not found');
    }

    return response.data;
};
