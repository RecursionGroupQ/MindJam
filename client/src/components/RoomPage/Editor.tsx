import React, { useRef, useEffect } from "react";
import { Editor as DraftEditor, convertToRaw, RichUtils, ContentBlock, EditorState, Modifier } from "draft-js";
import { Node, StageConfig } from "../../context/RoomContext";
import InlineStyleControls from "./Editor/InlineStyleControls";
import BlockStyleControls from "./Editor/BlockStyleControls";
import "draft-js/dist/Draft.css";
import ColorControls from "./Editor/ColorControls";
import FontControls from "./Editor/FontControls";

type Props = {
  node: Node;
  setNodes: React.Dispatch<React.SetStateAction<Map<string, Node>>>;
  onToggleEdit: () => void;
  editorState: EditorState;
  setEditorState: (editorState: EditorState) => void;
  stageConfig: StageConfig;
  addToHistory: (updatedNodes: Map<string, Node>) => void;
};

// according to draft to html doc
// Converts inline styles color, background-color, font-size, font-family to a span tag with inline style details: <span style="color:xyz;font-size:xx">.
// (The inline styles in JSON object should start with strings color or font-size like color-red, color-green or fontsize-12, fontsize-20).
const colorStyleMap = {
  "color-red": {
    color: "red",
  },
  "color-orange": {
    color: "orange",
  },
  "color-yellow": {
    color: "yellow",
  },
  "color-green": {
    color: "green",
  },
  "color-blue": {
    color: "blue",
  },
  "color-indigo": {
    color: "indigo",
  },
  "color-violet": {
    color: "violet",
  },
};

const fontStyleMap = {
  "fontsize-18": {
    fontSize: 18,
  },
  "fontsize-24": {
    fontSize: 24,
  },
  "fontsize-30": {
    fontSize: 30,
  },
  "fontsize-36": {
    fontSize: 36,
  },
  "fontsize-48": {
    fontSize: 48,
  },
};

// Custom overrides for style.
const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
  STRIKETHROUGH: {
    textDecoration: "line-through",
  },
};

const getBlockStyle = (contentBlock: ContentBlock) => {
  const type = contentBlock.getType();
  if (type === "blockquote") {
    return "RichEditor-blockquote";
  }
  if (type === "code") {
    return "code";
  }
  // エディタ上では表示されるがhtml上では消えてしまう
  // if (type === "text-align-left") {
  //   return "align-left";
  // }
  // if (type === "text-align-center") {
  //   return "align-center";
  // }
  // if (type === "text-align-right") {
  //   return "align-right";
  // }

  return "";
};

const Editor: React.FC<Props> = ({
  editorState,
  setEditorState,
  node,
  setNodes,
  onToggleEdit,
  stageConfig,
  addToHistory,
}) => {
  const editorRef = useRef<DraftEditor>(null);

  useEffect(() => {
    editorRef.current?.focus();
  }, []);

  // 色の切替（重複なし）
  const toggleColor = (toggledColor: string) => {
    const selection = editorState.getSelection();

    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(colorStyleMap).reduce(
      (contentState, color) => Modifier.removeInlineStyle(contentState, selection, color),
      editorState.getCurrentContent()
    );

    let nextEditorState = EditorState.push(editorState, nextContentState, "change-inline-style");

    const currentStyle = editorState.getCurrentInlineStyle();

    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce(
        (state, color) => RichUtils.toggleInlineStyle(state as EditorState, color as string),
        nextEditorState
      );
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledColor)) {
      nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, toggledColor);
    }

    setEditorState(nextEditorState);
  };

  // フォントの切替（重複なし）
  const toggleFontSize = (toggledFontSize: string) => {
    const selection = editorState.getSelection();

    // Let's just allow one color at a time. Turn off all active colors.
    const nextContentState = Object.keys(fontStyleMap).reduce(
      (contentState, fontSize) => Modifier.removeInlineStyle(contentState, selection, fontSize),
      editorState.getCurrentContent()
    );

    let nextEditorState = EditorState.push(editorState, nextContentState, "change-inline-style");

    const currentStyle = editorState.getCurrentInlineStyle();

    // Unset style override for current color.
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce(
        (state, fontSize) => RichUtils.toggleInlineStyle(state as EditorState, fontSize as string),
        nextEditorState
      );
    }

    // If the color is being toggled on, apply it.
    if (!currentStyle.has(toggledFontSize)) {
      nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, toggledFontSize);
    }

    setEditorState(nextEditorState);
  };

  // インラインスタイルの切替（重複あり）
  const toggleInlineStyle = (inlineState: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineState));
  };

  // ブロックタイプの切替（重複なし）
  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const handleOnBlur = () => {
    onToggleEdit();
    const content = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    setNodes((prevState) => {
      const currNode = prevState.get(node.id);
      if (!currNode) return prevState;
      const prevText = prevState.get(node.id)?.text;
      if (prevText && prevText !== content) {
        prevState.set(node.id, {
          ...currNode,
          text: content,
        });
        addToHistory(prevState);
      }
      return new Map(prevState);
    });
  };

  return (
    <div>
      {/* Toolbar */}
      <div
        className="flex justify-center align-middle bg-grey-100 z-20"
        style={{
          width: 650,
          position: "absolute",
          left: -325 + node.width / 2,
          top: -80 * (1 / stageConfig.stageScale),
          transform: `scale(${1 / stageConfig.stageScale})`,
        }}
      >
        <div className="flex-wrap">
          <ColorControls editorState={editorState} onToggle={toggleColor} colorStyleMap={colorStyleMap} />
          <FontControls editorState={editorState} onToggle={toggleFontSize} />
        </div>
        <div className="flex-wrap">
          <InlineStyleControls editorState={editorState} onToggle={toggleInlineStyle} />
          <BlockStyleControls editorState={editorState} onToggle={toggleBlockType} />
        </div>
      </div>
      {/* Editor */}
      <div className="p-2">
        <DraftEditor
          ref={editorRef}
          blockStyleFn={getBlockStyle}
          customStyleMap={{ ...styleMap, ...colorStyleMap, ...fontStyleMap }}
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Add text"
          onBlur={handleOnBlur}
        />
      </div>
    </div>
  );
};

export default Editor;
