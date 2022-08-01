import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { Node, RoomContext } from "./RoomContext";

type Props = {
  children: React.ReactNode;
};

type ISocketContext = {
  socket: Socket;
};

export type UpdateRoomPayload = {
  roomId: string;
  data: Node[];
};

export type DeleteRoomNodesPayload = {
  roomId: string;
  data: {
    nodesToUpdate: Node[];
    nodesToDelete: Node[];
  };
};

const WS = "http://localhost:8080";

export const SocketContext = createContext<ISocketContext>({} as ISocketContext);
const socket = socketIOClient(WS);

export const SocketContextProvider: React.FC<Props> = ({ children }) => {
  const { setNodes } = useContext(RoomContext);

  const connectionSuccess = () => {
    console.log("connection successful!");
  };

  const getRoomUpdate = useCallback(
    (payload: UpdateRoomPayload) => {
      const { data } = payload;
      if (data) {
        data.forEach((node) => {
          setNodes((prevState) => {
            prevState.set(node.id, node);
            return new Map(prevState);
          });
        });
      }
    },
    [setNodes]
  );

  // get-room-delete-nodes
  const getRoomDeleteNodes = useCallback(
    (payload: DeleteRoomNodesPayload) => {
      const { data } = payload;
      if (data) {
        const { nodesToUpdate, nodesToDelete } = data;
        setNodes((prevState) => {
          const updatedNodes = new Map(prevState);
          nodesToUpdate.forEach((node) => {
            updatedNodes.set(node.id, node);
          });
          nodesToDelete.forEach((node) => {
            updatedNodes.delete(node.id);
          });
          return updatedNodes;
        });
      }
    },
    [setNodes]
  );

  useEffect(() => {
    socket.on("connection-success", connectionSuccess);
    socket.on("get-room-update", getRoomUpdate);
    socket.on("get-room-delete-nodes", getRoomDeleteNodes);

    return () => {
      socket.off("connection-success", connectionSuccess);
      socket.off("get-room-update", getRoomUpdate);
      socket.off("get-room-delete-nodes", getRoomDeleteNodes);
    };
  }, [getRoomUpdate, getRoomDeleteNodes]);

  const value = useMemo(
    () => ({
      socket,
    }),
    []
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
