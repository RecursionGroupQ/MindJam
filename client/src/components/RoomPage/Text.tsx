import React, { useContext, useRef, useEffect, useState } from "react";
import { Html } from "react-konva-utils";
import { EditorState, convertFromRaw, RawDraftContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { RoomContext, Node } from "../../context/RoomContext";
import Editor from "./Editor";
import useHistory from "../../hooks/useHistory";
import useSaveRoom from "../../hooks/firebase/useSaveRoom";

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
  const { saveUpdatedNodes } = useSaveRoom();

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

  const getTextWidth = () => {
    if (node.shapeType === "ellipse") {
      return (node.width / 2) * Math.sqrt(2);
    }
    if (node.shapeType === "polygon") {
      return (node.width / 2) * Math.sqrt(2);
    }
    return node.width;
  };

  const getTextHeight = () => {
    if (node.shapeType === "ellipse") {
      return (node.height / 2) * Math.sqrt(2);
    }
    if (node.shapeType === "polygon") {
      return (node.width / 2) * Math.sqrt(2);
    }
    return node.height;
  };

  const getX = () => {
    if (node.shapeType === "ellipse") {
      return -getTextWidth() / 2;
    }
    if (node.shapeType === "polygon") {
      return -getTextWidth() / 2;
    }
    return 0;
  };

  const getY = () => {
    if (node.shapeType === "ellipse") {
      return -getTextHeight() / 2;
    }
    if (node.shapeType === "polygon") {
      return -getTextHeight() / 2;
    }
    return 0;
  };

  return (
    <>
      {isEditing && (
        <Html
          groupProps={{
            x: getX(),
            y: getY(),
            width: getTextWidth(),
            height: getTextHeight(),
          }}
          divProps={{ style: { opacity: 1 } }}
        >
          <div className="rounded-md sm:text-lg" style={{ width: getTextWidth(), height: getTextHeight() }}>
            {/* components inside <Html /> may not have access to upper context (so you have to bridge contexts manually) */}
            <Editor
              editorState={editorState}
              setEditorState={setEditorState}
              node={node}
              setNodes={setNodes}
              onToggleEdit={onToggleEdit}
              stageConfig={stageConfig}
              addToHistory={addToHistory}
              saveUpdatedNodes={saveUpdatedNodes}
            />
          </div>
        </Html>
      )}
      {!isEditing && (
        <Html
          groupProps={{
            x: getX(),
            y: getY(),
            width: getTextWidth(),
            height: getTextHeight(),
          }}
          divProps={{ style: { opacity: 1 } }}
        >
          <div
            ref={textRef}
            // テキストのcssのclass
            className="text"
            style={{
              width: getTextWidth(),
              height: getTextHeight(),
              overflow: "scroll",
            }}
            onDoubleClick={onToggleEdit}
            aria-hidden="true"
          >
            <div
              className="p-2 rounded-md sm:text-lg prose prose-stone text-center"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: htmlString }}
              style={{ width: getTextWidth(), height: getTextHeight() }}
            />
          </div>
        </Html>
      )}
    </>
  );
};

export default Text;
