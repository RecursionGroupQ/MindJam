import { Socket } from "socket.io";
// eslint-disable-next-line import/no-unresolved, import/extensions
import { DeleteRoomNodesPayload, UpdateRoomPayload } from "../types";

const roomController = (socket: Socket) => {
  const joinRoom = ({ roomId }: { roomId: string }) => {
    socket.join(roomId);
    console.log(`a client has joined room ${roomId}`);
    socket.emit("room-joined", { roomId });
  };

  const leaveRoom = ({ roomId }: { roomId: string }) => {
    if (socket.rooms.has(roomId)) {
      socket.leave(roomId);
      console.log(`a client has left a room ${roomId}`);
    }
  };

  const updateRoom = (payload: UpdateRoomPayload) => {
    const { roomId } = payload;
    if (socket.rooms.has(roomId)) {
      socket.broadcast.to(roomId).emit("get-room-update", payload);
    }
  };

  const deleteRoomNodes = (payload: DeleteRoomNodesPayload) => {
    const { roomId } = payload;
    if (socket.rooms.has(roomId)) {
      socket.broadcast.to(roomId).emit("get-room-delete-nodes", payload);
    }
  };

  socket.on("join-room", joinRoom);
  socket.on("leave-room", leaveRoom);
  socket.on("update-room", updateRoom);
  socket.on("delete-room-nodes", deleteRoomNodes);
};

export default roomController;
