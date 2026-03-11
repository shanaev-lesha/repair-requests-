import express from "express";
import { getRequests } from "../controllers/requestController.js";

const router = express.Router();

router.get("/", getRequests);

export default router;