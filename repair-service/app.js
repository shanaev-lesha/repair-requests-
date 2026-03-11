import express from "express";
import requestRoutes from "./routes/requestRoutes.js";

const app = express();

app.use(express.json());

app.use("/requests", requestRoutes);

export default app;
