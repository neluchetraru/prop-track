export interface Property {
    id: string;
    name: string;
    notes?: string;
    value?: number;
    currency?: string;
    type: 'HOUSE' | 'APARTMENT' | 'VILLA' | 'COMMERCIAL';
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PropertyLocation {
    id: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
}

export interface Tenant {
    id: string;
    name: string;
    email: string;
    phone: string;
    propertyId: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: Date;
    updatedAt: Date;
}

export interface PropertyDocument {
    id: string;
    url: string;
    propertyId: string;
    type: 'PERSONAL' | 'PROPERTY_REGISTRATION' | 'PROPERTY_UTILITY' | 'OTHER';
}

export interface Image {
    id: string;
    url: string;
    propertyId: string;
}

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

// Form types
export interface PropertyFormData {
    name: string;
    notes?: string;
    value?: number;
    currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
    type: 'HOUSE' | 'APARTMENT' | 'VILLA' | 'COMMERCIAL';
    propertyLocation: {
        address: string;
        city: string;
        country: string;
        postalCode: string;
    };
    tenants?: Array<{
        name: string;
        email: string;
        phone?: string;
        leaseStartDate?: string;
        leaseEndDate?: string;
        monthlyRent?: number;
    }>;
    images?: Array<{ uri: string; name: string; type: string }>;
    documents?: Array<{ uri: string; name: string; type: string }>;
}
