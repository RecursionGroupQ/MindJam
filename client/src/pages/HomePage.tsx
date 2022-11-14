// import { Card, CardBody } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import React, { useEffect, useRef, useState } from "react";
import { Circle, Group, Layer, Stage, Text } from "react-konva";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Konva from "konva";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../context/RoomContext";
import useLogin from "../hooks/useLogin";

const userColors = ["#EF4444", "#F59E0B", "#6366F1", "#8B5CF6", "#EC4899"];
// const colors = ["#a855f7", "#ec4899", "#ef4444", "#f97316", "#eab308", "#ffffff"];

const HomePage = () => {
  const [resizedCanvasWidth, setResizedCanvasWidth] = useState(CANVAS_WIDTH);
  const [resizedCanvasHeight, setResizedCanvasHeight] = useState(CANVAS_HEIGHT);
  const cursor1Ref = useRef<Konva.Group | null>(null);
  const cursor2Ref = useRef<Konva.Group | null>(null);
  const cursor3Ref = useRef<Konva.Group | null>(null);
  const { googleLogin } = useLogin();

  // const generateRandomNodes = () => {
  //   const nodes: Node[] = [];
  //   for (let i = 0; i < 2; i += 1) {
  //     const newNode: Node = {
  //       id: i.toString(),
  //       children: [],
  //       parents: [],
  //       text: "",
  //       shapeType: "ellipse",
  //       x: Math.random() * resizedCanvasWidth,
  //       y: Math.random() * resizedCanvasHeight,
  //       width: (Math.random() * (2 - 1) + 1) * 200,
  //       height: 90,
  //       // fillStyle: colors[Math.floor(Math.random() * colors.length)],
  //       fillStyle: colors[5],
  //       strokeStyle: "#000",
  //     };
  //     nodes.push(newNode);
  //   }
  //   return [];
  // };

  // const [randomNodes] = useState<Node[]>(generateRandomNodes());

  const resizeStage = () => {
    setResizedCanvasWidth(window.innerWidth);
    setResizedCanvasHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeStage);
    return () => {
      window.removeEventListener("resize", resizeStage);
    };
  }, [resizedCanvasWidth, resizedCanvasHeight]);

  const stageStyle = {
    backgroundColor: "#e2e8f0",
    opacity: 0.8,
    backgroundImage: "radial-gradient(#6b7280 1.1px, #e2e8f0 1.1px)",
    backgroundSize: `${50 * 1.1}px ${50 * 1.1}px`,
    backgroundPosition: "0px 0px",
  };

  useEffect(() => {
    if (cursor1Ref.current) {
      const anim1 = new Konva.Tween({
        node: cursor1Ref.current,
        duration: 2.5,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        easing: Konva.Easings.StrongEaseInOut,
        x: 150,
        y: 200,
      });

      anim1.play();
    }

    if (cursor2Ref.current) {
      const anim2 = new Konva.Tween({
        node: cursor2Ref.current,
        duration: 3,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        easing: Konva.Easings.EaseInOut,
        x: resizedCanvasWidth - 100,
        y: 250,
      });

      anim2.play();
    }

    if (cursor3Ref.current) {
      const anim3 = new Konva.Tween({
        node: cursor3Ref.current,
        duration: 4,
        // eslint-disable-next-line @typescript-eslint/unbound-method
        easing: Konva.Easings.StrongEaseInOut,
        x: resizedCanvasWidth / 2 + 150,
        y: resizedCanvasHeight - 100,
      });

      anim3.play();
    }
  }, [resizedCanvasWidth, resizedCanvasHeight]);

  return (
    <div>
      <div className="absolute top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%)" }}>
        <motion.div
          className="flex flex-col justify-center items-center"
          initial={{ y: -700 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, type: "spring", damping: 10, stiffness: 100, bounce: 1 }}
        >
          <div className="text-center mb-10">
            <p className="text-7xl font-thin">
              <span className="font-extrabold text-indigo-600">Visualize</span> your{" "}
              <span className="font-extrabold">ideas</span>
              <br />
              <span className="font-extrabold text-green-600">Collaborate</span> with{" "}
              <span className="font-extrabold">others</span>
            </p>
          </div>
          <div>
            <Button
              color="green"
              size="lg"
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={() => googleLogin().catch((err) => toast.error((err as Error).message))}
            >
              Get Started
            </Button>
          </div>
        </motion.div>
      </div>
      <Stage
        style={stageStyle}
        className="-z-10 absolute top-0 overflow-hidden"
        width={resizedCanvasWidth}
        height={resizedCanvasHeight}
      >
        <Layer>
          {/* {randomNodes.map((node) => (
            <Circle
              x={node.x}
              y={node.y}
              fill={node.fillStyle}
              stroke={node.strokeStyle}
              strokeWidth={5}
              radius={node.width}
              draggable
            />
          ))} */}
          <Group ref={cursor1Ref} x={-100} y={-100}>
            <Circle fill={userColors[0]} radius={25} stroke="#000" />
            <Text offsetX={-20} offsetY={-20} text="Bob" fontSize={40} fill="#000" />
          </Group>
          <Group ref={cursor2Ref} x={resizedCanvasWidth + 300} y={-250}>
            <Circle fill={userColors[1]} radius={25} stroke="#000" />
            <Text offsetX={-20} offsetY={-20} text="Aya" fontSize={40} fill="#000" />
          </Group>
          <Group ref={cursor3Ref} x={resizedCanvasWidth + 200} y={resizedCanvasHeight + 200}>
            <Circle fill={userColors[2]} radius={25} stroke="#000" />
            <Text offsetX={-20} offsetY={-20} text="Emi" fontSize={40} fill="#000" />
          </Group>
        </Layer>
      </Stage>
    </div>
  );
};

export default HomePage;
