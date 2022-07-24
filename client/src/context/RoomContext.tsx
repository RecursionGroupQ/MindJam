import React, { createContext, useState, useMemo, useEffect } from "react";
import Konva from "konva";
import { nanoid } from "nanoid";

export const fills = ["#6B7280", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

export const CANVAS_WIDTH = window.innerWidth;
export const CANVAS_HEIGHT = window.innerHeight;

export type ShapeType = "rect" | "ellipse" | "star";

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
  nodes: Map<string, Node>;
  setNodes: React.Dispatch<React.SetStateAction<Map<string, Node>>>;
  selectedNode: Node | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
  shapeType: ShapeType;
  setShapeType: React.Dispatch<React.SetStateAction<ShapeType>>;
  fillStyle: string;
  setFillStyle: React.Dispatch<React.SetStateAction<string>>;
  strokeStyle: string;
  setStrokeStyle: React.Dispatch<React.SetStateAction<string>>;
  lineStyle: string;
  setLineStyle: React.Dispatch<React.SetStateAction<string>>;
  selectedShapes: Konva.Group[];
  setSelectedShapes: React.Dispatch<React.SetStateAction<Konva.Group[]>>;
  stageConfig: StageConfig;
  setStageConfig: React.Dispatch<React.SetStateAction<StageConfig>>;
  stageStyle: StageStyle;
  setStageStyle: React.Dispatch<React.SetStateAction<StageStyle>>;
  displayColorPicker: boolean;
  setDisplayColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  history: Map<string, Node>[];
  setHistory: React.Dispatch<React.SetStateAction<Map<string, Node>[]>>;
  historyIndex: number;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
};
export const RoomContext: React.Context<IRoomContext> = createContext({} as IRoomContext);

export const RoomContextProvider: React.FC<Props> = ({ children }) => {
  // const [nodes, setNodes] = useState<Node[]>(generateNodes());
  const [nodes, setNodes] = useState<Map<string, Node>>(generateNodes());
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [shapeType, setShapeType] = useState<ShapeType>("rect");
  const [fillStyle, setFillStyle] = useState<string>("#00000000");
  const [strokeStyle, setStrokeStyle] = useState<string>("#000000");
  const [lineStyle, setLineStyle] = useState<string>("#000000");
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
  const [dark, setDark] = useState(false);
  const [history, setHistory] = useState<Map<string, Node>[]>([new Map(nodes)]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

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
      fillStyle,
      setFillStyle,
      strokeStyle,
      setStrokeStyle,
      lineStyle,
      setLineStyle,
      selectedShapes,
      setSelectedShapes,
      stageConfig,
      setStageConfig,
      stageStyle,
      setStageStyle,
      displayColorPicker,
      setDisplayColorPicker,
      dark,
      setDark,
      history,
      setHistory,
      historyIndex,
      setHistoryIndex,
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
      lineStyle,
      displayColorPicker,
      dark,
      history,
      historyIndex,
    ]
  );

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
