import React, { useContext } from "react";

import { motion } from "framer-motion";

import { BiChevronDownCircle, BiChevronRightCircle } from "react-icons/bi";
import { RoomContext } from "../../../../context/RoomContext";

const ColorPickerButton = () => {
  const { displayColorPicker, setDisplayColorPicker } = useContext(RoomContext);
  return (
    <motion.div whileHover={{ scale: [null, 1.5, 1.4] }} transition={{ duration: 0.3 }} className="flex justify-center">
      <button
        type="button"
        onClick={displayColorPicker ? () => setDisplayColorPicker(false) : () => setDisplayColorPicker(true)}
      >
        {displayColorPicker ? (
          <BiChevronRightCircle size={50} color="black" />
        ) : (
          <BiChevronDownCircle size={50} color="black" />
        )}
      </button>
    </motion.div>
  );
};

export default ColorPickerButton;
