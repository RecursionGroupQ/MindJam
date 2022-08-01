import { useCallback, useContext } from "react";
import { Node, RoomContext } from "../context/RoomContext";
import { SocketContext, UpdateRoomPayload, DeleteRoomNodesPayload } from "../context/SocketContext";

const useSocket = () => {
  const { socket } = useContext(SocketContext);
  const { roomId } = useContext(RoomContext);

  const joinRoom = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit("join-room", { roomId });
  }, [socket, roomId]);

  const leaveRoom = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit("leave-room", { roomId });
  }, [socket, roomId]);

  const updateRoom = useCallback(
    (data: Node[]) => {
      if (!socket || !roomId) return;
      const payload: UpdateRoomPayload = {
        roomId,
        data,
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

  return { joinRoom, leaveRoom, updateRoom, deleteRoomNodes };
};

export default useSocket;
