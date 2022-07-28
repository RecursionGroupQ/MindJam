import React from "react";

import { motion } from "framer-motion";

import { BsCircleFill } from "react-icons/bs";

import useChangeNodeStyle from "../../../../hooks/useChangeNodeStyle";

type Props = {
  color: string;
  value: "fill" | "stroke" | "line";
};

const ColorButton: React.FC<Props> = ({ color, value }) => {
  const { changeNodeColors } = useChangeNodeStyle();

  const handleChangeColor = () => {
    changeNodeColors(color, value);
  };

  return (
    <motion.div whileHover={{ scale: [null, 1.5, 1.3] }} transition={{ duration: 0.3 }}>
      <button type="button" onClick={handleChangeColor}>
        <BsCircleFill size={40} color={color} />
      </button>
    </motion.div>
  );
};

export default ColorButton;
