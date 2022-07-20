import React from "react";

import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush } from "@fortawesome/free-solid-svg-icons";

import NodeColor from "./NodeColor";
import RectSVG from "../SVGComponent/RectSVG";
import EllipseSVG from "../SVGComponent/EllipseSVG";
import { ShapeType } from "../../../../context/RoomContext";
import useChangeNodeStyle from "../../../../hooks/useChangeNodeStyle";

type PanelData = {
  label: "Fill" | "Stroke" | "Line";
  value: "fill" | "stroke" | "line";
  content: JSX.Element;
}[];

const NodeStylePanel = () => {
  const { changeNodeShapes } = useChangeNodeStyle();

  const handleChangeOfShape = (shapeType: ShapeType) => {
    changeNodeShapes(shapeType);
  };

  const panelData: PanelData = [
    {
      label: "Fill",
      value: "fill",
      content: <NodeColor value="fill" />,
    },
    {
      label: "Stroke",
      value: "stroke",
      content: <NodeColor value="stroke" />,
    },
    {
      label: "Line",
      value: "line",
      content: <NodeColor value="line" />,
    },
  ];

  return (
    <Popover placement="left-start">
      <PopoverHandler>
        <button type="button">
          <FontAwesomeIcon icon={faPaintBrush} fontSize={30} />
        </button>
      </PopoverHandler>
      <PopoverContent>
        <Tabs value="fill">
          <div className="mt-1 mb-3">
            <p className="text-xl text-black font-bold">スタイル</p>
          </div>
          <TabsHeader className="rounded-none">
            <div className="flex justify-center mt-5 mx-5 bg-grey-300 rounded-md">
              {panelData.map(({ label, value }) => (
                <Tab key={value} value={value} className="px-5 bg-grey-300 rounded-md">
                  {label}
                </Tab>
              ))}
            </div>
          </TabsHeader>
          <TabsBody className="bg-grey-100">
            {panelData.map(({ value, content }) => (
              <TabPanel key={value} value={value}>
                {content}
              </TabPanel>
            ))}
            <div className="flex">
              <div className="ml-5">
                <button type="button" className="hover:bg-grey-300" onClick={() => handleChangeOfShape("rect")}>
                  <RectSVG />
                </button>
              </div>
              <div>
                <button type="button" className="hover:bg-grey-300" onClick={() => handleChangeOfShape("ellipse")}>
                  <EllipseSVG fill="none" stroke="#000000" width={44} height={44} />
                </button>
              </div>
              <div>
                <button type="button" className="hover:bg-grey-300" onClick={() => handleChangeOfShape("star")}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="45"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 16 7 22 9.27 18.50 14 18.18 21.02 12 19 5.82 21.02 5 14.14 2 9.27 8 7 12 2" />
                  </svg>
                </button>
              </div>
            </div>
          </TabsBody>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default NodeStylePanel;
