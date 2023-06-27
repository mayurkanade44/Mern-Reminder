import express from "express";
import { addReminder } from "../controllers/reminderController.js";
const router = express.Router();

router.route("/add-update").post(addReminder);

export default router;
