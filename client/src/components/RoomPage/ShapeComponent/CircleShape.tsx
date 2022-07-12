import React from "react";
import { Circle } from "react-konva";
import { Node } from "../../../context/RoomContext";

type Props = {
  node: Node;
};

const CircleShape: React.FC<Props> = ({ node }) => <Circle stroke={node.fill} radius={50} />;

export default CircleShape;
