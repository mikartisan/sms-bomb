import express from "express";
import { send } from "../controllers/smsController.js";

const router = express.Router();

// POST /api/sms/send
router.post("/send", send);

export default router;
