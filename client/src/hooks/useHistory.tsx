import { useCallback, useContext } from "react";
import { Node, RoomContext } from "../context/RoomContext";

const useHistory = () => {
  const { setNodes, history, setHistory, historyIndex, setHistoryIndex } = useContext(RoomContext);

  // const addHistoryByDoubleClick = (newNode: Node) => {
  //   const newMap = new Map(nodes);
  //   newMap.set(newNode.id, newNode);
  //   const newHistory = [...history];
  //   setHistory([...newHistory, newMap]);
  //   const len = history.length;
  //   setHistoryIndex(len);
  // };

  // const addHistory = () => {
  //   const newMap = new Map(nodes);
  //   const newHistory = [...history];
  //   setHistory([...newHistory, newMap]);
  //   const len = history.length;
  //   setHistoryIndex(len);
  // };
  const undoByShortcutKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "KeyZ" && (e.ctrlKey || e.metaKey)) {
        if (historyIndex > 0) {
          const prevIndex: number = historyIndex - 1;
          const prevHistory = new Map(history[prevIndex]);
          setNodes(prevHistory);
          setHistoryIndex(prevIndex);
        }
      }
    },
    [history, historyIndex, setHistoryIndex, setNodes]
  );

  const redoByShortcutKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "KeyY" && (e.ctrlKey || e.metaKey)) {
        if (history.length - 1 > historyIndex) {
          const nextIndex: number = historyIndex + 1;
          const nextHistory = new Map(history[nextIndex]);
          setNodes(nextHistory);
          setHistoryIndex(nextIndex);
        }
      }
    },
    [history, historyIndex, setHistoryIndex, setNodes]
  );

  const addToHistory = (updatedNodes: Map<string, Node>) => {
    const newMap = new Map(updatedNodes);
    const newHistory = [...history];
    setHistory([...newHistory, newMap]);
    const len = history.length;
    setHistoryIndex(len);
  };

  return { addToHistory, undoByShortcutKey, redoByShortcutKey };
};

export default useHistory;
