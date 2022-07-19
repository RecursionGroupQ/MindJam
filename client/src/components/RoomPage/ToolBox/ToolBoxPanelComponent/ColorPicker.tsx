import React, { useContext, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { RoomContext } from "../../../../context/RoomContext";

type Props = {
  value: string;
};

const ColorPicker: React.FC<Props> = ({ value }) => {
  const { nodes, setNodes, selectedNode, selectedShapes, setFillStyle, setStrokeStyle } = useContext(RoomContext);
  const [colorType, setColorType] = useState("#aabbcc");

  const handleChangeColorOnColorPicker = (color: string) => {
    setColorType(color);

    if (value === "fill") {
      setFillStyle(color);
      // ノードが一つだけ選択されている場合
      if (selectedNode && selectedShapes.length === 1) {
        setNodes(
          nodes.map((currNode) => {
            if (currNode.id === selectedNode.id) {
              return {
                ...currNode,
                fillStyle: colorType,
              };
            }
            return currNode;
          })
        );
      } // ノードが複数選択されている場合
      else if (selectedShapes.length >= 2) {
        setFillStyle(color);
        // 選択されているノードのindexを入れる
        const arr: string[] = [];
        Object.keys(selectedShapes).forEach((key) => {
          arr.unshift(String(selectedShapes[Number(key)].index));
        });
        // arrの中にcurrNode.idがあれば、fillStyleを変える
        setNodes(
          nodes.map((currNode) => {
            const isExist = arr.indexOf(currNode.id);
            if (isExist !== -1) {
              return {
                ...currNode,
                fillStyle: colorType,
              };
            }
            return currNode;
          })
        );
      }
    } else if (value === "stroke") {
      setStrokeStyle(color);
      if (selectedNode && selectedShapes.length === 1) {
        setNodes(
          nodes.map((currNode) => {
            if (currNode.id === selectedNode.id) {
              return {
                ...currNode,
                strokeStyle: colorType,
              };
            }
            return currNode;
          })
        );
      }
      // ノードが複数選択されている場合
      else if (selectedShapes.length >= 2) {
        setStrokeStyle(color);
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
                strokeStyle: colorType,
              };
            }
            return currNode;
          })
        );
      }
    }
  };
  return <HexColorPicker color={colorType} onChange={handleChangeColorOnColorPicker} />;
};

export default ColorPicker;
