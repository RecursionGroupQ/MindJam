import React, { useContext } from "react";
import { FaUndo, FaRedo, FaTrash } from "react-icons/fa";
import { Card, CardBody, Tooltip } from "@material-tailwind/react";

import { RoomContext } from "../../../context/RoomContext";
import NodeColorPanel from "./ToolBoxPanelComponent/NodeColorPanel";
import NodeShapePanel from "./ToolBoxPanelComponent/NodeShapePanel";
import useHistory from "../../../hooks/useHistory";

const ToolBox = () => {
  const {
    nodes,
    setNodes,
    history,
    historyIndex,
    setHistoryIndex,
    selectedNode,
    selectedShapes,
    setSelectedNode,
    setSelectedShapes,
  } = useContext(RoomContext);

  const { addToHistory } = useHistory();

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex: number = historyIndex - 1;
      const prevHistory = new Map(history[prevIndex]);
      setNodes(prevHistory);
      setHistoryIndex(prevIndex);
    }
  };

  const handleRedo = () => {
    if (history.length - 1 > historyIndex) {
      const nextIndex: number = historyIndex + 1;
      const nextHistory = new Map(history[nextIndex]);
      setNodes(nextHistory);
      setHistoryIndex(nextIndex);
    }
  };

  const handleNodeDelete = () => {
    if (selectedNode) {
      setNodes((prevState) => {
        const updatedNodes = new Map(prevState);
        const currNode = nodes.get(selectedNode.id);
        if (currNode) {
          currNode.parents.forEach((parent) => {
            const parentNode = nodes.get(parent);
            if (parentNode) {
              updatedNodes.set(parent, {
                ...parentNode,
                children: parentNode.children.filter((child) => child !== currNode.id),
              });
            }
          });
          currNode.children.forEach((child) => {
            const childNode = nodes.get(child);
            if (childNode) {
              updatedNodes.set(child, {
                ...childNode,
                parents: childNode.parents.filter((parent) => parent !== currNode.id),
              });
            }
          });
          updatedNodes.delete(currNode.id);
        }
        addToHistory(updatedNodes);
        return updatedNodes;
      });
    } else if (selectedShapes) {
      setNodes((prevState) => {
        const updatedNodes = new Map(prevState);
        selectedShapes.forEach((shape) => {
          const key = shape.id();
          const currNode = nodes.get(key);
          if (currNode) {
            currNode.parents.forEach((parent) => {
              const parentNode = updatedNodes.get(parent);
              if (parentNode) {
                updatedNodes.set(parent, {
                  ...parentNode,
                  children: parentNode.children.filter((child) => child !== currNode.id),
                });
              }
            });
            currNode.children.forEach((child) => {
              const childNode = updatedNodes.get(child);
              if (childNode) {
                updatedNodes.set(child, {
                  ...childNode,
                  parents: childNode.parents.filter((parent) => parent !== currNode.id),
                });
              }
            });
            updatedNodes.delete(currNode.id);
          }
        });
        addToHistory(updatedNodes);
        return updatedNodes;
      });
    }
    setSelectedNode(null);
    setSelectedShapes([]);
  };

  // const darkOrLight = dark
  //   ? "my-10 px-5 py-3 w-4/12 h-full grid grid-cols-7 #6b7280 border-4 rounded-2xl border-indigo-600"
  //   : "my-10 px-5 py-3 w-4/12 h-full grid grid-cols-7 #f8fafc border-4 rounded-2xl border-indigo-600";

  return (
    <div className="absolute bottom-1 left-1/2" style={{ transform: "translate(-50%, -50%)" }}>
      <Card shadow>
        <CardBody className="flex flex-row !p-5 items-center">
          <div className="w-full h-full flex items-center hover:bg-grey-300">
            <NodeColorPanel value="fill" />
          </div>
          <div className="w-full h-full flex items-center hover:bg-grey-300">
            <NodeColorPanel value="stroke" />
          </div>
          <div className="w-full h-full flex items-center hover:bg-grey-300">
            <NodeColorPanel value="line" />
          </div>
          <div className="w-full h-full flex items-center hover:bg-grey-300 pr-4">
            <NodeShapePanel />
          </div>
          <div className="w-full h-full pl-6 pr-2 border-l-2">
            <Tooltip offset={15} hidden={historyIndex === 0} content="undo">
              <button
                className={`h-full w-full flex justify-center items-center ${
                  historyIndex === 0
                    ? ""
                    : "transition ease-in-out rounded hover:-translate-y-1 hover:scale-110 duration-300"
                }`}
                type="button"
                onClick={() => handleUndo()}
                disabled={historyIndex === 0}
              >
                <FaUndo size={30} opacity={historyIndex === 0 ? 0.5 : 1} />
              </button>
            </Tooltip>
          </div>
          <div className="w-full h-full pl-2 pr-4">
            <Tooltip offset={15} hidden={historyIndex === history.length - 1} content="redo">
              <button
                className={`h-full w-full flex justify-center items-center ${
                  historyIndex === history.length - 1
                    ? ""
                    : "transition ease-in-out rounded hover:-translate-y-1 hover:scale-110 duration-300"
                }`}
                type="button"
                onClick={() => handleRedo()}
                disabled={historyIndex === history.length - 1}
              >
                <FaRedo size={30} opacity={historyIndex === history.length - 1 ? 0.5 : 1} />
              </button>
            </Tooltip>
          </div>
          <div className="w-full h-full pl-2 pr-4">
            <Tooltip offset={15} hidden={selectedShapes.length < 1} content="trash">
              <button
                className={`h-full w-full flex justify-center items-center ${
                  selectedShapes.length < 1
                    ? ""
                    : "transition ease-in-out rounded hover:-translate-y-1 hover:scale-110 duration-300"
                }`}
                type="button"
                onClick={handleNodeDelete}
                disabled={selectedShapes.length < 1}
              >
                <FaTrash size={30} opacity={selectedShapes.length < 1 ? 0.5 : 1} />
              </button>
            </Tooltip>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ToolBox;
