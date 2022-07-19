import React, { useContext } from "react";
import { RoomContext } from "../../../../context/RoomContext";

type Props = {
  value: string;
};

const EmptyFillButton: React.FC<Props> = ({ value }) => {
  const { nodes, setNodes, selectedNode, selectedShapes } = useContext(RoomContext);

  const emptyTheFill = () => {
    if (value === "fill") {
      // ノードが一つだけ選択されている場合
      if (selectedNode && selectedShapes.length === 1) {
        setNodes(
          nodes.map((currNode) => {
            if (currNode.id === selectedNode.id) {
              return {
                ...currNode,
                fillStyle: "#ffffff",
              };
            }
            return currNode;
          })
        );
      } // ノードが複数選択されている場合
      else if (selectedShapes.length >= 2) {
        // 選択されているノードのindexを入れる
        const arr: string[] = [];
        Object.keys(selectedShapes).forEach((key) => {
          arr.unshift(String(selectedShapes[Number(key)].index));
        });
        // arrの中にcurrNode.idがあれば、shapeTypeを変える
        setNodes(
          nodes.map((currNode) => {
            const isExist = arr.indexOf(currNode.id);
            if (isExist !== -1) {
              return {
                ...currNode,
                fillStyle: "#ffffff",
              };
            }
            return currNode;
          })
        );
      }
    } else if (value === "stroke") {
      if (selectedNode && selectedShapes.length === 1) {
        setNodes(
          nodes.map((currNode) => {
            if (currNode.id === selectedNode.id) {
              return {
                ...currNode,
                strokeStyle: "#ffffff",
              };
            }
            return currNode;
          })
        );
      }
      // ノードが複数選択されている場合
      else if (selectedShapes.length >= 2) {
        // 選択されているノードのindexを入れる
        const arr: string[] = [];
        Object.keys(selectedShapes).forEach((key) => {
          arr.unshift(String(selectedShapes[Number(key)].index));
        });
        // arrの中にcurrNode.idがあれば、shapeTypeを変える
        setNodes(
          nodes.map((currNode) => {
            const isExist = arr.indexOf(currNode.id);
            if (isExist !== -1) {
              return {
                ...currNode,
                strokeStyle: "#ffffff",
              };
            }
            return currNode;
          })
        );
      }
    }
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="35"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={emptyTheFill}
      className="hover:bg-grey-300"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" color="red" />
    </svg>
  );
};

export default EmptyFillButton;
