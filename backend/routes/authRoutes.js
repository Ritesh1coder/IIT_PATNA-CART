import express from "express";
import {
  loginUser,
  registerUser,
  sendOTPtoEmail,
} from "../controllers/authController.js";
const authRouter = express.Router();

authRouter.post("/send-otp", sendOTPtoEmail);
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

export default authRouter;
