import React, { useContext, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Group } from "react-konva";
import { RoomContext, Node } from "../../context/RoomContext";
import EditableText from "./EditableText";
import RectShape from "./ShapeComponent/RectShape";
import EllipseShape from "./ShapeComponent/EllipseShape";

type Props = {
  node: Node;
};

const Shape: React.FC<Props> = ({ node }) => {
  const { nodes, setNodes, selectedNode, setSelectedNode, selectedShapes, setSelectedShapes } = useContext(RoomContext);
  const shapeRef = useRef<Konva.Group>(null);
  const [text, setText] = useState<string>(node.text);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    // add node.id as attribute to ref of shape
    shapeRef.current?.setAttr("id", node.id);
  }, [node.id]);

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    setNodes((prevState) => {
      const { x, y } = e.target.position();
      const currNode = prevState.get(node.id);
      if (!currNode) return prevState;
      return new Map(
        prevState.set(node.id, {
          ...currNode,
          x,
          y,
        })
      );
    });
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // shift でノードをクリックした場合、複数選択から追加・消去のみ行う
    if (e.evt.shiftKey) {
      setSelectedNode(null);
      if (selectedShapes.find((shape) => shape._id === shapeRef.current?._id)) {
        setSelectedShapes((prevState) => prevState.filter((shape) => shape._id !== shapeRef.current?._id));
      } else {
        setSelectedShapes((prevState) => [...prevState, shapeRef.current as Konva.Group]);
      }
      return;
    }
    if (selectedNode && selectedNode.id !== node.id) {
      setNodes((prevState) => {
        const currNode = prevState.get(node.id);
        if (
          currNode &&
          !currNode.children.includes(selectedNode.id) &&
          !selectedNode.children.includes(currNode.id) &&
          selectedNode.id !== currNode.id
        ) {
          return new Map(
            prevState.set(selectedNode.id, {
              ...selectedNode,
              children: [...selectedNode.children, currNode.id],
            })
          );
        }
        return prevState;
      });
      setSelectedNode(null);
      setSelectedShapes([]);
    } else {
      setSelectedNode(node);
      setSelectedShapes([shapeRef.current as Konva.Group]);
    }
  };

  const handleTransform = () => {
    if (shapeRef.current) {
      const currGroup = shapeRef.current;
      setNodes((prevState) => {
        const currNode = nodes.get(node.id);
        if (!currNode) return prevState;
        return new Map(
          prevState.set(node.id, {
            ...currNode,
            x: currGroup.x(),
            y: currGroup.y(),
          })
        );
      });
    }
  };

  const handleTransformEnd = () => {
    if (shapeRef.current) {
      const currGroup = shapeRef.current;
      const scaleX = currGroup.scaleX();
      const scaleY = currGroup.scaleY();
      currGroup.scaleX(1);
      currGroup.scaleY(1);

      setNodes((prevState) => {
        const currNode = nodes.get(node.id);
        if (!currNode) return prevState;
        return new Map(
          prevState.set(node.id, {
            ...currNode,
            width: node.width * scaleX,
            height: node.height * scaleY,
          })
        );
      });
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
      offsetX={node.shapeType === "rect" ? node.width / 2 : 0}
      offsetY={node.shapeType === "rect" ? node.height / 2 : 0}
      draggable
      onDragMove={handleDragMove}
      onClick={handleClick}
      onTap={handleClick}
      onTransform={handleTransform}
      onTransformEnd={handleTransformEnd}
      name="mindmap-node"
    >
      {node.shapeType === "rect" && <RectShape node={node} />}
      {node.shapeType === "ellipse" && <EllipseShape node={node} />}
      <EditableText
        node={node}
        x={0}
        y={0}
        text={text}
        isEditing={isEditing}
        onTextChange={onTextChange}
        onToggleEdit={onToggleEdit}
      />
    </Group>
  );
};

export default Shape;
