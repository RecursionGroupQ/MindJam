import React from "react";
import EllipseSVG from "../SVGComponent/EllipseSVG";

type Props = {
  colorType: string;
};
const LineColor: React.FC<Props> = ({ colorType }) => (
  <button type="button" className="hover:bg-grey-300 rounded-lg">
    <EllipseSVG fill={colorType} stroke={colorType} width={30} height={35} />
  </button>
);

export default LineColor;
