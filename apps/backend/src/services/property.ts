import { prisma } from "@prop-track/database";
import type { Property, CreatePropertyInput, UpdatePropertyInput, PropertyWithIncludes } from "@prop-track/types";
import type { Prisma } from "@prop-track/database";


export class PropertyService {
    async list(userId?: string, include?: Prisma.PropertyInclude): Promise<Partial<PropertyWithIncludes>[]> {
        if (!userId) {
            throw new Error("User ID is required");
        }

        return prisma.property.findMany({
            where: {
                userId: userId
            },
            include
        });
    }

    async create(userId: string, data: CreatePropertyInput): Promise<Property> {
        return prisma.property.create({
            data: {
                ...data,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    }

    async getById(id: string, userId: string, include?: Prisma.PropertyInclude): Promise<Property | null> {
        return prisma.property.findFirst({
            where: {
                id,
                userId
            },
            include
        });
    }

    async update(id: string, userId: string, data: UpdatePropertyInput): Promise<Property> {
        const property = await this.getById(id, userId);

        if (!property) {
            throw new Error("Property not found");
        }

        return prisma.property.update({
            where: { id },
            data
        });
    }

    async delete(id: string, userId: string): Promise<void> {
        const property = await this.getById(id, userId);

        if (!property) {
            throw new Error("Property not found");
        }

        await prisma.property.delete({
            where: { id }
        });
    }
}

export const propertyService = new PropertyService(); 