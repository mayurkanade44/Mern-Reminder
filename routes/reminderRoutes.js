import express from "express";
import {
  addReminder,
  allReminders,
  autoRenew,
  deleteReminder,
  editReminder,
  expiryFile,
  reminderAlert,
  reminderFile,
  reminderStats,
  singleReminder,
} from "../controllers/reminderController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/add-update").post(authenticateUser, addReminder);
router.route("/allReminders").get(authenticateUser, allReminders);
router.route("/reminderStats").get(authenticateUser, reminderStats);
router
  .route("/singleReminder/:id")
  .get(authenticateUser, singleReminder)
  .patch(authenticateUser, editReminder)
  .delete(authenticateUser, deleteReminder);
router.route("/reminderFile").get(reminderFile);
router.route("/expiryFile").get(expiryFile);
router.route("/sendAlert").get(reminderAlert);
router.route("/autoRenew").put(autoRenew);

export default router;
