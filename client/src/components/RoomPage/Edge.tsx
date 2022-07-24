import React, { useContext } from "react";
import { Shape } from "react-konva";
import { RoomContext, Node } from "../../context/RoomContext";

type Props = {
  node: Node;
};

const RADIUS = 50;

const Edge: React.FC<Props> = ({ node }) => {
  const { nodes } = useContext(RoomContext);

  return (
    <>
      {node.children.map((childId) => {
        const childNode = nodes.get(childId) as Node;
        const points = [node, childNode];
        return (
          <Shape
            key={`${node.id}_${childId}`}
            points={points}
            sceneFunc={(context, shape) => {
              const width = points[1].x - points[0].x;
              const height = points[1].y - points[0].y;
              const yDir = Math.sign(height);
              const xDir = Math.sign(width);
              const radius = Math.min(RADIUS, Math.abs(height / 2), Math.abs(width / 2));

              if (Math.abs(width) > Math.abs(height)) {
                context.beginPath();
                context.moveTo(points[0].x, points[0].y);
                context.lineTo(points[0].x + width / 2 - RADIUS * xDir, points[0].y);
                context.quadraticCurveTo(
                  points[0].x + width / 2,
                  points[0].y,
                  points[0].x + width / 2,
                  points[0].y + yDir * radius
                );
                context.lineTo(points[0].x + width / 2, points[1].y - yDir * radius);
                context.quadraticCurveTo(
                  points[0].x + width / 2,
                  points[1].y,
                  points[0].x + width / 2 + radius * xDir,
                  points[1].y
                );
              } else {
                context.beginPath();
                context.moveTo(points[0].x, points[0].y);
                context.lineTo(points[0].x, points[0].y + height / 2 - RADIUS * yDir);
                context.quadraticCurveTo(
                  points[0].x,
                  points[0].y + height / 2,
                  points[0].x + xDir * radius,
                  points[0].y + height / 2
                );
                context.lineTo(points[1].x - xDir * radius, points[0].y + height / 2);
                context.quadraticCurveTo(
                  points[1].x,
                  points[0].y + height / 2,
                  points[1].x,
                  points[0].y + height / 2 + radius * yDir
                );
              }
              context.lineTo(points[1].x, points[1].y);
              context.fillStrokeShape(shape);
            }}
            stroke="#000"
            strokeWidth={4}
            dash={[8, 4]}
          />
        );
      })}
    </>
  );
};

export default Edge;
