import express from "express";
import { addReminder } from "../controllers/reminderController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/add-update").post(authenticateUser, addReminder);

export default router;
