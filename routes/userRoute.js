import express from "express";
const router = express.Router();

import {
  addCategory,
  allCategories,
  loginUser,
  registerUser,
  verifyUser,
} from "../controllers/userController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

router.route("/register").post(registerUser).patch(verifyUser);
router.route("/login").post(loginUser);
router.route("/categories").get(authenticateUser, allCategories);
router.route("/profile/:id").patch(authenticateUser, addCategory);

export default router;
