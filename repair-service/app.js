import express from "express";
import requestRoutes from "./routes/requestRoutes.js";
import authRoutes from "./routes/authRoutes.js"

const app = express();

app.use(express.json());

app.use("/requests", requestRoutes);
app.use("/auth", authRoutes)

export default app;
