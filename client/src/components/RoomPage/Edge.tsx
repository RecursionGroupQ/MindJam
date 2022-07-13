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

    return [
      from.x - Math.cos(angle + Math.PI),
      from.y + Math.sin(angle + Math.PI),
      to.x - Math.cos(angle),
      to.y + Math.sin(angle),
    ];
  };

  return (
    <>
      {node.children.map((childId) => {
        const childNode = nodes.filter((_node) => _node.id === childId)[0];
        return (
          <Line
            key={`${node.id}_${childId}`}
            points={getEdgePoints(node, childNode)}
            stroke="#9CA3AF"
            strokeWidth={4}
            dash={[8, 4]}
          />
        );
      })}
    </>
  );
};

export default Edge;
