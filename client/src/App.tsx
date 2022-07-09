import React, { useContext } from "react";
import { Stage, Layer, Circle, Line, Text } from "react-konva";
import Konva from "konva";
import { Node, RoomContext, fills, CANVAS_WIDTH, CANVAS_HEIGHT } from "./context/RoomContext";

const App = () => {
  const { nodes, setNodes, selectedNode, setSelectedNode } = useContext(RoomContext);

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
                        }
                        return currNode;
                      })
                    );
                  }
                  setSelectedNode(null);
                } else {
                  setSelectedNode(node);
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
