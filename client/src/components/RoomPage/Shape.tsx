import React, { useContext, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Group } from "react-konva";
import { RoomContext, Node } from "../../context/RoomContext";
import RectShape from "./ShapeComponent/RectShape";
import EllipseShape from "./ShapeComponent/EllipseShape";
import StarShape from "./ShapeComponent/StarShape";
import useHistory from "../../hooks/useHistory";
import Text from "./Text";

type Props = {
  node: Node;
};

const Shape: React.FC<Props> = ({ node }) => {
  const { nodes, setNodes, selectedNode, setSelectedNode, selectedShapes, setSelectedShapes } = useContext(RoomContext);
  const shapeRef = useRef<Konva.Group>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { addToHistory } = useHistory();
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

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setNodes((prevState) => {
      const { x, y } = e.target.position();
      const currNode = prevState.get(node.id);
      if (!currNode) return prevState;
      prevState.set(node.id, {
        ...currNode,
        x,
        y,
      });
      addToHistory(prevState);
      return new Map(prevState);
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
        const selectNode = nodes.get(selectedNode.id) as Node;
        const currNode = nodes.get(node.id);
        if (
          currNode &&
          !currNode.children.includes(selectedNode.id) &&
          !selectNode.children.includes(currNode.id) &&
          selectedNode.id !== currNode.id
        ) {
          prevState.set(selectedNode.id, {
            ...selectNode,
            children: [...selectNode.children, currNode.id],
          });
          prevState.set(currNode.id, {
            ...currNode,
            parents: [...currNode.parents, selectedNode.id],
          });
          return new Map(prevState);
        }
        addToHistory(prevState);
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
        prevState.set(node.id, {
          ...currNode,
          width: node.width * scaleX,
          height: node.height * scaleY,
        });
        addToHistory(prevState);
        return new Map(prevState);
      });
    }
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
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onTap={handleClick}
      onTransform={handleTransform}
      onTransformEnd={handleTransformEnd}
      onDblClick={onToggleEdit}
      name="mindmap-node"
    >
      <Text node={node} isEditing={isEditing} onToggleEdit={onToggleEdit} />
      {node.shapeType === "rect" && <RectShape node={node} />}
      {node.shapeType === "ellipse" && <EllipseShape node={node} />}
      {/* <RegularPolygon sides={10} radius={70} fill="red" stroke="black" /> */}
      {node.shapeType === "star" && <StarShape node={node} />}
    </Group>
  );
};

export default Shape;
