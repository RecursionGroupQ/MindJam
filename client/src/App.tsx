/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from "react";
import { Stage, Layer, Circle, Line, Text, Group } from "react-konva";
import Konva from "konva";

const fills = ["#6B7280", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899"];

type Node = {
  id: number;
  children: number[];
  text: string;
  x: number;
  y: number;
  isDragging: boolean;
  fill: string;
};

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;

const generateNodes = () => {
  const nodes = [];
  for (let i = 0; i < 4; i += 1) {
    nodes.push({
      id: i,
      children: [],
      text: `node-${i}`,
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      fill: fills[Math.floor(Math.random() * fills.length)],
      isDragging: false,
    });
  }
  return nodes;
};

const INITIAL_STATE = generateNodes();

const App = () => {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_STATE);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const handleDoubleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    let pointerPosition = null;
    if (stage) {
      pointerPosition = stage.getPointerPosition();
      if (pointerPosition) {
        const newNode: Node = {
          id: nodes.length + 1,
          children: [],
          text: `node-${nodes.length + 1}`,
          x: pointerPosition.x,
          y: pointerPosition.y,
          fill: fills[Math.floor(Math.random() * fills.length)],
          isDragging: false,
        };
        setNodes((prevState) => [...prevState, newNode]);
      }
    }
  };

  const getEdgePoints = (from: Node, to: Node) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(-dy, dx);

    const radius = 60;

    return [
      from.x + -radius * Math.cos(angle + Math.PI),
      from.y + radius * Math.sin(angle + Math.PI),
      to.x + -radius * Math.cos(angle),
      to.y + radius * Math.sin(angle),
    ];
  };

  return (
    <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onDblClick={handleDoubleClick}>
      <Layer>
        {/* connection */}
        {nodes.map((node) =>
          node.children.map((childId) => {
            const childNode = nodes.filter((_node) => _node.id === childId)[0];
            return (
              <Line
                key={`${node.id}_${childId}`}
                points={getEdgePoints(node, childNode)}
                stroke="#9CA3AF"
                dash={[8, 4]}
              />
            );
          })
        )}

        {/* node */}
        {nodes.map((node, ind) => (
          <>
            <Circle
              x={node.x}
              y={node.y}
              key={node.id}
              fill={node.fill}
              radius={50}
              shadowBlur={5}
              scaleX={node.isDragging || selectedNode?.id === node.id ? 1.2 : 1}
              scaleY={node.isDragging || selectedNode?.id === node.id ? 1.2 : 1}
              draggable
              onDragMove={(e) => {
                setNodes(
                  nodes.map((currNode, i) => {
                    const { x, y } = e.target.position();
                    if (i === ind) {
                      return {
                        ...currNode,
                        x,
                        y,
                        isDragging: true,
                      };
                    }
                    return currNode;
                  })
                );
              }}
              onDragEnd={() => {
                setNodes(
                  nodes.map((currNode, i) => {
                    if (i === ind) {
                      return {
                        ...currNode,
                        isDragging: false,
                      };
                    }
                    return currNode;
                  })
                );
              }}
              onClick={() => {
                if (selectedNode) {
                  if (selectedNode !== node) {
                    setNodes(
                      nodes.map((currNode) => {
                        if (selectedNode.id === currNode.id) {
                          console.log("clicked node children: ", node.children);
                          console.log("selected node children: ", currNode.children);
                          if (
                            !node.children.includes(currNode.id) &&
                            !currNode.children.includes(node.id) &&
                            currNode.id !== node.id
                          ) {
                            return {
                              ...currNode,
                              children: [...currNode.children, node.id],
                            };
                          }
                          console.log("already binded!");
                        }
                        return currNode;
                      })
                    );
                  }
                  setSelectedNode(null);
                } else {
                  setSelectedNode(node);
                  console.log("selected node: ", node);
                }
              }}
            />
            <Text text={`NODE ${node.id}`} x={node.x} y={node.y} fontSize={20} align="center" />
          </>
        ))}
        {/* <Transformer ref={transformerRef} /> */}
      </Layer>
    </Stage>
  );
};

export default App;
