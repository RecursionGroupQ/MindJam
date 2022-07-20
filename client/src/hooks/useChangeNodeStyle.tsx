import { useContext } from "react";
import { RoomContext, ShapeType } from "../context/RoomContext";

const useChangeNodeStyle = () => {
  const { nodes, setNodes, selectedNode, selectedShapes, setFillStyle, setStrokeStyle, setShapeType } =
    useContext(RoomContext);

  const changeNodeColors = (color: string, value: "fill" | "stroke" | "line") => {
    if (value === "fill") {
      setFillStyle(color);
      // ノードが一つだけ選択されている場合
      if (selectedNode && selectedShapes.length === 1) {
        setNodes((prevState) => {
          const currNode = nodes.get(selectedNode.id);
          if (!currNode) return prevState;
          return new Map(
            prevState.set(selectedNode.id, {
              ...currNode,
              fillStyle: color,
            })
          );
        });
      } else if (selectedShapes.length >= 2) {
        setNodes((prevState) => {
          const updatedNodes = new Map(prevState);
          selectedShapes.forEach((shape) => {
            const shapeId = shape.id();
            const currNode = nodes.get(shapeId);
            if (!currNode) return;
            updatedNodes.set(shapeId, {
              ...currNode,
              fillStyle: color,
            });
          });
          return updatedNodes;
        });
      }
    } else if (value === "stroke") {
      setStrokeStyle(color);
      if (selectedNode && selectedShapes.length === 1) {
        setNodes((prevState) => {
          const currNode = nodes.get(selectedNode.id);
          if (!currNode) return prevState;
          return new Map(
            prevState.set(selectedNode.id, {
              ...currNode,
              strokeStyle: color,
            })
          );
        });
      } else if (selectedShapes.length >= 2) {
        setNodes((prevState) => {
          const updatedNodes = new Map(prevState);
          selectedShapes.forEach((shape) => {
            const shapeId = shape.id();
            const currNode = nodes.get(shapeId);
            if (!currNode) return;
            updatedNodes.set(shapeId, {
              ...currNode,
              strokeStyle: color,
            });
          });
          return updatedNodes;
        });
      }
    }
  };

  const changeNodeShapes = (shapeType: ShapeType) => {
    // ノードが一つだけ選択されている場合
    if (selectedNode && selectedShapes.length === 1) {
      setNodes((prevState) => {
        const currNode = nodes.get(selectedNode.id);
        if (!currNode) return prevState;
        return new Map(
          prevState.set(selectedNode.id, {
            ...currNode,
            shapeType,
          })
        );
      });
    } else if (selectedShapes.length >= 2) {
      setNodes((prevState) => {
        const updatedNodes = new Map(prevState);
        selectedShapes.forEach((shape) => {
          const shapeId = shape.id();
          const currNode = nodes.get(shapeId);
          if (!currNode) return;
          updatedNodes.set(shapeId, {
            ...currNode,
            shapeType,
          });
        });
        return updatedNodes;
      });
    }
    setShapeType(shapeType);
  };

  return { changeNodeColors, changeNodeShapes };
};

export default useChangeNodeStyle;
