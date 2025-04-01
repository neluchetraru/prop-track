import express from "express";
import { propertyService } from "../services";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

// Get all properties for the authenticated user
router.get("/", requireAuth, async (req, res) => {
    try {
        const properties = await propertyService.list(req.user?.id);
        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch properties" });
    }
});

// Get a specific property
router.get("/:id", requireAuth, async (req, res) => {
    try {
        const property = await propertyService.getById(req.params.id, req.user?.id!);
        if (!property) {
            res.status(404).json({ error: "Property not found" });
            return
        }
        res.json(property);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch property" });
    }
});

// Create a new property
router.post("/", requireAuth, async (req, res) => {
    try {
        const property = await propertyService.create(req.user?.id!, req.body);

        res.status(201).json(property);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to create property" });
    }
});

// Update a property
router.put("/:id", requireAuth, async (req, res) => {
    try {
        const property = await propertyService.update(req.params.id, req.user?.id!, req.body);
        res.json(property);
    } catch (error) {
        if (error instanceof Error && error.message === "Property not found") {
            res.status(404).json({ error: error.message });
            return
        }
        res.status(500).json({ error: "Failed to update property" });
    }
});

// Delete a property
router.delete("/:id", requireAuth, async (req, res) => {
    try {
        await propertyService.delete(req.params.id, req.user?.id!);
        res.status(204).send();
    } catch (error) {
        if (error instanceof Error && error.message === "Property not found") {
            res.status(404).json({ error: error.message });
            return
        }
        res.status(500).json({ error: "Failed to delete property" });
    }
});

export default router; 