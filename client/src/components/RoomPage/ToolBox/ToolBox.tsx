import React, { useContext } from "react";
import { FaUndo, FaRedo, FaTrash } from "react-icons/fa";
import { Card, CardBody, Tooltip } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { Node, RoomContext } from "../../../context/RoomContext";
import NodeColorPanel from "./ToolBoxPanelComponent/NodeColorPanel";
import NodeShapePanel from "./ToolBoxPanelComponent/NodeShapePanel";
import useHistory from "../../../hooks/useHistory";
import useSaveRoom from "../../../hooks/firebase/useSaveRoom";

const ToolBox = () => {
  const { nodes, setNodes, history, historyIndex, selectedNode, selectedShapes, setSelectedNode, setSelectedShapes } =
    useContext(RoomContext);

  const { addToHistory, handleRedo, handleUndo } = useHistory();
  const { saveDeletedNodes } = useSaveRoom();

  const handleNodeDelete = () => {
    if (selectedNode) {
      setNodes((prevState) => {
        const updatedNodesToSave: Node[] = [];
        const updatedNodes = new Map(prevState);
        const currNode = nodes.get(selectedNode.id);
        if (currNode) {
          currNode.parents.forEach((parent) => {
            const parentNode = nodes.get(parent);
            if (parentNode) {
              const updatedParent = {
                ...parentNode,
                children: parentNode.children.filter((child) => child !== currNode.id),
              };
              updatedNodes.set(parent, updatedParent);
              updatedNodesToSave.push(updatedParent);
            }
          });
          currNode.children.forEach((child) => {
            const childNode = nodes.get(child);
            if (childNode) {
              const updatedChild = {
                ...childNode,
                parents: childNode.parents.filter((parent) => parent !== currNode.id),
              };
              updatedNodes.set(child, updatedChild);
              updatedNodesToSave.push(updatedChild);
            }
          });
          updatedNodes.delete(currNode.id);
          addToHistory({
            type: "delete",
            diff: [currNode.id],
            nodes: updatedNodes,
          });
          saveDeletedNodes(updatedNodesToSave, [currNode]).catch((err) => console.log(err));
        }
        return updatedNodes;
      });
    } else if (selectedShapes) {
      setNodes((prevState) => {
        const updatedNodesToSave: Node[] = [];
        const deletedNodesToSave: Node[] = [];
        const updatedNodes = new Map(prevState);
        selectedShapes.forEach((shape) => {
          const key = shape.id();
          const currNode = nodes.get(key);
          if (currNode) {
            currNode.parents.forEach((parent) => {
              const parentNode = updatedNodes.get(parent);
              if (parentNode) {
                const updatedParent = {
                  ...parentNode,
                  children: parentNode.children.filter((child) => child !== currNode.id),
                };
                updatedNodes.set(parent, updatedParent);
                updatedNodesToSave.push(updatedParent);
              }
            });
            currNode.children.forEach((child) => {
              const childNode = updatedNodes.get(child);
              if (childNode) {
                const updatedChild = {
                  ...childNode,
                  parents: childNode.parents.filter((parent) => parent !== currNode.id),
                };
                updatedNodes.set(child, updatedChild);
                updatedNodesToSave.push(updatedChild);
              }
            });
            updatedNodes.delete(currNode.id);
            deletedNodesToSave.push(currNode);
          }
        });
        addToHistory({
          type: "delete",
          diff: deletedNodesToSave.map((node) => node.id),
          nodes: updatedNodes,
        });
        saveDeletedNodes(updatedNodesToSave, deletedNodesToSave).catch((err) => console.log(err));
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
    <div className="absolute bottom-8 left-1/2" style={{ transform: "translate(-50%, 0)" }}>
      <motion.div
        initial={{ y: 800 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 100, bounce: 0.2 }}
      >
        <Card shadow>
          <CardBody className="flex flex-row !p-5 items-center">
            <Tooltip offset={15} content="fill">
              <div className="w-full h-full flex items-center hover:-translate-y-1 hover:scale-110 duration-300 pl-4 pr-3">
                <NodeColorPanel value="fill" />
              </div>
            </Tooltip>
            <Tooltip offset={15} content="stroke">
              <div className="w-full h-full flex items-center hover:-translate-y-1 hover:scale-110 duration-300 px-3">
                <NodeColorPanel value="stroke" />
              </div>
            </Tooltip>

            <Tooltip offset={15} content="edge">
              <div className="w-full h-full flex items-center hover:-translate-y-1 hover:scale-110 duration-300 px-3">
                <NodeColorPanel value="line" />
              </div>
            </Tooltip>

            <Tooltip offset={15} content="shape">
              <div className="w-full h-full flex items-center hover:-translate-y-1 hover:scale-110 duration-300 px-3">
                <NodeShapePanel />
              </div>
            </Tooltip>
            <div className="ml-5 w-full h-full pl-8 pr-2 border-l-2">
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
      </motion.div>
    </div>
  );
};

export default ToolBox;
