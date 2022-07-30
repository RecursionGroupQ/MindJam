import React from "react";
import { EditorState } from "draft-js";
import "./RichEditor.css";
import { BsTypeBold, BsTypeItalic, BsTypeUnderline, BsCodeSlash, BsTypeStrikethrough } from "react-icons/bs";

type Props = {
  editorState: EditorState;
  onToggle: (inlineState: string) => void;
};

type StyleButtonProps = {
  active: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: any;
  onToggle: (inlineState: string) => void;
  style: string;
};

const INLINE_STYLES = [
  { label: "B", style: "BOLD", component: <BsTypeBold /> },
  { label: "I", style: "ITALIC", component: <BsTypeItalic /> },
  { label: "U", style: "UNDERLINE", component: <BsTypeUnderline /> },
  { label: "M", style: "CODE", component: <BsCodeSlash /> },
  { label: "S", style: "STRIKETHROUGH", component: <BsTypeStrikethrough /> },
];

const StyleButton: React.FC<StyleButtonProps> = ({ active, component, onToggle, style }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOnToggle = (e: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    e.preventDefault();
    onToggle(style);
  };

  let className = "RichEditor-styleButton";
  if (active) {
    className += " RichEditor-activeButton";
  }
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span style={{ fontSize: 25 }} className={className} onMouseDown={handleOnToggle}>
      {component}
    </span>
  );
};

const InlineStyleControls: React.FC<Props> = ({ editorState, onToggle }) => {
  const currentStyle = editorState.getCurrentInlineStyle();
  return (
    <>
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          component={type.component}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </>
  );
};

export default InlineStyleControls;
