import React, { useContext } from "react";

import { RoomContext } from "../../../../context/RoomContext";
import ColorPicker from "./ColorPicker";
import ColorPickerButton from "./ColorPickerButton";
import EmptyColorButton from "./EmptyColorButton";
import ColorButton from "./ColorButton";

type Props = {
  value: "fill" | "stroke" | "line";
};

// ToolBox内の色の見本を出すためのデータ
const colorData: string[] = [
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#0ea5e9",
  "#ffff00",
  "#ffffff",
  "#6b7280",
  "#000000",
];

const NodeColor: React.FC<Props> = ({ value }) => {
  const { displayColorPicker } = useContext(RoomContext);

  return (
    <>
      <div className="grid grid-cols-7">
        {colorData.map((color) => (
          <div key={color} className="py-3 px-1">
            <ColorButton color={color} value={value} />
          </div>
        ))}
        <ColorPickerButton />
        {value === "line" ? null : <EmptyColorButton value={value} />}
      </div>
      {displayColorPicker ? <ColorPicker value={value} /> : null}
    </>
  );
};

export default NodeColor;
