import React, { createContext, useState, useMemo } from "react";
import Konva from "konva";

export const fills = ["#6B7280", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

export const CANVAS_WIDTH = window.innerWidth;
export const CANVAS_HEIGHT = window.innerHeight;

export type ShapeType = "rect" | "ellipse" | "star";

const generateNodes = () => {
  const nodes = [];
  for (let i = 0; i < 4; i += 1) {
    nodes.push({
      id: i.toString(),
      children: [],
      text: `node-${i}`,
      shapeType: "star" as ShapeType,
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      width: 380,
      height: 90,
      fillStyle: "",
      strokeStyle: fills[Math.floor(Math.random() * fills.length)],
    });
  }
  return nodes;
};

type Props = {
  children: React.ReactNode;
};

export type Node = {
  id: string;
  children: string[];
  text: string;
  shapeType: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  fillStyle: string;
  strokeStyle: string;
};

type StageConfig = {
  stageScale: number;
  stageX: number;
  stageY: number;
};

type StageStyle = {
  backgroundColor: string;
  opacity: number;
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
};

type IRoomContext = {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  selectedNode: Node | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
  shapeType: ShapeType;
  setShapeType: React.Dispatch<React.SetStateAction<ShapeType>>;
  fillStyle: string;
  setFillStyle: React.Dispatch<React.SetStateAction<string>>;
  strokeStyle: string;
  setStrokeStyle: React.Dispatch<React.SetStateAction<string>>;
  selectedShapes: Konva.Group[];
  setSelectedShapes: React.Dispatch<React.SetStateAction<Konva.Group[]>>;
  stageConfig: StageConfig;
  setStageConfig: React.Dispatch<React.SetStateAction<StageConfig>>;
  stageStyle: StageStyle;
  setStageStyle: React.Dispatch<React.SetStateAction<StageStyle>>;
  displayColorPicker: boolean;
  setDisplayColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
};

export const RoomContext: React.Context<IRoomContext> = createContext({} as IRoomContext);

export const RoomContextProvider: React.FC<Props> = ({ children }) => {
  const [nodes, setNodes] = useState<Node[]>(generateNodes());
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [shapeType, setShapeType] = useState<ShapeType>("rect");
  const [fillStyle, setFillStyle] = useState<string>("#ffffff");
  const [strokeStyle, setStrokeStyle] = useState<string>("#0000ff");
  const [selectedShapes, setSelectedShapes] = useState<Konva.Group[]>([]);
  const [stageConfig, setStageConfig] = useState<StageConfig>({
    stageScale: 0.8,
    stageX: 0,
    stageY: 0,
  });
  const [stageStyle, setStageStyle] = useState<StageStyle>({
    backgroundColor: "#f8fafc",
    opacity: 0.8,
    backgroundImage: "radial-gradient(#6b7280 1.1px, #f8fafc 1.1px)",
    backgroundSize: `${50 * stageConfig.stageScale}px ${50 * stageConfig.stageScale}px`,
    backgroundPosition: "0px 0px",
  });
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const value = useMemo(
    () => ({
      nodes,
      setNodes,
      selectedNode,
      setSelectedNode,
      shapeType,
      setShapeType,
      fillStyle,
      setFillStyle,
      strokeStyle,
      setStrokeStyle,
      selectedShapes,
      setSelectedShapes,
      stageConfig,
      setStageConfig,
      stageStyle,
      setStageStyle,
      displayColorPicker,
      setDisplayColorPicker,
    }),
    [
      nodes,
      selectedNode,
      selectedShapes,
      stageConfig,
      stageStyle,
      shapeType,
      fillStyle,
      strokeStyle,
      displayColorPicker,
    ]
  );

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
