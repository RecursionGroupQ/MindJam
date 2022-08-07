import React, { useContext } from "react";

import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";

import { motion } from "framer-motion";

import { BiRectangle } from "react-icons/bi";
import { IoEllipseOutline } from "react-icons/io5";
import { BsDiamond } from "react-icons/bs";
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
      {shapeType === "polygon" && (
        <PopoverHandler>
          <div className="h-full w-full flex justify-center items-center">
            <button type="button">
              <BsDiamond size={40} color="black" />
            </button>
          </div>
        </PopoverHandler>
      )}
      <PopoverContent className="bg-blue-grey-700">
        <div className="flex mb-5">
          <motion.div whileHover={{ scale: [null, 1.5, 1.3] }} transition={{ duration: 0.3 }}>
            <BiRectangle
              className="cursor-pointer"
              size={40}
              color="white"
              onClick={() => handleChangeOfShape("rect")}
            />
          </motion.div>
          <motion.div whileHover={{ scale: [null, 1.5, 1.3] }} transition={{ duration: 0.3 }}>
            <IoEllipseOutline
              className="cursor-pointer"
              size={40}
              color="white"
              onClick={() => handleChangeOfShape("ellipse")}
            />
          </motion.div>
          <motion.div whileHover={{ scale: [null, 1.5, 1.3] }} transition={{ duration: 0.3 }}>
            <BsDiamond
              className="cursor-pointer"
              size={40}
              color="white"
              onClick={() => handleChangeOfShape("polygon")}
            />
          </motion.div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NodeShapePanel;
