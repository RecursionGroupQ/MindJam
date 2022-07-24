import React from "react";
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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="35"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={emptyTheFill}
      className="hover:bg-grey-300"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" color="red" />
    </svg>
  );
};

export default EmptyColorButton;
