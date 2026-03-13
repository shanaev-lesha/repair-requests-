import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
    createRequest,
    getMyRequests,
    startRequest,
    finishRequest,
    getRequests,
    assignRequest,
    cancelRequest
} from "../controllers/requestController.js"

const router = express.Router()

router.post("/", createRequest);
router.get("/my", authMiddleware, getMyRequests)
router.put("/:id/start", authMiddleware, startRequest)
router.put("/:id/finish", authMiddleware, finishRequest)
router.get("/", authMiddleware, getRequests)
router.put("/:id/assign", authMiddleware, assignRequest)
router.put("/:id/cancel", authMiddleware, cancelRequest)


export default router


