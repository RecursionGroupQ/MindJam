import React, { useContext, useRef } from "react";
import Konva from "konva";
import { Group, Circle } from "react-konva";
import { RoomContext, Node } from "../../context/RoomContext";
import ShapeText from "./ShapeText";

type Props = {
  node: Node;
  ind: number;
};

const Shape: React.FC<Props> = ({ node, ind }) => {
  const { nodes, setNodes, selectedNode, setSelectedNode, setShapeRefs } = useContext(RoomContext);
  const shapeRef = useRef<Konva.Group>(null);

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
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
  };

  const handleDragEnd = () => {
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
  };

  const handleClick = () => {
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
      // setShapeRefs((prevState) => prevState.filter((ref) => ref.current))
    } else {
      setSelectedNode(node);
      setShapeRefs((prevState) => [...prevState, shapeRef]);
    }
  };

  return (
    <Group
      ref={shapeRef}
      x={node.x}
      y={node.y}
      draggable
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      <Circle fill={node.fill} radius={50} shadowBlur={5} />
      <ShapeText node={node} />
    </Group>
  );
};

export default Shape;