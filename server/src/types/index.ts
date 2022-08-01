type ShapeType = "rect" | "ellipse" | "polygon";

export type Node = {
  id: string;
  children: string[];
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
