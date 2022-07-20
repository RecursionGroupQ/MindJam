import React from "react";
import { Star } from "react-konva";
import { Node } from "../../../context/RoomContext";

type Props = {
  node: Node;
};
const StarShape: React.FC<Props> = ({ node }) => (
  <Star
    width={node.width}
    height={node.height}
    numPoints={6}
    innerRadius={node.width / 6}
    outerRadius={node.height / 2}
    fill={node.fillStyle}
    stroke={node.strokeStyle}
    strokeWidth={node.width / 100}
  />
);

export default StarShape;
