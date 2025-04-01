import type { Property as PrismaProperty, Prisma } from "@prop-track/database";

// Re-export the Prisma Property type
export type Property = PrismaProperty;

// Create input types based on Prisma's generated types
export type CreatePropertyInput = Omit<Prisma.PropertyCreateInput, "user">;
export type UpdatePropertyInput = Prisma.PropertyUpdateInput;


type PropertyInclude = {
    user: true,
    images: true,
    documents: true,
    propertyLocation: true,
    propertyType: true,
    tenants: true,
}

export type PropertyWithIncludes = Prisma.PropertyGetPayload<{
    include: PropertyInclude;
}>;

export interface PropertyEndpoints {
    list: () => Promise<PropertyWithIncludes[]>;
    create: (property: CreatePropertyInput) => Promise<Property>;
    get: (id: string) => Promise<PropertyWithIncludes>;
    update: (id: string, property: UpdatePropertyInput) => Promise<Property>;
    delete: (id: string) => Promise<void>;
} 