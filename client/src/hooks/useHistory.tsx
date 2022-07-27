import { useContext } from "react";
import { Node, RoomContext } from "../context/RoomContext";

const useHistory = () => {
  const { history, setHistory, setHistoryIndex } = useContext(RoomContext);

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

  const addToHistory = (updatedNodes: Map<string, Node>) => {
    const newMap = new Map(updatedNodes);
    const newHistory = [...history];
    setHistory([...newHistory, newMap]);
    const len = history.length;
    setHistoryIndex(len);
  };

  return { addToHistory };
};

export default useHistory;
