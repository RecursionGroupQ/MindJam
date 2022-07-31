import React from "react";

import { motion } from "framer-motion";

import { FiSlash } from "react-icons/fi";

import useChangeNodeStyle from "../../../../hooks/useChangeNodeStyle";

type Props = {
  value: "fill" | "stroke" | "line";
};

const EmptyColorButton: React.FC<Props> = ({ value }) => {
  const { changeNodeColors } = useChangeNodeStyle();

  const emptyTheFill = () => {
    changeNodeColors("#ffffff00", value);
  };
  return (
    <motion.div whileHover={{ scale: [null, 1.5, 1.3] }} transition={{ duration: 0.3 }}>
      <button type="button" onClick={emptyTheFill}>
        <FiSlash size={40} color="black" />
      </button>
    </motion.div>
  );
};

export default EmptyColorButton;
