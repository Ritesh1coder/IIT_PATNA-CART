import prisma from "../config/db.js";
import { sendOTP } from "../config/mail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const otpStore = new Map();

export async function registerUser(req, res) {
  const { roll_number, email, password, name } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { roll_number: roll_number },
    });
    const saltRounds = 10;
    if (existingUser) {
      res.status(400).json({
        message: "User exists already. Login Instead",
      });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await prisma.user.create({
      data: {
        roll_number: roll_number,
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    res.status(200).json({
      message: "User created successfully",
    });
  } catch (error) {
    throw error;
  }
}
export async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!existingUser) {
      res.status(404).json({
        message: "User not found",
      });
    }

    bcrypt.compare(password, existingUser.password, function (err, result) {
      if (result == true) {
        const token = jwt.sign(
          { id: existingUser.roll_number },
          process.env.JWT_KEY,
          { expiresIn: "1d" }
        );
        res.status(200).json({
          token: token,
          message: "User logged in successfully",
        });
      } else {
        res.status(400).json({
          message: "Incorrect Credentials",
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      message: "some error occured",
    });
  }
}
export async function sendOTPtoEmail(req, res) {
  const { roll_number } = req.body;
  console.log(req.body);
  const userEmail = `${roll_number}@students.iitmandi.ac.in`;
  console.log(userEmail);
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    if (existingUser) {
      res.status(400).json({
        message: "User already exists",
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(userEmail, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    await sendOTP(userEmail, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    throw error;
  }
}
