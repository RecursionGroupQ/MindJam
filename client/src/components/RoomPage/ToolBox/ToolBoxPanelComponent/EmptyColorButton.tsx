import React from "react";

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
    <button type="button" onClick={emptyTheFill}>
      <FiSlash size={40} color="black" />
    </button>
  );
};

export default EmptyColorButton;
