import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import { Node, RoomContext, RoomUser, UserCursor } from "./RoomContext";

type Props = {
  children: React.ReactNode;
};

type ISocketContext = {
  socket: Socket;
};

export type UpdateRoomTypes = "update" | "history";

export type UpdateRoomPayload = {
  roomId: string;
  type: UpdateRoomTypes;
  data: Node[];
};

export type DeleteRoomNodesPayload = {
  roomId: string;
  data: {
    nodesToUpdate: Node[];
    nodesToDelete: Node[];
  };
};

export type UserJoinedPayload = {
  socketId: string;
  user: RoomUser;
};

export type GetUserMouseUpdatePayload = {
  socketId: string;
  userCursor: UserCursor;
};

const WS = process.env.REACT_APP_SERVER_HOST || "http://localhost:8080";

export const SocketContext = createContext<ISocketContext>({} as ISocketContext);

const socket = socketIOClient(WS);

export const SocketContextProvider: React.FC<Props> = ({ children }) => {
  const { setNodes, setRoomUsers, setUserCursors } = useContext(RoomContext);

  const connectionSuccess = () => {
    console.log("connection successful!");
  };

  // get-room-users
  const getRoomUsers = useCallback(
    (payload: UserJoinedPayload[]) => {
      const userCursors: Map<string, UserCursor> = new Map();
      const roomUsers: Map<string, RoomUser> = new Map();
      payload.forEach((user) => {
        roomUsers.set(user.socketId, user.user);
        userCursors.set(user.socketId, { x: 0, y: 0 });
      });
      setRoomUsers(roomUsers);
      setUserCursors(userCursors);
    },
    [setRoomUsers, setUserCursors]
  );

  const userJoined = useCallback(
    (payload: UserJoinedPayload) => {
      const { socketId, user } = payload;
      setRoomUsers((prevState) => {
        prevState.set(socketId, user);
        return new Map(prevState);
      });
      setUserCursors((prevState) => {
        prevState.set(socketId, { x: 0, y: 0 });
        return new Map(prevState);
      });
    },
    [setRoomUsers, setUserCursors]
  );

  const userLeft = useCallback(
    ({ socketId }: { socketId: string }) => {
      setRoomUsers((prevState) => {
        prevState.delete(socketId);
        return new Map(prevState);
      });
      setUserCursors((prevState) => {
        prevState.delete(socketId);
        return new Map(prevState);
      });
    },
    [setRoomUsers, setUserCursors]
  );

  const getRoomUpdate = useCallback(
    (payload: UpdateRoomPayload) => {
      const { data } = payload;
      if (payload.type === "update") {
        if (data) {
          data.forEach((node) => {
            setNodes((prevState) => {
              prevState.set(node.id, node);
              return new Map(prevState);
            });
          });
        }
      }
      if (payload.type === "history") {
        if (data) {
          const updatedNodes: Map<string, Node> = new Map();
          data.forEach((node) => {
            updatedNodes.set(node.id, node);
          });
          setNodes(updatedNodes);
        }
      }
    },
    [setNodes]
  );

  // get-user-mouse-update
  const getUserMouseUpdate = useCallback(
    (payload: GetUserMouseUpdatePayload) => {
      const { socketId, userCursor } = payload;
      setUserCursors((prevState) => {
        prevState.set(socketId, userCursor);
        return new Map(prevState);
      });
    },
    [setUserCursors]
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
    socket.on("get-room-users", getRoomUsers);
    socket.on("user-joined", userJoined);
    socket.on("user-left", userLeft);
    socket.on("get-room-update", getRoomUpdate);
    socket.on("get-room-delete-nodes", getRoomDeleteNodes);
    socket.on("get-user-mouse-update", getUserMouseUpdate);

    return () => {
      socket.off("connection-success", connectionSuccess);
      socket.off("get-room-users", getRoomUsers);
      socket.off("user-joined", userJoined);
      socket.off("user-left", userLeft);
      socket.off("get-room-update", getRoomUpdate);
      socket.off("get-room-delete-nodes", getRoomDeleteNodes);
      socket.off("get-user-mouse-update", getUserMouseUpdate);
    };
  }, [getRoomUpdate, getRoomDeleteNodes, userJoined, userLeft, getUserMouseUpdate, getRoomUsers]);

  const value = useMemo(
    () => ({
      socket,
    }),
    []
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
