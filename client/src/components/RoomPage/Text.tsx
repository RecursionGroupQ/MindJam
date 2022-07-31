import React, { useContext, useRef, useEffect, useState } from "react";
import { Html } from "react-konva-utils";
import { EditorState, convertFromRaw, RawDraftContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { RoomContext, Node } from "../../context/RoomContext";
import Editor from "./Editor";
import useHistory from "../../hooks/useHistory";

type Props = {
  node: Node;
  isEditing: boolean;
  onToggleEdit: () => void;
};

const Text: React.FC<Props> = ({ node, isEditing, onToggleEdit }) => {
  const contentState = convertFromRaw(JSON.parse(node.text) as RawDraftContentState);
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createWithContent(contentState));
  const { stageConfig, stageRef, setNodes } = useContext(RoomContext);
  const textRef = useRef<HTMLDivElement | null>(null);
  const htmlString = draftToHtml(JSON.parse(node.text) as RawDraftContentState)
    .replaceAll(/<p><\/p>/g, "<br>")
    .replaceAll(/<h1><\/h1>/g, "<br>")
    .replaceAll(/<h2><\/h2>/g, "<br>")
    .replaceAll(/<h3><\/h3>/g, "<br>");
  const { addToHistory } = useHistory();

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

  // ノードとテキストの位置を調整
  let x: number;
  if (node.shapeType === "rect") x = 0;
  else if (node.shapeType === "ellipse") x = -node.width / 4;
  else x = -node.width / 10;

  let y: number;
  if (node.shapeType === "rect") y = 0;
  else if (node.shapeType === "ellipse") y = -node.height / 4;
  else y = -node.height / 4;

  let width: number;
  if (node.shapeType === "rect") width = node.width;
  else if (node.shapeType === "ellipse") width = node.width / 2;
  else width = node.width / 5;

  let height: number;
  if (node.shapeType === "rect") height = node.height;
  else if (node.shapeType === "ellipse") height = node.height / 2;
  else height = node.height / 2;

  return (
    <>
      {isEditing && (
        <Html
          groupProps={{
            x,
            y,
            width: node.width,
            height: node.height,
          }}
          divProps={{ style: { opacity: 1 } }}
        >
          <div className="rounded-md sm:text-lg overflow-scroll" style={{ width, height }}>
            {/* components inside <Html /> may not have access to upper context (so you have to bridge contexts manually) */}
            <Editor
              editorState={editorState}
              setEditorState={setEditorState}
              node={node}
              setNodes={setNodes}
              onToggleEdit={onToggleEdit}
              stageConfig={stageConfig}
              addToHistory={addToHistory}
            />
          </div>
        </Html>
      )}
      {!isEditing && (
        <Html
          groupProps={{
            x,
            y,
            width: node.width,
            height: node.height,
          }}
          divProps={{ style: { opacity: 1 } }}
        >
          <div
            ref={textRef}
            // テキストのcssのclass
            className="text"
            style={{
              width,
              height,
              overflow: "scroll",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onDoubleClick={onToggleEdit}
            aria-hidden="true"
          >
            <div
              className="p-2 rounded-md sm:text-lg prose prose-stone"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: htmlString }}
              style={{ width, height }}
            />
          </div>
        </Html>
      )}
    </>
  );
};

export default Text;
