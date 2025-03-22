import { prisma } from "@prop-track/database";
import type { Property, Prisma } from "@prop-track/database";

export class PropertyService {
    async list(userId?: string): Promise<Property[]> {
        if (!userId) {
            throw new Error("User ID is required");
        }

        console.log("userId", userId);

        return prisma.property.findMany({
            where: {
                userId: userId
            }
        });
    }

    async create(data: Prisma.PropertyCreateInput): Promise<Property> {
        return prisma.property.create({
            data
        });
    }

    async getById(id: string, userId: string): Promise<Property | null> {
        return prisma.property.findFirst({
            where: {
                id,
                userId
            }
        });
    }

    async update(id: string, userId: string, data: Prisma.PropertyUpdateInput): Promise<Property> {
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