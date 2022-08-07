import React, { useContext, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Group } from "react-konva";
import { RoomContext, Node } from "../../context/RoomContext";
import RectShape from "./ShapeComponent/RectShape";
import EllipseShape from "./ShapeComponent/EllipseShape";
import PolygonShape from "./ShapeComponent/PolygonShape";
import useHistory from "../../hooks/useHistory";
import Text from "./Text";
import useSaveRoom from "../../hooks/firebase/useSaveRoom";
import useSocket from "../../hooks/useSocket";

type Props = {
  node: Node;
};

const Shape: React.FC<Props> = ({ node }) => {
  const { nodes, setNodes, selectedNode, setSelectedNode, selectedShapes, setSelectedShapes, stageRef, lineStyle } =
    useContext(RoomContext);
  const shapeRef = useRef<Konva.Group>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { addToHistory } = useHistory();
  const { saveUpdatedNodes } = useSaveRoom();
  const { updateRoom, updateUserMouse } = useSocket();
  useEffect(() => {
    // add node.id as attribute to ref of shape
    shapeRef.current?.setAttr("id", node.id);
  }, [node.id]);

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    // user mouse
    if (stageRef) {
      const mouseX = stageRef.current?.getRelativePointerPosition()?.x;
      const mouseY = stageRef.current?.getRelativePointerPosition()?.y;
      if (mouseX && mouseY) {
        updateUserMouse({ x: mouseX, y: mouseY });
      }
    }

    setNodes((prevState) => {
      const { x, y } = e.target.position();
      const currNode = prevState.get(node.id);
      if (!currNode) return prevState;
      const updatedNode = {
        ...currNode,
        x,
        y,
      };
      prevState.set(node.id, updatedNode);
      updateRoom([updatedNode], "update");
      return new Map(prevState);
    });
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setNodes((prevState) => {
      let { x, y } = e.target.position();
      const currNode = prevState.get(node.id);
      if (!currNode) return prevState;
      if (currNode.parents.length > 0) {
        currNode.parents.forEach((parent) => {
          const currParent = nodes.get(parent);
          if (currParent && Math.abs(currParent.x - x) < 30) {
            x = currParent.x;
          } else if (currParent && Math.abs(currParent.y - y) < 30) {
            y = currParent.y;
          }
        });
      }
      if (currNode.children.length > 0) {
        currNode.children.forEach((child) => {
          const currChild = nodes.get(child.id);
          if (currChild && Math.abs(currChild.x - x) < 30) {
            x = currChild.x;
          } else if (currChild && Math.abs(currChild.y - y) < 30) {
            y = currChild.y;
          }
        });
      }
      const updatedNode = {
        ...currNode,
        x,
        y,
      };
      prevState.set(node.id, updatedNode);
      addToHistory({
        type: "update",
        diff: null,
        nodes: prevState,
      });
      updateRoom([updatedNode], "update");
      saveUpdatedNodes([updatedNode]).catch((err) => console.log(err));
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
        const selectNode = nodes.get(selectedNode.id);
        const currNode = nodes.get(node.id);
        if (
          currNode &&
          selectNode &&
          !currNode.children.some((child) => child.id === selectedNode.id) &&
          !selectNode.children.some((child) => child.id === currNode.id) &&
          selectedNode.id !== currNode.id
        ) {
          const updatedSelectNode = {
            ...selectNode,
            children: [...selectNode.children, { id: currNode.id, color: lineStyle }],
          };
          prevState.set(selectedNode.id, updatedSelectNode);
          const updatedCurrNode = {
            ...currNode,
            parents: [...currNode.parents, selectedNode.id],
          };
          prevState.set(currNode.id, updatedCurrNode);
          addToHistory({
            type: "update",
            diff: null,
            nodes: prevState,
          });
          saveUpdatedNodes([updatedSelectNode, updatedCurrNode]).catch((err) => console.log(err));
          updateRoom([updatedSelectNode, updatedCurrNode], "update");
          return new Map(prevState);
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
        const updatedNode = {
          ...currNode,
          x: currGroup.x(),
          y: currGroup.y(),
        };
        prevState.set(node.id, updatedNode);
        updateRoom([updatedNode], "update");
        return new Map(prevState);
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
        const updatedNode = {
          ...currNode,
          width: node.width * scaleX,
          height: node.height * scaleY,
        };
        prevState.set(node.id, updatedNode);
        addToHistory({
          type: "update",
          diff: null,
          nodes: prevState,
        });
        saveUpdatedNodes([updatedNode]).catch((err) => console.log(err));
        updateRoom([updatedNode], "update");
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
      {node.shapeType === "polygon" && <PolygonShape node={node} />}
    </Group>
  );
};

export default Shape;
