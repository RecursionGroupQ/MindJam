import { useContext } from "react";
import { RoomContext, ShapeType } from "../context/RoomContext";
import useHistory from "./useHistory";

const useChangeNodeStyle = () => {
  const { nodes, setNodes, selectedNode, selectedShapes, setFillStyle, setStrokeStyle, setLineStyle, setShapeType } =
    useContext(RoomContext);

  const { addToHistory } = useHistory();

  const changeNodeColors = (color: string, value: "fill" | "stroke" | "line") => {
    if (value === "fill") {
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
        // addHistory();
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
        // addHistory();
      }
      setFillStyle(color);
    } else if (value === "stroke") {
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
        // addHistory();
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
        // addHistory();
      }
      setStrokeStyle(color);
    } else if (value === "line") {
      setLineStyle(color);
    }
  };

  const changeNodeShapes = (shapeType: ShapeType) => {
    // ノードが一つだけ選択されている場合
    if (selectedNode && selectedShapes.length === 1) {
      setNodes((prevState) => {
        const currNode = nodes.get(selectedNode.id);
        if (!currNode) return prevState;
        prevState.set(selectedNode.id, {
          ...currNode,
          shapeType,
        });
        addToHistory(prevState);
        return new Map(prevState);
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
        addToHistory(updatedNodes);
        return updatedNodes;
      });
    }
    setShapeType(shapeType);
  };

  return { changeNodeColors, changeNodeShapes };
};

export default useChangeNodeStyle;
