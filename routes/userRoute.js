import express from "express";
const router = express.Router();

import {
  addCategory,
  allCategories,
  allUsers,
  approveUser,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

router.route("/register").post(registerUser).patch(approveUser);
router.route("/login").post(loginUser);
router.route("/allUsers").get(allUsers);
router.route("/categories").get(authenticateUser, allCategories);
router.route("/profile/:id").patch(authenticateUser, addCategory);

export default router;
