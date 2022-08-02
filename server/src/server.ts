import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import roomController from "./controllers/roomController";
import { RoomUsers } from "./types";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());

app.get("/", (_, res) => {
  res.send("MINDMAP BACKEND SERVER IS RUNNING!");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// currently online users for each room
const roomUsers: Map<string, RoomUsers> = new Map();

io.on("connection", (socket) => {
  console.log("a client has connected");

  socket.emit("connection-success");

  roomController(socket, roomUsers);

  socket.on("disconnect", () => {
    console.log("a client has disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`server is running on ${PORT}...`);
});
