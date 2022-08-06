type ShapeType = "rect" | "ellipse" | "polygon";

export type Child = {
  id: string;
  color: string;
};

export type Node = {
  id: string;
  children: Child[];
  parents: string[];
  text: string;
  shapeType: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  fillStyle: string;
  strokeStyle: string;
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

export type RoomUser = {
  socketId: string;
  user: {
    name: string | null;
    photoURL: string | null;
    color: string;
  };
};

export type RoomUsers = {
  colorIdx: number;
  users: RoomUser[];
};
