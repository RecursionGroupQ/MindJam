import React, { useContext, useEffect, useRef } from "react";
import Konva from "konva";
import { Group } from "react-konva";
import { RoomContext, Node } from "../../context/RoomContext";
import ShapeText from "./ShapeText";
import RectShape from "./ShapeComponent/RectShape";
import EllipseShape from "./ShapeComponent/EllipseShape";

type Props = {
  node: Node;
};

const Shape: React.FC<Props> = ({ node }) => {
  const { nodes, setNodes, selectedNode, setSelectedNode, selectedShapes, setSelectedShapes } = useContext(RoomContext);
  const shapeRef = useRef<Konva.Group>(null);

  useEffect(() => {
    // add node.id as attribute to ref of shape
    shapeRef.current?.setAttr("id", node.id);
  }, [node.id]);

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    setNodes(
      nodes.map((currNode) => {
        const { x, y } = e.target.position();
        // check if currNode is in selectedShapes
        const otherSelectedShape = selectedShapes.find((shape) => currNode.id === shape.getAttr("id")) as Konva.Group;
        if (currNode.id === node.id) {
          return {
            ...currNode,
            x,
            y,
          };
        }
        if (otherSelectedShape && otherSelectedShape.getAttr("id") !== node.id) {
          return {
            ...currNode,
            x: otherSelectedShape.getAttr("x") as number,
            y: otherSelectedShape.getAttr("y") as number,
          };
        }
        return currNode;
      })
    );
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
      setNodes(
        nodes.map((currNode) => {
          const otherSelectedShape = selectedShapes.find((shape) => currNode.id === shape.getAttr("id")) as Konva.Group;
          if (currNode.id === node.id) {
            return {
              ...currNode,
              x: currGroup.x(),
              y: currGroup.y(),
            };
          }
          if (otherSelectedShape && otherSelectedShape.getAttr("id") !== node.id) {
            return {
              ...currNode,
              x: otherSelectedShape.getAttr("x") as number,
              y: otherSelectedShape.getAttr("y") as number,
            };
          }
          return currNode;
        })
      );
    }
  };

  const handleTransformEnd = () => {
    if (shapeRef.current) {
      const currGroup = shapeRef.current;

      const scaleX = currGroup.scaleX();
      const scaleY = currGroup.scaleY();

      currGroup.scaleX(1);
      currGroup.scaleY(1);

      setNodes(
        nodes.map((currNode) => {
          const otherSelectedShape = selectedShapes.find((shape) => currNode.id === shape.getAttr("id")) as Konva.Group;
          if (currNode.id === node.id) {
            return {
              ...currNode,
              width: currNode.width * scaleX,
              height: currNode.height * scaleY,
            };
          }
          if (otherSelectedShape && otherSelectedShape.getAttr("id") !== node.id) {
            return {
              ...currNode,
              width: currNode.width * scaleX,
              height: currNode.height * scaleY,
            };
          }
          return currNode;
        })
      );
    }
  };

  return (
    <Group
      ref={shapeRef}
      x={node.x}
      y={node.y}
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
      <ShapeText node={node} />
    </Group>
  );
};

export default Shape;
