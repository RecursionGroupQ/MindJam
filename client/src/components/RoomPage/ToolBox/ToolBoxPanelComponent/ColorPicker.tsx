import React, { useState } from "react";
import { HexColorPicker } from "react-colorful";
import useChangeNodeStyle from "../../../../hooks/useChangeNodeStyle";

type Props = {
  value: "fill" | "stroke" | "line";
};

const ColorPicker: React.FC<Props> = ({ value }) => {
  const { changeNodeColors } = useChangeNodeStyle();
  const [colorType, setColorType] = useState("#aabbcc");

  const handleChangeColorOnColorPicker = (color: string) => {
    setColorType(color);
    changeNodeColors(color, value);
  };
  return <HexColorPicker color={colorType} onChange={handleChangeColorOnColorPicker} />;
};

export default ColorPicker;
