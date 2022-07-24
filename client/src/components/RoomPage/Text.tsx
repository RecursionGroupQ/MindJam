import React, { useContext, useState, useRef, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import { Html } from "react-konva-utils";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { RoomContext, Node } from "../../context/RoomContext";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

type Props = {
  node: Node;
  isEditing: boolean;
  onToggleEdit: () => void;
};

const Text: React.FC<Props> = ({ node, isEditing, onToggleEdit }) => {
  const { stageConfig, stageRef } = useContext(RoomContext);
  const [text, setText] = useState<string>(node.text);
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (stageRef && stageRef.current && !isEditing) {
      (stageRef.current.content.children[0] as HTMLElement).style.pointerEvents = "none";

      if (textRef) {
        const child = textRef.current?.parentElement as HTMLDivElement;
        const parent = stageRef.current.container();
        parent.removeChild(child);
        stageRef.current?.content.prepend(child);
      }
    }
  }, [stageRef, isEditing]);

  const onEditorStateChange = (editorState: EditorState) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const html: string = draftToHtml(convertToRaw(editorState.getCurrentContent())).replaceAll(/<p><\/p>/g, "<br/>");
    setText(html);
  };

  const contentBlocks = htmlToDraft(text);
  const contentState = ContentState.createFromBlockArray(contentBlocks.contentBlocks, contentBlocks.entityMap);

  return (
    <>
      {isEditing && (
        <Html
          groupProps={{
            x: 0,
            y: 0,
            width: node.width,
            height: node.height,
          }}
          divProps={{ style: { opacity: 1 } }}
        >
          <Editor
            defaultEditorState={EditorState.createWithContent(contentState)}
            toolbarOnFocus
            toolbarStyle={{
              position: "absolute",
              top: -50 * (1 / stageConfig.stageScale),
              left: -250 + node.width / 2,
              right: 0,
              width: 500,
              zIndex: 20,
              transform: `scale(${1 / stageConfig.stageScale})`,
            }}
            editorStyle={{ width: node.width, height: node.height }}
            toolbar={{
              options: ["inline", "blockType", "fontSize", "list", "textAlign", "colorPicker", "link", "history"],
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },
              blockType: { options: ["Normal", "H1", "H2", "H3", "H4", "H5", "H6", "Blockquote", "Code"] },
            }}
            localization={{
              locale: "ja",
            }}
            onBlur={onToggleEdit}
            onEditorStateChange={onEditorStateChange}
          />
        </Html>
      )}
      {!isEditing && (
        <Html divProps={{ style: { opacity: 1 } }}>
          <div
            ref={textRef}
            style={{
              width: node.width,
              height: node.height,
              overflow: "scroll",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onDoubleClick={onToggleEdit}
            aria-hidden="true"
          >
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: text }} style={{ width: node.width, height: node.height }} />
          </div>
        </Html>
      )}
    </>
  );
};

export default Text;
