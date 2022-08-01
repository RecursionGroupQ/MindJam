import React from "react";
import { EditorState } from "draft-js";
import "./RichEditor.css";

interface ColorStyleMap {
  "color-black": {
    color: string;
  };
  "color-white": {
    color: string;
  };
  "color-red": {
    color: string;
  };
  "color-orange": {
    color: string;
  };
  "color-yellow": {
    color: string;
  };
  "color-green": {
    color: string;
  };
  "color-blue": {
    color: string;
  };
  "color-indigo": {
    color: string;
  };
  "color-violet": {
    color: string;
  };
}

type Props = {
  editorState: EditorState;
  onToggle: (inlineState: string) => void;
  colorStyleMap: ColorStyleMap;
};

type StyleButtonProps = {
  active: boolean;
  onToggle: (inlineState: string) => void;
  style: string;
  colorStyleMap: ColorStyleMap;
};

const COLORS = [
  { label: "Black", style: "color-black" },
  { label: "White", style: "color-white" },
  { label: "Red", style: "color-red" },
  { label: "Orange", style: "color-orange" },
  { label: "Yellow", style: "color-yellow" },
  { label: "Green", style: "color-green" },
  { label: "Blue", style: "color-blue" },
  { label: "Indigo", style: "color-indigo" },
  { label: "Violet", style: "color-violet" },
];

const styles = {
  controls: {
    fontFamily: "'Helvetica', sans-serif",
    fontSize: 18,
  },
};

const StyleButton: React.FC<StyleButtonProps> = ({ colorStyleMap, active, onToggle, style }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnToggle = (e: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    e.preventDefault();
    onToggle(style);
  };

  let styler;
  if (active) {
    styler = {
      outline: "2px solid black",
      backgroundColor: colorStyleMap[style as keyof ColorStyleMap].color,
    };
  } else {
    styler = {
      backgroundColor: colorStyleMap[style as keyof ColorStyleMap].color,
    };
  }
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span className="mr-2 px-3 rounded-full cursor-pointer" style={styler} onMouseDown={handleOnToggle} />
  );
};

const ColorControls: React.FC<Props> = ({ editorState, onToggle, colorStyleMap }) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div style={{ ...styles.controls, userSelect: "none" }}>
      {COLORS.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          onToggle={onToggle}
          style={type.style}
          colorStyleMap={colorStyleMap}
        />
      ))}
    </div>
  );
};

export default ColorControls;
