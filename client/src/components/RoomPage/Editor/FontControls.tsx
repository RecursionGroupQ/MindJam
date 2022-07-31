import React from "react";
import { EditorState } from "draft-js";
import "./RichEditor.css";

type Props = {
  editorState: EditorState;
  onToggle: (inlineState: string) => void;
};

type StyleButtonProps = {
  active: boolean;
  label: string;
  onToggle: (inlineState: string) => void;
  style: string;
};

const INLINE_FONTSIZE = [
  { label: "18", style: "fontsize-18" },
  { label: "24", style: "fontsize-24" },
  { label: "30", style: "fontsize-30" },
  { label: "36", style: "fontsize-36" },
  { label: "48", style: "fontsize-48" },
];

const styles = {
  controls: {
    fontFamily: "'Helvetica', sans-serif",
    fontSize: 18,
  },
  styleButton: {
    color: "#999",
    cursor: "pointer",
    marginRight: 10,
    padding: "2px 0",
  },
};

const StyleButton: React.FC<StyleButtonProps> = ({ active, label, onToggle, style }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnToggle = (e: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    e.preventDefault();
    onToggle(style);
  };
  let styler;
  if (active) {
    styler = {
      ...styles.styleButton,
      color: "#5890ff",
    };
  } else {
    styler = styles.styleButton;
  }
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span style={styler} onMouseDown={handleOnToggle}>
      {label}
    </span>
  );
};

const FontControls: React.FC<Props> = ({ editorState, onToggle }) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div style={{ ...styles.controls, userSelect: "none" }}>
      {INLINE_FONTSIZE.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

export default FontControls;
