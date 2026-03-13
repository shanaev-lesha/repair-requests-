import express from "express";
import requestRoutes from "./routes/requestRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import path from "path"
import { fileURLToPath } from "url"

const app = express();
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/requests", requestRoutes);
app.use("/auth", authRoutes)

app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

export default app;
