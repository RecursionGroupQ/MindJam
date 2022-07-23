import React, { useContext, useEffect, useRef, useState } from "react";
import Konva from "konva";
import { Group } from "react-konva";
import { Editor } from "react-draft-wysiwyg";
import { Html } from "react-konva-utils";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
// import * as htmlToImage from "html-to-image";
// import Quill from "quill";
import { RoomContext, Node } from "../../context/RoomContext";
// import EditableText from "./EditableText";
import RectShape from "./ShapeComponent/RectShape";
import EllipseShape from "./ShapeComponent/EllipseShape";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../index.css";

type Props = {
  node: Node;
};

const Shape: React.FC<Props> = ({ node }) => {
  const { nodes, setNodes, selectedNode, setSelectedNode, selectedShapes, setSelectedShapes, stageConfig } =
    useContext(RoomContext);
  const shapeRef = useRef<Konva.Group>(null);
  const [text, setText] = useState<string>(node.text);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    // add node.id as attribute to ref of shape
    shapeRef.current?.setAttr("id", node.id);
  }, [node.id]);

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    setNodes(
      nodes.map((currNode) => {
        const { x, y } = e.target.position();
        // check if currNode is in selectedShapes
        const otherSelectedShape = selectedShapes.find((shape) => currNode.id === shape.getAttr("id")) as Konva.Group;
        if (currNode.id === node.id) {
          return {
            ...currNode,
            x,
            y,
          };
        }
        if (otherSelectedShape && otherSelectedShape.getAttr("id") !== node.id) {
          return {
            ...currNode,
            x: otherSelectedShape.getAttr("x") as number,
            y: otherSelectedShape.getAttr("y") as number,
          };
        }
        return currNode;
      })
    );
  };

  const handleTextClick = (e: React.MouseEvent) => {
    // shift でノードをクリックした場合、複数選択から追加・消去のみ行う
    if (e.shiftKey) {
      setSelectedNode(null);
      if (selectedShapes.find((shape) => shape._id === shapeRef.current?._id)) {
        setSelectedShapes((prevState) => prevState.filter((shape) => shape._id !== shapeRef.current?._id));
      } else {
        setSelectedShapes((prevState) => [...prevState, shapeRef.current as Konva.Group]);
      }
      return;
    }
    if (selectedNode && selectedNode.id !== node.id) {
      setNodes(
        nodes.map((currNode) => {
          if (selectedNode.id === currNode.id) {
            if (
              !node.children.includes(currNode.id) &&
              !currNode.children.includes(node.id) &&
              currNode.id !== node.id
            ) {
              return {
                ...currNode,
                children: [...currNode.children, node.id],
              };
            }
          }
          return currNode;
        })
      );
      setSelectedNode(null);
      setSelectedShapes([]);
    } else {
      setSelectedNode(node);
      setSelectedShapes([shapeRef.current as Konva.Group]);
    }
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // shift でノードをクリックした場合、複数選択から追加・消去のみ行う
    if (e.evt.shiftKey) {
      setSelectedNode(null);
      if (selectedShapes.find((shape) => shape._id === shapeRef.current?._id)) {
        setSelectedShapes((prevState) => prevState.filter((shape) => shape._id !== shapeRef.current?._id));
      } else {
        setSelectedShapes((prevState) => [...prevState, shapeRef.current as Konva.Group]);
      }
      return;
    }
    if (selectedNode && selectedNode.id !== node.id) {
      setNodes(
        nodes.map((currNode) => {
          if (selectedNode.id === currNode.id) {
            if (
              !node.children.includes(currNode.id) &&
              !currNode.children.includes(node.id) &&
              currNode.id !== node.id
            ) {
              return {
                ...currNode,
                children: [...currNode.children, node.id],
              };
            }
          }
          return currNode;
        })
      );
      setSelectedNode(null);
      setSelectedShapes([]);
    } else {
      setSelectedNode(node);
      setSelectedShapes([shapeRef.current as Konva.Group]);
    }
  };

  const handleTransform = () => {
    if (shapeRef.current) {
      const currGroup = shapeRef.current;
      setNodes(
        nodes.map((currNode) => {
          const otherSelectedShape = selectedShapes.find((shape) => currNode.id === shape.getAttr("id")) as Konva.Group;
          if (currNode.id === node.id) {
            return {
              ...currNode,
              x: currGroup.x(),
              y: currGroup.y(),
            };
          }
          if (otherSelectedShape && otherSelectedShape.getAttr("id") !== node.id) {
            return {
              ...currNode,
              x: otherSelectedShape.getAttr("x") as number,
              y: otherSelectedShape.getAttr("y") as number,
            };
          }
          return currNode;
        })
      );
    }
  };

  const handleTransformEnd = () => {
    if (shapeRef.current) {
      const currGroup = shapeRef.current;

      const scaleX = currGroup.scaleX();
      const scaleY = currGroup.scaleY();

      currGroup.scaleX(1);
      currGroup.scaleY(1);

      setNodes(
        nodes.map((currNode) => {
          const otherSelectedShape = selectedShapes.find((shape) => currNode.id === shape.getAttr("id")) as Konva.Group;
          if (currNode.id === node.id) {
            return {
              ...currNode,
              width: currNode.width * scaleX,
              height: currNode.height * scaleY,
            };
          }
          if (otherSelectedShape && otherSelectedShape.getAttr("id") !== node.id) {
            return {
              ...currNode,
              width: currNode.width * scaleX,
              height: currNode.height * scaleY,
            };
          }
          return currNode;
        })
      );
    }
  };

  // const onTextChange = (value: string) => {
  //   // textの更新
  //   setText(value);
  // };

  const onEditorStateChange = (editorState: EditorState) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const html: string = draftToHtml(convertToRaw(editorState.getCurrentContent())).replaceAll(/<p><\/p>/g, "<br/>");
    setText(html);
  };

  const onToggleEdit = () => {
    // 編集モードの切替
    setIsEditing(!isEditing);
  };

  const contentBlocks = htmlToDraft(text);
  const contentState = ContentState.createFromBlockArray(contentBlocks.contentBlocks, contentBlocks.entityMap);

  return (
    <Group
      ref={shapeRef}
      x={node.x}
      y={node.y}
      draggable
      onDragMove={handleDragMove}
      onClick={handleClick}
      onTap={handleClick}
      onTransform={handleTransform}
      onTransformEnd={handleTransformEnd}
      onDblClick={onToggleEdit}
      name="mindmap-node"
    >
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
      {node.shapeType === "rect" && <RectShape node={node} />}
      {node.shapeType === "ellipse" && <EllipseShape node={node} />}
      {!isEditing && (
        <Html divProps={{ style: { opacity: 1 } }}>
          <div
            style={{
              width: node.width,
              height: node.height,
              overflow: "scroll",
              // wordWrap: "break-word",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onDoubleClick={onToggleEdit}
            aria-hidden="true"
            onClick={handleTextClick}
          >
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: text }} style={{ width: node.width, height: node.height }} />
          </div>
        </Html>
      )}
    </Group>
  );
};

export default Shape;
