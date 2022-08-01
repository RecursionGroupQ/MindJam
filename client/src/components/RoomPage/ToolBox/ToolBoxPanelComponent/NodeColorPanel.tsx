import React, { useContext } from "react";

import { Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react";

import { BsPencilSquare } from "react-icons/bs";
import { IoMdColorFill } from "react-icons/io";
import { MdOutlineBorderColor } from "react-icons/md";

import NodeColor from "./NodeColor";
import { RoomContext } from "../../../../context/RoomContext";

type Props = {
  value: "fill" | "stroke" | "line";
};

const NodeColorPanel: React.FC<Props> = ({ value }) => {
  const { fillStyle, strokeStyle, lineStyle } = useContext(RoomContext);

  return (
    <Popover placement="top">
      {value === "fill" && (
        <PopoverHandler>
          <div className="h-full w-full flex justify-center">
            <button type="button">
              <IoMdColorFill size={35} color="black" className="inline-block" />
              <div style={{ backgroundColor: fillStyle }} className="mt-3 px-2.5 py-0.5 rounded" />
            </button>
          </div>
        </PopoverHandler>
      )}
      {value === "stroke" && (
        <PopoverHandler>
          <div className="h-full w-full flex justify-center">
            <button type="button">
              <BsPencilSquare size={35} color="black" className="inline-block" />
              <div style={{ backgroundColor: strokeStyle }} className="mt-3 px-2.5 py-0.5 rounded" />
            </button>
          </div>
        </PopoverHandler>
      )}
      {value === "line" && (
        <PopoverHandler>
          <div className="h-full w-full flex justify-center">
            <button type="button">
              <MdOutlineBorderColor size={35} color="black" className="inline-block" />
              <div style={{ backgroundColor: lineStyle }} className="mt-3 px-2.5 py-0.5 rounded" />
            </button>
          </div>
        </PopoverHandler>
      )}
      <PopoverContent className="bg-blue-grey-700">
        <NodeColor value={value} />
      </PopoverContent>
    </Popover>
  );
};

export default NodeColorPanel;
