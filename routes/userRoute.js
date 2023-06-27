import express from "express";
const router = express.Router();

import {
  loginUser,
  registerUser,
  verifyUser,
} from "../controllers/userController.js";

router.route("/register").post(registerUser).patch(verifyUser);
router.route("/login").post(loginUser);

export default router;
