import React, { createContext, useState, useMemo, useEffect } from "react";
import Konva from "konva";
import { nanoid } from "nanoid";

export const fills = ["#6B7280", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

export const CANVAS_WIDTH = window.innerWidth;
export const CANVAS_HEIGHT = window.innerHeight;

const generateNodes = () => {
  const nodes = new Map<string, Node>();
  for (let i = 0; i < 4; i += 1) {
    const id = nanoid();
    nodes.set(id, {
      id,
      children: [],
      text: `node-${id}`,
      shapeType: "rect" as ShapeType,
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      width: 200,
      height: 200,
      fill: fills[Math.floor(Math.random() * fills.length)],
    });
  }
  return nodes;
};

export type ShapeType = "rect" | "ellipse";

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
  fill: string;
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
  nodes: Map<string, Node>;
  setNodes: React.Dispatch<React.SetStateAction<Map<string, Node>>>;
  selectedNode: Node | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
  shapeType: ShapeType;
  setShapeType: React.Dispatch<React.SetStateAction<ShapeType>>;
  selectedShapes: Konva.Group[];
  setSelectedShapes: React.Dispatch<React.SetStateAction<Konva.Group[]>>;
  stageConfig: StageConfig;
  setStageConfig: React.Dispatch<React.SetStateAction<StageConfig>>;
  stageStyle: StageStyle;
  setStageStyle: React.Dispatch<React.SetStateAction<StageStyle>>;
};

export const RoomContext: React.Context<IRoomContext> = createContext({} as IRoomContext);

export const RoomContextProvider: React.FC<Props> = ({ children }) => {
  // const [nodes, setNodes] = useState<Node[]>(generateNodes());
  const [nodes, setNodes] = useState<Map<string, Node>>(generateNodes());
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [shapeType, setShapeType] = useState<ShapeType>("rect");
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

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setStageStyle((prevState) => ({
        ...prevState,
        backgroundColor: "#6b7280",
        backgroundImage: "radial-gradient(#cbd5e1 1.1px, #6b7280 1.1px)",
      }));
    }
  }, []);

  const value = useMemo(
    () => ({
      nodes,
      setNodes,
      selectedNode,
      setSelectedNode,
      shapeType,
      setShapeType,
      selectedShapes,
      setSelectedShapes,
      stageConfig,
      setStageConfig,
      stageStyle,
      setStageStyle,
    }),
    [nodes, selectedNode, selectedShapes, stageConfig, stageStyle, shapeType]
  );

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
