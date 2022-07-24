import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { RoomContext } from "../../../../context/RoomContext";
import useChangeNodeStyle from "../../../../hooks/useChangeNodeStyle";

type Props = {
  color: string;
  value: "fill" | "stroke" | "line";
};

const ColorButton: React.FC<Props> = ({ color, value }) => {
  const { changeNodeColors } = useChangeNodeStyle();
  const { fillStyle, strokeStyle } = useContext(RoomContext);

  const handleChangeColor = () => {
    changeNodeColors(color, value);
  };
  // 選択されている色を視覚的にわかりやすくするため
  const selectedColor = "rounded-lg border-2 border-blue-500";
  const notSelectedColor = "hover:bg-grey-300 rounded-lg";

  let style = "";
  if (value === "fill") {
    style = color === fillStyle ? selectedColor : notSelectedColor;
  } else if (value === "stroke") {
    style = color === strokeStyle ? selectedColor : notSelectedColor;
  }
  // else if (value === "line") {
  //   style = color === strokeStyle ? selectedColor : notSelectedColor;
  // }

  return (
    <button type="button" className={style} onClick={handleChangeColor}>
      <FontAwesomeIcon icon={faCircle} color={color} stroke={color} fontSize={20} />
    </button>
  );
};

export default ColorButton;
