import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import contentRoutes from "./routes/content.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use("/auth", authRoutes);
app.use("/content", contentRoutes);


app.get("/health", (req, res) => {
    return res.status(200).json({
        message: "Server is healthy!",
    })
});

app.use((req, res, next) => {
    res.status(404).json({
        message: "Route not found"
    });
});

app.use((err, req, res, next) => {
    return res.status(500).json({
        message: err.message || "Something went wrong"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});