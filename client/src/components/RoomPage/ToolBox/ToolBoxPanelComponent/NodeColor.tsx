import React, { useContext } from "react";

import { RoomContext } from "../../../../context/RoomContext";
import ColorPicker from "./ColorPicker";
import ColorPickerButton from "./ColorPickerButton";
import EmptyFillButton from "./EmptyFillButton";
import FillColor from "./FillColor";
import LineColor from "./LineColor";
import StrokeColor from "./StrokeColor";

type Props = {
  value: string;
};

const NodeColor: React.FC<Props> = ({ value }) => {
  const { displayColorPicker } = useContext(RoomContext);

  type ColorData = {
    id: number;
    colorType: string;
  };
  // ToolBox内の色の見本を出すためのデータ
  const colorData: ColorData[] = [
    {
      id: 0,
      colorType: "#3b82f6",
    },
    {
      id: 1,
      colorType: "#a855f7",
    },
    {
      id: 2,
      colorType: "#ec4899",
    },
    {
      id: 3,
      colorType: "#ef4444",
    },
    {
      id: 4,
      colorType: "#f97316",
    },
    {
      id: 5,
      colorType: "#eab308",
    },
    {
      id: 6,
      colorType: "#84cc16",
    },
    {
      id: 7,
      colorType: "#22c55e",
    },
    {
      id: 8,
      colorType: "#0ea5e9",
    },
    {
      id: 9,
      colorType: "#ffff00",
    },
    {
      id: 10,
      colorType: "#ffffff",
    },
    {
      id: 11,
      colorType: "#6b7280",
    },
    {
      id: 12,
      colorType: "#000000",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-7">
        {colorData.map((color) => (
          <div key={color.id}>
            {value === "fill" && <FillColor colorType={color.colorType} />}
            {value === "stroke" && <StrokeColor colorType={color.colorType} />}
            {value === "line" && <LineColor colorType={color.colorType} />}
          </div>
        ))}
        <ColorPickerButton />
        {value === "line" ? null : <EmptyFillButton value={value} />}
      </div>
      {displayColorPicker ? <ColorPicker value={value} /> : null}
    </>
  );
};

export default NodeColor;
