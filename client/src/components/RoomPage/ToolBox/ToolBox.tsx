import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { RoomContext } from "../../../context/RoomContext";
import NodeStylePanel from "./ToolBoxPanelComponent/NodeStylePanel";

const ToolBox = () => {
  const { selectedNode, nodes, setNodes, selectedShapes, setSelectedNode, setSelectedShapes } = useContext(RoomContext);

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
        return updatedNodes;
      });
    }
    setSelectedNode(null);
    setSelectedShapes([]);
  };

  return (
    <div className="flex justify-center">
      <div className="mt-10 w-1/6 flex justify-around bg-white border-2 rounded-full border-gray-300">
        <div className="pl-3 pt-4 pb-3">
          <NodeStylePanel />
        </div>
        <div className="pl-3 pt-4 pb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="black"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="bevel"
          >
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" y1="20" x2="15" y2="20" />
            <line x1="12" y1="4" x2="12" y2="20" />
          </svg>
        </div>
        <div className="pl-3 pt-4 pb-3">
          <FontAwesomeIcon icon={faTrash} onClick={handleNodeDelete} fontSize={30} />
        </div>
      </div>
    </div>
  );
};

export default ToolBox;
