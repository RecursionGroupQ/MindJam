import { Socket } from "socket.io";
import { DeleteRoomNodesPayload, RoomUsers, RoomUser, UpdateRoomPayload } from "../types";

const userColors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

const roomController = (socket: Socket, roomUsers: Map<string, RoomUsers>) => {
  const joinRoom = ({ roomId, user }: { roomId: string; user: { name: string; photoURL: string } }) => {
    const currUsers = roomUsers.get(roomId);
    let color: string;
    if (!currUsers) {
      // eslint-disable-next-line prefer-destructuring
      color = userColors[0];
      roomUsers.set(roomId, {
        colorIdx: 1,
        users: [{ socketId: socket.id, user: { ...user, color } } as RoomUser],
      });
    } else {
      socket.emit("get-room-users", currUsers.users);
      color = userColors[currUsers.colorIdx];
      roomUsers.set(roomId, {
        colorIdx: (currUsers.colorIdx + 1) % userColors.length,
        users: [...currUsers.users, { socketId: socket.id, user: { ...user, color } } as RoomUser],
      });
    }
    socket.join(roomId);
    console.log(`a client has joined room ${roomId}`);
    socket.broadcast.to(roomId).emit("user-joined", { socketId: socket.id, user: { ...user, color } } as RoomUser);
  };

  const leaveRoom = ({ roomId }: { roomId: string }) => {
    if (socket.rooms.has(roomId)) {
      socket.leave(roomId);
      console.log(`a client has left a room ${roomId}`);
      const currUsers = roomUsers.get(roomId);
      if (currUsers) {
        roomUsers.set(roomId, { ...currUsers, users: currUsers.users.filter((user) => user.socketId !== socket.id) });
      }
      if (roomUsers.get(roomId)?.users.length === 0) {
        roomUsers.delete(roomId);
      }
      socket.broadcast.to(roomId).emit("user-left", { socketId: socket.id });
    }
  };

  const updateRoom = (payload: UpdateRoomPayload) => {
    const { roomId } = payload;
    if (socket.rooms.has(roomId)) {
      socket.broadcast.to(roomId).emit("get-room-update", payload);
    }
  };

  const updateUserMouse = ({ roomId, userCursor }: { roomId: string; userCursor: { x: number; y: number } }) => {
    socket.broadcast.to(roomId).emit("get-user-mouse-update", { socketId: socket.id, userCursor });
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
  socket.on("update-user-mouse", updateUserMouse);
  socket.on("delete-room-nodes", deleteRoomNodes);
  socket.on("disconnecting", () => {
    socket.rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        leaveRoom({ roomId });
      }
    });
  });
};

export default roomController;
