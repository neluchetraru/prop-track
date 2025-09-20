import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";
import propertyRoutes from "./routes/property";
import { getSession } from "./middleware/auth";

import morgan from "morgan"

dotenv.config();

const app = express();


// Configure CORS
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(morgan(process.env.ENVIRONMENT === "development" ? "dev" : "combined"));


// Add auth routes
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

// Add session middleware
app.use(getSession);

// Add routes

app.get("/", (req, res) => {
    res.json({ message: "Backend is running with TypeScript!" });
});

app.use("/api/properties", propertyRoutes);

const PORT = process.env.PORT || 3000;

// Only start the server if this file is run directly
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;
