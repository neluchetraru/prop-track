import type { Property, PropertyLocation, Tenant, PropertyDocument, Image, User } from '@prisma/client';

// Re-export Prisma types
export type { Property, PropertyLocation, Tenant, PropertyDocument, Image, User };

// Extended types with relations
export type PropertyWithIncludes = Property & {
    propertyLocation?: PropertyLocation | null;
    tenants?: Tenant[];
    images?: Image[];
    documents?: PropertyDocument[];
};

// API Input types
export interface CreatePropertyInput {
    name: string;
    notes?: string;
    value?: number;
    currency?: string;
    type: 'HOUSE' | 'APARTMENT' | 'VILLA' | 'COMMERCIAL';
    propertyLocation?: {
        address: string;
        city: string;
        country: string;
        postalCode: string;
        latitude?: number;
        longitude?: number;
    };
}

export interface UpdatePropertyInput {
    name?: string;
    notes?: string;
    value?: number;
    currency?: string;
    type?: 'HOUSE' | 'APARTMENT' | 'VILLA' | 'COMMERCIAL';
}

// API Response types
export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
}

// Property endpoints interface
export interface PropertyEndpoints {
    list: () => Promise<PropertyWithIncludes[]>;
    get: (id: string) => Promise<PropertyWithIncludes>;
    create: (property: CreatePropertyInput) => Promise<Property>;
    update: (id: string, property: UpdatePropertyInput) => Promise<Property>;
    delete: (id: string) => Promise<void>;
}
