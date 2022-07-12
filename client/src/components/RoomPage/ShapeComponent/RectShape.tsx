import React from "react";
import { Rect } from "react-konva";
import { Node } from "../../../context/RoomContext";

type Props = {
  node: Node;
};

const RectShape: React.FC<Props> = ({ node }) => (
  <Rect width={200} height={80} stroke={node.fill} strokeWidth={4} cornerRadius={10} />
);

export default RectShape;
