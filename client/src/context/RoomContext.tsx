import React, { createContext, useState, useMemo } from "react";
import Konva from "konva";

export const fills = ["#6B7280", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

export const CANVAS_WIDTH = window.innerWidth;
export const CANVAS_HEIGHT = window.innerHeight;

export type ShapeType = "rect" | "ellipse" | "polygon";

type Props = {
  children: React.ReactNode;
};

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

export type StageConfig = {
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

export type History = { type: "update" | "add" | "delete"; diff: null | string[]; nodes: Map<string, Node> };

export type UserCursor = {
  x: number;
  y: number;
};

export type RoomUser = {
  name: string | null;
  photoURL: string | null;
  color: string;
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
  stageRef: React.RefObject<Konva.Stage> | null;
  setStageRef: React.Dispatch<React.SetStateAction<React.RefObject<Konva.Stage> | null>>;
  displayColorPicker: boolean;
  setDisplayColorPicker: React.Dispatch<React.SetStateAction<boolean>>;
  dark: boolean;
  setDark: React.Dispatch<React.SetStateAction<boolean>>;
  history: History[];
  setHistory: React.Dispatch<React.SetStateAction<History[]>>;
  historyIndex: number;
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>;
  roomId: string | undefined;
  setRoomId: React.Dispatch<React.SetStateAction<string | undefined>>;
  userCursors: Map<string, UserCursor>;
  setUserCursors: React.Dispatch<React.SetStateAction<Map<string, UserCursor>>>;
  roomUsers: Map<string, RoomUser>;
  setRoomUsers: React.Dispatch<React.SetStateAction<Map<string, RoomUser>>>;
  roomName: string;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
};
export const RoomContext: React.Context<IRoomContext> = createContext({} as IRoomContext);

export const RoomContextProvider: React.FC<Props> = ({ children }) => {
  const [stageRef, setStageRef] = useState<React.RefObject<Konva.Stage> | null>(null);
  const [nodes, setNodes] = useState<Map<string, Node>>(new Map());
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [shapeType, setShapeType] = useState<ShapeType>("rect");
  const [fillStyle, setFillStyle] = useState<string>("#fff");
  const [strokeStyle, setStrokeStyle] = useState<string>("#000");
  const [lineStyle, setLineStyle] = useState<string>("#000");
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
  const [history, setHistory] = useState<History[]>([
    {
      type: "update",
      diff: null,
      nodes: new Map(),
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [roomId, setRoomId] = useState<string | undefined>();
  const [roomName, setRoomName] = useState<string>("");
  const [userCursors, setUserCursors] = useState<Map<string, UserCursor>>(new Map());
  const [roomUsers, setRoomUsers] = useState<Map<string, RoomUser>>(new Map());

  const value = useMemo(
    () => ({
      stageRef,
      setStageRef,
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
      roomId,
      setRoomId,
      userCursors,
      setUserCursors,
      roomUsers,
      setRoomUsers,
      roomName,
      setRoomName,
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
      stageRef,
      roomId,
      userCursors,
      roomUsers,
      roomName,
    ]
  );

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
