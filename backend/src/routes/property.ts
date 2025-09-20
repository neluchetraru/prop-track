import express from "express";
import { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty } from "../services/property";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

// Helper function for consistent API responses
const successResponse = <T>(data: T, message = "Operation successful") => ({
    status: 'success' as const,
    data,
    message
});

const errorResponse = (message: string, statusCode = 500) => ({
    status: 'error' as const,
    message
});

// Get all properties for the authenticated user
router.get("/", requireAuth, async (req, res) => {
    try {
        const properties = await getProperties(req.user?.id!);
        res.json(successResponse(properties));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to fetch properties"));
    }
});

// Get a specific property
router.get("/:id", requireAuth, async (req, res) => {
    try {
        const property = await getPropertyById(req.params.id, req.user?.id!);
        if (!property) {
            res.status(404).json(errorResponse("Property not found"));
            return;
        }
        res.json(successResponse(property));
    } catch (error) {
        res.status(500).json(errorResponse("Failed to fetch property"));
    }
});

// Create a new property
router.post("/", requireAuth, async (req, res) => {
    try {
        const property = await createProperty(req.user?.id!, req.body);
        res.status(201).json(successResponse(property, "Property created successfully"));
    } catch (error) {
        console.log(error);
        res.status(500).json(errorResponse("Failed to create property"));
    }
});

// Update a property
router.put("/:id", requireAuth, async (req, res) => {
    try {
        const property = await updateProperty(req.params.id, req.user?.id!, req.body);
        res.json(successResponse(property, "Property updated successfully"));
    } catch (error) {
        if (error instanceof Error && error.message === "Property not found") {
            res.status(404).json(errorResponse(error.message));
            return;
        }
        res.status(500).json(errorResponse("Failed to update property"));
    }
});

// Delete a property
router.delete("/:id", requireAuth, async (req, res) => {
    try {
        await deleteProperty(req.params.id, req.user?.id!);
        res.status(200).json(successResponse(null, "Property deleted successfully"));
    } catch (error) {
        if (error instanceof Error && error.message === "Property not found") {
            res.status(404).json(errorResponse(error.message));
            return;
        }
        res.status(500).json(errorResponse("Failed to delete property"));
    }
});

export default router; 