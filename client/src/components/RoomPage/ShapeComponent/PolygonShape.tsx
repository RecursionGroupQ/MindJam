import React from "react";
import { RegularPolygon } from "react-konva";
import { Node } from "../../../context/RoomContext";

type Props = {
  node: Node;
};
const PolygonShape: React.FC<Props> = ({ node }) => (
  <RegularPolygon radius={node.width / 2} sides={4} fill={node.fillStyle} stroke={node.strokeStyle} strokeWidth={5} />
);

export default PolygonShape;
