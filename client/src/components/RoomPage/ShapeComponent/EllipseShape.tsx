import React from "react";
import { Ellipse } from "react-konva";
import { Node } from "../../../context/RoomContext";

type Props = {
  node: Node;
};

const EllipseShape: React.FC<Props> = ({ node }) => (
  <Ellipse
    fill={node.fillStyle}
    stroke={node.strokeStyle}
    strokeWidth={5}
    radiusX={node.width / 2}
    radiusY={node.height / 2}
  />
);

export default EllipseShape;
