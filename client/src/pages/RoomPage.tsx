import React, { useContext, useRef, useEffect, useState } from "react";
import { Stage, Layer, Transformer, Rect } from "react-konva";
import Konva from "konva";
import { nanoid } from "nanoid";
import { motion } from "framer-motion";

import { Node, RoomContext, CANVAS_WIDTH, CANVAS_HEIGHT } from "../context/RoomContext";
import Edge from "../components/RoomPage/Edge";
import Shape from "../components/RoomPage/Shape";
import ToolBox from "../components/RoomPage/ToolBox/ToolBox";
import useHistory from "../hooks/useHistory";

const RoomPage = () => {
  const {
    nodes,
    setNodes,
    selectedShapes,
    setSelectedShapes,
    setSelectedNode,
    stageConfig,
    setStageConfig,
    stageStyle,
    setStageStyle,
    shapeType,
    setStageRef,
    fillStyle,
    strokeStyle,
    setDisplayColorPicker,
  } = useContext(RoomContext);

  const [canDragStage, setCanDragStage] = useState(true);
  const transformerRef = useRef<Konva.Transformer>(null);
  const selectionRectRef = useRef<Konva.Rect>(null);
  const [selectionRectCoords, setSelectionRectCoords] = useState({ x1: 0, y1: 0 });
  const stageRef = useRef<Konva.Stage>(null);
  const { addToHistory } = useHistory();

  useEffect(() => {
    if (stageRef.current) {
      setStageRef(stageRef);
    }
  }, [setStageRef]);

  useEffect(() => {
    if (selectedShapes) {
      transformerRef.current?.nodes(selectedShapes);
      transformerRef.current?.getLayer()?.batchDraw();
    }
  }, [selectedShapes, nodes]);

  useEffect(() => {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.shiftKey) {
        setCanDragStage(false);
      }
    });
    window.addEventListener("keyup", () => {
      setCanDragStage(true);
    });

    return () => {
      window.removeEventListener("keydown", (e: KeyboardEvent) => {
        if (e.shiftKey) {
          setCanDragStage(false);
        }
      });
      window.removeEventListener("keyup", () => {
        setCanDragStage(true);
      });
    };
  }, []);

  // ダブルクリックでノードを追加
  const handleDoubleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    let pointerPosition = null;
    if (e.target === stageRef.current && stage) {
      pointerPosition = stage.getRelativePointerPosition();
      if (pointerPosition) {
        const id = nanoid();
        const newNode: Node = {
          id,
          children: [],
          parents: [],
          text: `node-${id}`,
          shapeType,
          x: pointerPosition.x,
          y: pointerPosition.y,
          width: 380,
          height: 90,
          fillStyle,
          strokeStyle,
        };
        setNodes((prevState) => {
          prevState.set(newNode.id, newNode);
          addToHistory(prevState);
          return new Map(prevState);
        });
        // addHistoryByDoubleClick(newNode);
        // addHistory();
      }
    }
  };

  // マウススクロールで拡大・縮小
  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    if (!canDragStage) {
      return;
    }
    if (stageRef.current) {
      const stage = stageRef.current;
      const scaleBy = 1.05;
      const oldScale = stageRef.current.scaleX();
      const mousePointTo = {
        x: (stage.getPointerPosition()?.x as number) / oldScale - stage.x() / oldScale,
        y: (stage.getPointerPosition()?.y as number) / oldScale - stage.y() / oldScale,
      };

      const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

      if (newScale > 2 || newScale < 0.1) {
        return;
      }

      const stageX = -(mousePointTo.x - (stage.getPointerPosition()?.x as number) / newScale) * newScale;
      const stageY = -(mousePointTo.y - (stage.getPointerPosition()?.y as number) / newScale) * newScale;

      setStageConfig((prevState) => ({
        ...prevState,
        stageScale: newScale,
        stageX,
        stageY,
      }));

      setStageStyle((prevState) => ({
        ...prevState,
        backgroundSize: `${50 * newScale}px ${50 * newScale}px`,
        backgroundPosition: `${stageX}px ${stageY}px`,
      }));
    }
  };

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (e.target === stageRef.current && canDragStage) {
      const container = stageRef.current.container();
      if (container) container.style.cursor = "grabbing";
    }
  };

  // マウスドラッグで Canvas 内を移動
  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (e.target === stageRef.current && canDragStage) {
      setStageStyle((prevState) => ({
        ...prevState,
        backgroundPosition: `${e.target.x()}px ${e.target.y()}px`,
      }));
    }
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (e.target === stageRef.current && canDragStage) {
      const container = stageRef.current.container();
      if (container) container.style.cursor = "auto";
    }
  };

  // マウスクリックでノード選択解除
  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === stageRef.current) {
      setSelectedNode(null);
      setSelectedShapes([]);
      setDisplayColorPicker(false);
    }
  };

  // マウスダウンで複数選択を開始
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== stageRef.current || canDragStage) {
      return;
    }
    e.evt.preventDefault();
    const X1 = stageRef.current.getRelativePointerPosition()?.x;
    const X2 = stageRef.current.getRelativePointerPosition()?.y;
    setSelectionRectCoords({
      x1: X1,
      y1: X2,
    });

    selectionRectRef.current?.visible(true);
    selectionRectRef.current?.width(0);
    selectionRectRef.current?.height(0);
    selectionRectRef.current?.setAttrs({
      x: X1,
      y: X2,
    });
  };

  // マウスムーブで複数選択範囲を設定
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!selectionRectRef.current?.visible() || canDragStage) {
      selectionRectRef.current?.visible(false);
      return;
    }
    e.evt.preventDefault();
    const x2 = stageRef.current?.getRelativePointerPosition()?.x;
    const y2 = stageRef.current?.getRelativePointerPosition()?.y;
    if (selectionRectCoords && x2 && y2) {
      selectionRectRef.current.setAttrs({
        x: Math.min(selectionRectCoords.x1, x2),
        y: Math.min(selectionRectCoords.y1, y2),
        width: Math.abs(x2 - selectionRectCoords.x1),
        height: Math.abs(y2 - selectionRectCoords.y1),
      });
    }
  };

  // マウスアップで複数選択範囲を確定
  const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!selectionRectRef.current?.visible() || canDragStage) {
      selectionRectRef.current?.visible(false);
      return;
    }
    e.evt.preventDefault();
    setTimeout(() => {
      selectionRectRef.current?.visible(false);
    });
    const shapes = stageRef.current?.find(".mindmap-node");
    const box = selectionRectRef.current?.getClientRect();
    const selected = shapes?.filter((shape) => Konva.Util.haveIntersection(box, shape.getClientRect()));
    setSelectedShapes(selected as Konva.Group[]);
  };

  return (
    <>
      <motion.div
        initial={{ y: CANVAS_HEIGHT + 200, scale: 0 }}
        animate={{ y: CANVAS_HEIGHT - 50, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <ToolBox />
      </motion.div>
      <RoomContext.Consumer>
        {(value) => (
          <Stage
            style={stageStyle}
            ref={stageRef}
            className="-z-10 absolute top-0"
            scaleX={stageConfig.stageScale}
            scaleY={stageConfig.stageScale}
            x={stageConfig.stageX}
            y={stageConfig.stageY}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            draggable={canDragStage}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            onTap={handleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDblClick={handleDoubleClick}
            // onDblTap={handleDoubleClick}
            onWheel={handleWheel}
          >
            <RoomContext.Provider value={value}>
              <Layer>
                {Array.from(nodes.keys()).map((key) => {
                  const currNode = nodes.get(key) as Node;
                  return currNode.children.map((childId) => (
                    <Edge key={`edge_${currNode.id}_${childId}`} node={currNode} childId={childId} />
                  ));
                })}
                {Array.from(nodes.keys()).map((key) => (
                  <Shape key={key} node={nodes.get(key) as Node} />
                ))}
                {selectedShapes && (
                  <Transformer
                    ref={transformerRef}
                    rotateEnabled={false}
                    anchorSize={15}
                    anchorStrokeWidth={3}
                    anchorCornerRadius={100}
                    flipEnabled={false}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width > 800) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                )}
                <Rect ref={selectionRectRef} fill="rgba(99,102,241,0.2)" visible={false} />
              </Layer>
            </RoomContext.Provider>
          </Stage>
        )}
      </RoomContext.Consumer>
    </>
  );
};

export default RoomPage;
