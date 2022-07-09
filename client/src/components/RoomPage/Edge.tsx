import React, { useContext } from "react";
import { Line } from "react-konva";
import { RoomContext, Node } from "../../context/RoomContext";

type Props = {
  node: Node;
};

const Edge: React.FC<Props> = ({ node }) => {
  const { nodes } = useContext(RoomContext);

  const getEdgePoints = (from: Node, to: Node) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(-dy, dx);

    const radius = 60;

    return [
      from.x + -radius * Math.cos(angle + Math.PI),
      from.y + radius * Math.sin(angle + Math.PI),
      to.x + -radius * Math.cos(angle),
      to.y + radius * Math.sin(angle),
    ];
  };

  return (
    <>
      {node.children.map((childId) => {
        const childNode = nodes.filter((_node) => _node.id === childId)[0];
        return (
          <Line key={`${node.id}_${childId}`} points={getEdgePoints(node, childNode)} stroke="#9CA3AF" dash={[8, 4]} />
        );
      })}
    </>
  );
};

export default Edge;
