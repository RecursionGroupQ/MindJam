import React, { createContext, useState, useMemo } from "react";
import Konva from "konva";

export const fills = ["#6B7280", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

export const CANVAS_WIDTH = window.innerWidth;
export const CANVAS_HEIGHT = window.innerHeight;

const generateNodes = () => {
  const nodes = [];
  for (let i = 0; i < 4; i += 1) {
    nodes.push({
      id: i,
      children: [],
      text: `node-${i}`,
      shapeType: "rect" as ShapeType,
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      fill: fills[Math.floor(Math.random() * fills.length)],
      isDragging: false,
    });
  }
  return nodes;
};

export type ShapeType = "rect" | "circle";

export type Node = {
  id: number;
  children: number[];
  text: string;
  shapeType: ShapeType;
  x: number;
  y: number;
  isDragging: boolean;
  fill: string;
};

type Props = {
  children: React.ReactNode;
};

type IRoomContext = {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  selectedNode: Node | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
  shapeRefs: React.RefObject<Konva.Group>[];
  setShapeRefs: React.Dispatch<React.SetStateAction<React.RefObject<Konva.Group>[]>>;
  shapeType: ShapeType;
  setShapeType: React.Dispatch<React.SetStateAction<ShapeType>>;
};

export const RoomContext: React.Context<IRoomContext> = createContext({} as IRoomContext);

export const RoomContextProvider: React.FC<Props> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>(generateNodes());
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [shapeRefs, setShapeRefs] = useState<React.RefObject<Konva.Group>[]>([]);
  const [shapeType, setShapeType] = useState<ShapeType>("rect");
  const value = useMemo(
    () => ({
      nodes,
      setNodes,
      selectedNode,
      setSelectedNode,
      shapeRefs,
      setShapeRefs,
      shapeType,
      setShapeType,
    }),
    [nodes, selectedNode, shapeRefs, shapeType]
  );

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
