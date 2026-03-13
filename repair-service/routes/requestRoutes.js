import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    createRequest,
    getMyRequests,
    startRequest,
    finishRequest
} from "../controllers/requestController.js"

const router = express.Router()

router.post("/", createRequest);
router.get("/my", authMiddleware, getMyRequests)
router.put("/:id/start", authMiddleware, startRequest)
router.put("/:id/finish", authMiddleware, finishRequest)

export default router


