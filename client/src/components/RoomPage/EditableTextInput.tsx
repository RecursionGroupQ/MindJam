import React, { useRef, useEffect } from "react";
import { Html } from "react-konva-utils";

type BaseStyle = {
  width: string;
  height: string;
  border: string;
  padding: string;
  margin: string;
  background: string;
  outline: string;
  // resize: string;
  colour: string;
  fontSize: string;
  fontFamily: string;
  margintop: string;
};

const getStyle = (width: number, height: number): BaseStyle => {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  const baseStyle: BaseStyle = {
    width: `${width}px`,
    height: `${height}px`,
    border: "none",
    padding: "0px",
    margin: "0px",
    background: "none",
    outline: "none",
    // resize: "none",
    colour: "black",
    fontSize: "25px",
    fontFamily: "sans-serif",
    margintop: "-4px",
  };
  if (isFirefox) {
    return baseStyle;
  }
  return {
    ...baseStyle,
    margintop: "-4px",
  };
};

type Props = {
  x: number;
  y: number;
  text: string;
  width: number;
  height: number;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined;
  onBlur: () => void;
  onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> | undefined;
};

const EditableTextInput: React.FC<Props> = ({ x, y, text, width, height, onChange, onBlur, onKeyDown }) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current?.value) {
      const value = ref.current?.value;
      ref.current.value = "";
      ref.current.focus();
      ref.current.value = value;
    }
  }, []);

  const style: BaseStyle = getStyle(width, height);
  return (
    <Html groupProps={{ x, y }} divProps={{ style: { opacity: 1 } }}>
      <textarea
        ref={ref}
        value={text}
        style={{ ...style, resize: "none" }}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
    </Html>
  );
};

export default EditableTextInput;
