import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoutes.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (rollNumber) => {
    socket.join(rollNumber);
    console.log(`User ${rollNumber} joined room`);
  });

  socket.on("sendMessage", async (data) => {
    const { sender, receiver, message } = data;
    io.to(receiver).emit("receiveMessage", { sender, message });

    await prisma.chatMessage.create({
      data: {
        sender,
        receiver,
        message,
      },
    });

    console.log(`Message sent from ${sender} to ${receiver}: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.listen(3000, () => console.log("Server running on port 3000"));
