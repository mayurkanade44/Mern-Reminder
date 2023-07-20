import express from "express";
const router = express.Router();

import {
  addCategory,
  allCategories,
  allUsers,
  approveUser,
  loginUser,
  logout,
  registerUser,
  updateUser,
} from "../controllers/userController.js";
import { authenticateUser, isAdmin } from "../middleware/authMiddleware.js";

router
  .route("/register")
  .post(registerUser)
  .patch(authenticateUser, isAdmin, approveUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/allUsers").get(authenticateUser, isAdmin, allUsers);
router.route("/categories").get(authenticateUser, allCategories);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/profile/:id").patch(authenticateUser, addCategory);

export default router;
