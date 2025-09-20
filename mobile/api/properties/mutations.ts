import { client } from '../client';
import { API_ENDPOINTS } from '../config';
import type { CreatePropertyInput, UpdatePropertyInput, Property } from './types';

export const createProperty = async (property: CreatePropertyInput): Promise<Property> => {
    const response = await client.post<Property>(API_ENDPOINTS.PROPERTIES, property);

    if (response.status === 'error') {
        throw new Error(response.message || 'Failed to create property');
    }

    if (!response.data) {
        throw new Error('Failed to create property');
    }

    return response.data;
};

export const updateProperty = async (id: string, property: UpdatePropertyInput): Promise<Property> => {
    const response = await client.put<Property>(`${API_ENDPOINTS.PROPERTIES}/${id}`, property);

    if (response.status === 'error') {
        throw new Error(response.message || 'Failed to update property');
    }

    if (!response.data) {
        throw new Error('Failed to update property');
    }

    return response.data;
};

export const deleteProperty = async (id: string): Promise<void> => {
    const response = await client.delete(`${API_ENDPOINTS.PROPERTIES}/${id}`);

    if (response.status === 'error') {
        throw new Error(response.message || 'Failed to delete property');
    }
};
