import React, { useContext } from "react";
import { Circle, Group, Text } from "react-konva";
import { RoomContext } from "../../context/RoomContext";

type Props = {
  x: number;
  y: number;
  name: string | null;
  color: string;
};

const UserCursor: React.FC<Props> = ({ x, y, name, color }) => {
  const { dark } = useContext(RoomContext);

  return (
    <Group x={x} y={y}>
      <Circle fill={color} radius={25} stroke="#000" />
      <Text
        offsetX={-20}
        offsetY={-20}
        text={name?.split(" ")[0] || ""}
        fontSize={40}
        fontFamily="Poppins"
        fill={dark ? "#fff" : "#000"}
      />
    </Group>
  );
};

export default UserCursor;
