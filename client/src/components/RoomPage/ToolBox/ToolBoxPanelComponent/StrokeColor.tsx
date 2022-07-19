import React, { useContext } from "react";
import { RoomContext } from "../../../../context/RoomContext";
import EllipseSVG from "../SVGComponent/EllipseSVG";

type Props = {
  colorType: string;
};

const StrokeColor: React.FC<Props> = ({ colorType }) => {
  const { nodes, setNodes, selectedNode, selectedShapes, strokeStyle, setStrokeStyle } = useContext(RoomContext);
  const handleChangeStroke = (color: string) => {
    if (selectedNode && selectedShapes.length === 1) {
      setNodes(
        nodes.map((currNode) => {
          if (currNode.id === selectedNode.id) {
            return {
              ...currNode,
              strokeStyle: color,
            };
          }
          return currNode;
        })
      );
      setStrokeStyle(color);
    } else if (selectedShapes.length >= 2) {
      // 選択されているノードのindexを入れる
      const arr: string[] = [];
      Object.keys(selectedShapes).forEach((key) => {
        arr.unshift(String(selectedShapes[Number(key)].index));
      });
      // arrの中にcurrNode.idがあれば、strokeStyleを変える
      setNodes(
        nodes.map((currNode) => {
          const isExist = arr.indexOf(currNode.id);
          if (isExist !== -1) {
            return {
              ...currNode,
              strokeStyle: color,
            };
          }
          return currNode;
        })
      );
      setStrokeStyle(color);
    }
    setStrokeStyle(color);
  };
  // 選択されている色を視覚的にわかりやすくするため
  const selectedColor = "rounded-lg border-2 border-blue-500";
  const notSelectedColor = "hover:bg-grey-300 rounded-lg";
  const style = colorType === strokeStyle ? selectedColor : notSelectedColor;

  return (
    <button type="button" className={style} onClick={() => handleChangeStroke(colorType)}>
      <EllipseSVG fill={colorType} stroke={colorType} width={30} height={35} />
    </button>
  );
};

export default StrokeColor;
