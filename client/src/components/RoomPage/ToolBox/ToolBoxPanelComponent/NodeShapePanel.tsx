import React, { useContext } from "react";

import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";

import { AiOutlineStar } from "react-icons/ai";
import { BiRectangle } from "react-icons/bi";
import { IoEllipseOutline } from "react-icons/io5";

import { RoomContext, ShapeType } from "../../../../context/RoomContext";
import useChangeNodeStyle from "../../../../hooks/useChangeNodeStyle";

const NodeShapePanel = () => {
  const { shapeType } = useContext(RoomContext);
  const { changeNodeShapes } = useChangeNodeStyle();
  const handleChangeOfShape = (displayShapeType: ShapeType) => {
    changeNodeShapes(displayShapeType);
  };
  return (
    <Popover placement="top">
      {shapeType === "rect" && (
        <PopoverHandler>
          <div className="h-full w-full flex justify-center items-center">
            <button type="button">
              <BiRectangle size={40} color="black" />
            </button>
          </div>
        </PopoverHandler>
      )}
      {shapeType === "ellipse" && (
        <PopoverHandler>
          <div className="h-full w-full flex justify-center items-center">
            <button type="button">
              <IoEllipseOutline size={40} color="black" />
            </button>
          </div>
        </PopoverHandler>
      )}
      {shapeType === "star" && (
        <PopoverHandler>
          <div className="h-full w-full flex justify-center items-center">
            <button type="button">
              <AiOutlineStar size={40} color="black" />
            </button>
          </div>
        </PopoverHandler>
      )}
      <PopoverContent>
        <div className="flex mb-10">
          <BiRectangle
            size={40}
            color="black"
            onClick={() => handleChangeOfShape("rect")}
            className="hover:bg-grey-300"
          />
          <IoEllipseOutline
            size={40}
            color="black"
            onClick={() => handleChangeOfShape("ellipse")}
            className="hover:bg-grey-300"
          />
          <AiOutlineStar
            size={40}
            color="black"
            onClick={() => handleChangeOfShape("star")}
            className="hover:bg-grey-300"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NodeShapePanel;
