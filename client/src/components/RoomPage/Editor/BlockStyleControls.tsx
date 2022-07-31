import React from "react";
import { EditorState } from "draft-js";
import "./RichEditor.css";
import {
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsBlockquoteLeft,
  // , BsTextLeft, BsTextCenter, BsTextRight
} from "react-icons/bs";
import { AiOutlineUnorderedList, AiOutlineOrderedList } from "react-icons/ai";
import { BiCodeBlock } from "react-icons/bi";

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

const BLOCK_TYPES = [
  { label: "H1", style: "header-one", component: <BsTypeH1 /> },
  { label: "H2", style: "header-two", component: <BsTypeH2 /> },
  { label: "H3", style: "header-three", component: <BsTypeH3 /> },
  { label: "UL", style: "unordered-list-item", component: <AiOutlineUnorderedList /> },
  { label: "OL", style: "ordered-list-item", component: <AiOutlineOrderedList /> },
  { label: "Blockquote", style: "blockquote", component: <BsBlockquoteLeft /> },
  { label: "Code Block", style: "code", component: <BiCodeBlock /> },
  // { label: "text-left", style: "text-align-left", component: <BsTextLeft /> },
  // { label: "text-center", style: "text-align-center", component: <BsTextCenter /> },
  // { label: "text-right", style: "text-align-right", component: <BsTextRight /> },
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

const BlockStyleControls: React.FC<Props> = ({ editorState, onToggle }) => {
  const selection = editorState.getSelection();
  const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

  return (
    <>
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          component={type.component}
          onToggle={onToggle}
          style={type.style}
        />
      ))}
    </>
  );
};

export default BlockStyleControls;
