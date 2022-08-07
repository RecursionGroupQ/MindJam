import { useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Node, RoomContext, UserCursor } from "../context/RoomContext";
import { SocketContext, UpdateRoomPayload, DeleteRoomNodesPayload, UpdateRoomTypes } from "../context/SocketContext";

const useSocket = () => {
  const { socket } = useContext(SocketContext);
  const { roomId } = useContext(RoomContext);
  const { authState } = useContext(AuthContext);

  const joinRoom = useCallback(() => {
    if (!socket || !roomId || !authState.user) return;
    socket.emit("join-room", { roomId, user: { name: authState.user.displayName, photoURL: authState.user.photoURL } });
  }, [socket, roomId, authState.user]);

  const leaveRoom = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit("leave-room", { roomId });
  }, [socket, roomId]);

  const updateUserMouse = useCallback(
    (userCursor: UserCursor) => {
      if (!socket || !roomId) return;
      socket.emit("update-user-mouse", { roomId, userCursor });
    },
    [roomId, socket]
  );

  const updateRoom = useCallback(
    (data: Node[], type: UpdateRoomTypes) => {
      if (!socket || !roomId) return;
      const payload: UpdateRoomPayload = {
        roomId,
        data,
        type,
      };
      socket.emit("update-room", payload);
    },
    [socket, roomId]
  );

  const deleteRoomNodes = useCallback(
    (nodesToUpdate: Node[], nodesToDelete: Node[]) => {
      if (!socket || !roomId) return;
      const payload: DeleteRoomNodesPayload = {
        roomId,
        data: {
          nodesToUpdate,
          nodesToDelete,
        },
      };
      socket.emit("delete-room-nodes", payload);
    },
    [socket, roomId]
  );

  return { joinRoom, leaveRoom, updateRoom, deleteRoomNodes, updateUserMouse };
};

export default useSocket;
