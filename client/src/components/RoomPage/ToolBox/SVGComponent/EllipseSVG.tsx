import React from "react";

type Props = {
  fill: string;
  stroke: string;
  width: number;
  height: number;
};

const EllipseSVG: React.FC<Props> = ({ fill, stroke, width, height }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-circle"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke={stroke}
    fill={fill}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

export default EllipseSVG;
