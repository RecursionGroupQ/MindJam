import React from "react";
import { Rect } from "react-konva";
import { Node } from "../../../context/RoomContext";

type Props = {
  node: Node;
};

const RectShape: React.FC<Props> = ({ node }) => (
  <Rect width={node.width} height={node.height} stroke={node.fill} fill="#fff" strokeWidth={4} cornerRadius={10} />
);

export default RectShape;
