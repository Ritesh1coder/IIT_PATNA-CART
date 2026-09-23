import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
  },
});

export const sendOTP = async (email, otp) => {   
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP for registration is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
};