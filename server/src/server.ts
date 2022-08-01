import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
// eslint-disable-next-line import/no-unresolved, import/extensions
import roomController from "./controllers/roomController";

const PORT = 8080;
const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a client has connected");

  socket.emit("connection-success");

  roomController(socket);

  socket.on("disconnect", () => {
    console.log("a client has disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`server is running on ${PORT}...`);
});
