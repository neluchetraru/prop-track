import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Backend is running with TypeScript!" });
});

const PORT = process.env.PORT || 3000;

// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
