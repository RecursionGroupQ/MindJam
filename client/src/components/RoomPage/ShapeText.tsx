import React from "react";
import { Text } from "react-konva";
import { Node } from "../../context/RoomContext";

type Props = {
  node: Node;
};

const ShapeText: React.FC<Props> = ({ node }) => <Text text={`${node.id}`} fontSize={20} align="center" />;
export default ShapeText;
