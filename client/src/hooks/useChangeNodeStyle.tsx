import { useContext } from "react";
import { Node, RoomContext, ShapeType } from "../context/RoomContext";
import useSaveRoom from "./firebase/useSaveRoom";
import useHistory from "./useHistory";
import useSocket from "./useSocket";

const useChangeNodeStyle = () => {
  const { nodes, setNodes, selectedNode, selectedShapes, setFillStyle, setStrokeStyle, setLineStyle, setShapeType } =
    useContext(RoomContext);

  const { addToHistory } = useHistory();
  const { saveUpdatedNodes } = useSaveRoom();
  const { updateRoom } = useSocket();

  const changeNodeColors = (color: string, value: "fill" | "stroke" | "line") => {
    if (value === "fill") {
      // ノードが一つだけ選択されている場合
      if (selectedNode && selectedShapes.length === 1) {
        setNodes((prevState) => {
          const currNode = nodes.get(selectedNode.id);
          if (!currNode) return prevState;
          const updatedNode = {
            ...currNode,
            fillStyle: color,
          };
          saveUpdatedNodes([updatedNode]).catch((err) => console.log(err));
          updateRoom([updatedNode], "update");
          return new Map(prevState.set(selectedNode.id, updatedNode));
        });
      } else if (selectedShapes.length >= 2) {
        setNodes((prevState) => {
          const updatedNodesToSave: Node[] = [];
          const updatedNodes = new Map(prevState);
          selectedShapes.forEach((shape) => {
            const shapeId = shape.id();
            const currNode = nodes.get(shapeId);
            if (!currNode) return;
            const updatedNode = {
              ...currNode,
              fillStyle: color,
            };
            updatedNodes.set(shapeId, updatedNode);
            updatedNodesToSave.push(updatedNode);
          });
          saveUpdatedNodes(updatedNodesToSave).catch((err) => console.log(err));
          updateRoom(updatedNodesToSave, "update");
          return updatedNodes;
        });
      }
      setFillStyle(color);
    } else if (value === "stroke") {
      if (selectedNode && selectedShapes.length === 1) {
        setNodes((prevState) => {
          const currNode = nodes.get(selectedNode.id);
          if (!currNode) return prevState;
          const updatedNode = {
            ...currNode,
            strokeStyle: color,
          };
          saveUpdatedNodes([updatedNode]).catch((err) => console.log(err));
          updateRoom([updatedNode], "update");
          return new Map(prevState.set(selectedNode.id, updatedNode));
        });
      } else if (selectedShapes.length >= 2) {
        setNodes((prevState) => {
          const updatedNodesToSave: Node[] = [];
          const updatedNodes = new Map(prevState);
          selectedShapes.forEach((shape) => {
            const shapeId = shape.id();
            const currNode = nodes.get(shapeId);
            if (!currNode) return;
            const updatedNode = {
              ...currNode,
              strokeStyle: color,
            };
            updatedNodes.set(shapeId, updatedNode);
            updatedNodesToSave.push(updatedNode);
          });
          saveUpdatedNodes(updatedNodesToSave).catch((err) => console.log(err));
          updateRoom(updatedNodesToSave, "update");
          return updatedNodes;
        });
      }
      setStrokeStyle(color);
    } else if (value === "line") {
      if (selectedNode) {
        const currChildren = selectedNode.children;
        if (currChildren) {
          setNodes((prevState) => {
            const updatedNodes = new Map(prevState);
            const currNode = nodes.get(selectedNode.id);
            if (!currNode) return prevState;
            const updatedChildren = currChildren.map((child) => ({ ...child, color }));
            const updatedNode = {
              ...currNode,
              children: updatedChildren,
            };
            updatedNodes.set(currNode.id, updatedNode);
            saveUpdatedNodes([updatedNode]).catch((err) => console.log(err));
            updateRoom([updatedNode], "update");
            return updatedNodes;
          });
        }
        const currParents = selectedNode.parents;
        if (currParents) {
          setNodes((prevState) => {
            const updatedNodesToSave: Node[] = [];
            const updatedNodes = new Map(prevState);
            const currNode = nodes.get(selectedNode.id);
            if (!currNode) return prevState;
            currParents.forEach((parent) => {
              const currParent = nodes.get(parent);
              if (currParent && currParent.children) {
                const updatedParentChildren = currParent.children.map((child) => {
                  if (child.id === currNode.id) {
                    return { ...child, color };
                  }
                  return child;
                });
                const updatedParent = {
                  ...currParent,
                  children: updatedParentChildren,
                };
                updatedNodes.set(currParent.id, updatedParent);
                updatedNodesToSave.push(updatedParent);
              }
            });
            saveUpdatedNodes(updatedNodesToSave).catch((err) => console.log(err));
            updateRoom(updatedNodesToSave, "update");
            return updatedNodes;
          });
        }
      }
      setLineStyle(color);
    }
  };

  const changeNodeShapes = (shapeType: ShapeType) => {
    // ノードが一つだけ選択されている場合
    if (selectedNode && selectedShapes.length === 1) {
      setNodes((prevState) => {
        const currNode = nodes.get(selectedNode.id);
        if (!currNode) return prevState;
        const updatedNode = {
          ...currNode,
          shapeType,
        };
        prevState.set(selectedNode.id, updatedNode);
        saveUpdatedNodes([updatedNode]).catch((err) => console.log(err));
        addToHistory({
          type: "update",
          diff: null,
          nodes: prevState,
        });
        updateRoom([updatedNode], "update");
        return new Map(prevState);
      });
    } else if (selectedShapes.length >= 2) {
      setNodes((prevState) => {
        const updatedNodesToSave: Node[] = [];
        const updatedNodes = new Map(prevState);
        selectedShapes.forEach((shape) => {
          const shapeId = shape.id();
          const currNode = nodes.get(shapeId);
          if (!currNode) return;
          const updatedNode = {
            ...currNode,
            shapeType,
          };
          updatedNodes.set(shapeId, updatedNode);
          updatedNodesToSave.push(updatedNode);
        });
        saveUpdatedNodes(updatedNodesToSave).catch((err) => console.log(err));
        addToHistory({
          type: "update",
          diff: null,
          nodes: updatedNodes,
        });
        updateRoom(updatedNodesToSave, "update");
        return updatedNodes;
      });
    }
    setShapeType(shapeType);
  };

  return { changeNodeColors, changeNodeShapes };
};

export default useChangeNodeStyle;
