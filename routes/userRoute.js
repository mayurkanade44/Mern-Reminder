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
import { authenticateUser, isAdmin } from "../middleware/authMiddleware.js";

router
  .route("/register")
  .post(registerUser)
  .patch(authenticateUser, isAdmin, approveUser);
router.route("/login").post(loginUser);
router.route("/allUsers").get(authenticateUser, isAdmin, allUsers);
router.route("/categories").get(authenticateUser, allCategories);
router.route("/profile/:id").patch(authenticateUser, addCategory);

export default router;
