import dotenv from "dotenv";
dotenv.config();

// Then your other imports
import express from "express";
import cors from "cors";
import sendRoutes from "./routes/sms.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/sms", sendRoutes);

// Health check (optional, can remove if you want absolute minimal)
app.get("/", (req, res) => {
    res.json({ message: "Server is running 🚀" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
