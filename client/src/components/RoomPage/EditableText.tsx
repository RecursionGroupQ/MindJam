import React, { useContext } from "react";
import { Text } from "react-konva";
import EditableTextInput from "./EditableTextInput";
import { RoomContext, Node } from "../../context/RoomContext";

const ESCAPE_KEY = 27;

type Props = {
  node: Node;
  x: number;
  y: number;
  text: string;
  isEditing: boolean;
  onTextChange: (value: string) => void;
  onToggleEdit: () => void;
};

const EditableText: React.FC<Props> = ({ node, x, y, text, isEditing, onTextChange, onToggleEdit }) => {
  const { nodes, setNodes } = useContext(RoomContext);

  const handleOnBlurSaveText = () => {
    // クリックアウトでテキストをノードに保存し、編集モードを終了する。
    setNodes((prevState) => {
      const currNode = nodes.get(node.id);
      if (!currNode) return prevState;
      return new Map(
        prevState.set(node.id, {
          ...currNode,
          text,
        })
      );
    });
    onToggleEdit();
  };

  const handleOnKeyDownSaveText = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // キーダウン（Esc）でテキストをノードに保存し、編集モードを終了する。
    if (e.keyCode === ESCAPE_KEY) {
      setNodes((prevState) => {
        const currNode = nodes.get(node.id);
        if (!currNode) return prevState;
        return new Map(
          prevState.set(node.id, {
            ...currNode,
            text,
          })
        );
      });
      onToggleEdit();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // textの更新
    onTextChange(e.currentTarget.value);
  };

  if (isEditing) {
    return (
      <EditableTextInput
        x={x}
        y={y}
        width={node.width}
        height={node.height}
        text={text}
        onChange={handleTextChange}
        onBlur={handleOnBlurSaveText}
        onKeyDown={handleOnKeyDownSaveText}
      />
    );
  }
  return (
    <Text
      x={x}
      y={y}
      width={node.width}
      height={node.height}
      fontSize={25}
      text={text}
      align="center"
      verticalAlign="middle"
      onDblClick={onToggleEdit}
      fontFamily="Poppins"
    />
  );
};

export default EditableText;
