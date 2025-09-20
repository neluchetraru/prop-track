import { PrismaClient } from '@prisma/client';
import type { Property, CreatePropertyInput, UpdatePropertyInput, PropertyWithIncludes } from '../types';

const prisma = new PrismaClient();

const defaultInclude = {
    propertyLocation: true,
    tenants: true,
    images: true,
    documents: true
} as const;

export async function getProperties(userId: string): Promise<PropertyWithIncludes[]> {
    return prisma.property.findMany({
        where: { userId },
        include: defaultInclude
    });
}

export async function getPropertyById(id: string, userId: string): Promise<PropertyWithIncludes | null> {
    return prisma.property.findFirst({
        where: { id, userId },
        include: defaultInclude
    });
}

export async function createProperty(userId: string, data: CreatePropertyInput): Promise<Property> {
    const { propertyLocation, ...propertyData } = data;

    const createData: any = {
        ...propertyData,
        userId
    };

    if (propertyLocation) {
        createData.propertyLocation = {
            create: propertyLocation
        };
    }

    return prisma.property.create({
        data: createData
    });
}

export async function updateProperty(id: string, userId: string, data: UpdatePropertyInput): Promise<Property> {
    // Check if property exists and belongs to user
    const existing = await prisma.property.findFirst({
        where: { id, userId }
    });

    if (!existing) {
        throw new Error("Property not found");
    }

    return prisma.property.update({
        where: { id },
        data
    });
}

export async function deleteProperty(id: string, userId: string): Promise<void> {
    // Check if property exists and belongs to user
    const existing = await prisma.property.findFirst({
        where: { id, userId }
    });

    if (!existing) {
        throw new Error("Property not found");
    }

    await prisma.property.delete({ where: { id } });
}
