import React, { useContext, useRef, useState } from "react";
import Konva from "konva";
import { Group, Circle } from "react-konva";
import { RoomContext, Node } from "../../context/RoomContext";
import EditableText from "./EditableText";

type Props = {
  node: Node;
  ind: number;
};

const Shape: React.FC<Props> = ({ node, ind }) => {
  const { nodes, setNodes, selectedNode, setSelectedNode, setShapeRefs } = useContext(RoomContext);
  const shapeRef = useRef<Konva.Group>(null);
  const [text, setText] = useState<string>(node.text);
  const [isEditing, setIsEditing] = useState<boolean>(false);

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
    } else {
      setSelectedNode(node);
      setShapeRefs((prevState) => [...prevState, shapeRef]);
    }
  };

  const onTextChange = (value: string) => {
    // textの更新
    setText(value);
  };

  const onToggleEdit = () => {
    // 編集モードの切替
    setIsEditing(!isEditing);
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
      <Circle fill={node.fill} radius={100} shadowBlur={5} />
      <EditableText
        node={node}
        x={-50}
        y={-20}
        text={text}
        isEditing={isEditing}
        width={100}
        height={100}
        onTextChange={onTextChange}
        onToggleEdit={onToggleEdit}
      />
    </Group>
  );
};

export default Shape;
