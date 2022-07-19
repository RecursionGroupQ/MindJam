import React from "react";
import NodeStylePanel from "./ToolBoxPanelComponent/NodeStylePanel";

const ToolBox = () => (
  <div className="flex justify-center">
    <div className="mt-10 w-1/6 flex justify-around bg-white border-2 rounded-full border-gray-300">
      <div className="pl-3 pt-4 pb-3">
        <NodeStylePanel />
      </div>
      <div className="pl-3 pt-4 pb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="45"
          height="45"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="bevel"
        >
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      </div>
    </div>
  </div>
);

export default ToolBox;
