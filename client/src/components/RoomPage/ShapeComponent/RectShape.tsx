import React from "react";
import { Rect } from "react-konva";
import { Node } from "../../../context/RoomContext";

type Props = {
  node: Node;
};

const RectShape: React.FC<Props> = ({ node }) => (
  <Rect
    width={node.width}
    height={node.height}
    fill={node.fillStyle}
    stroke={node.strokeStyle}
    strokeWidth={5}
    cornerRadius={20}
  />
);

export default RectShape;
