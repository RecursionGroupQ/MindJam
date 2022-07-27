import React, { useContext } from "react";

import { BiChevronDownCircle } from "react-icons/bi";
import { RoomContext } from "../../../../context/RoomContext";

const ColorPickerButton = () => {
  const { displayColorPicker, setDisplayColorPicker } = useContext(RoomContext);
  return (
    <button
      type="button"
      onClick={displayColorPicker ? () => setDisplayColorPicker(false) : () => setDisplayColorPicker(true)}
    >
      <BiChevronDownCircle size={40} color="black" />
    </button>
  );
};

export default ColorPickerButton;
