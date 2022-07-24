import React, { useContext } from "react";

import { BsCircleFill } from "react-icons/bs";

import { RoomContext } from "../../../../context/RoomContext";
import useChangeNodeStyle from "../../../../hooks/useChangeNodeStyle";

type Props = {
  color: string;
  value: "fill" | "stroke" | "line";
};

const ColorButton: React.FC<Props> = ({ color, value }) => {
  const { changeNodeColors } = useChangeNodeStyle();
  const { fillStyle, strokeStyle, lineStyle } = useContext(RoomContext);

  const handleChangeColor = () => {
    changeNodeColors(color, value);
  };
  // 選択されている色を視覚的にわかりやすくするため
  const selectedColor = "rounded-sm border-2 border-black";
  const notSelectedColor = "hover:bg-grey-300 rounded-sm";

  let style = "";
  if (value === "fill") {
    style = color === fillStyle ? selectedColor : notSelectedColor;
  } else if (value === "stroke") {
    style = color === strokeStyle ? selectedColor : notSelectedColor;
  } else if (value === "line") {
    style = color === lineStyle ? selectedColor : notSelectedColor;
  }

  return (
    <button type="button" className={style} onClick={handleChangeColor}>
      <BsCircleFill size={40} color={color} />
    </button>
  );
};

export default ColorButton;
