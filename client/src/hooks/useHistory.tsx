import { useContext } from "react";
import { Node, RoomContext } from "../context/RoomContext";

const useHistory = () => {
  const { nodes, history, setHistory, setIndex } = useContext(RoomContext);

  const addHistoryByDoubleClick = (newNode: Node) => {
    const newMap = new Map(nodes);
    newMap.set(newNode.id, newNode);
    const newHistory = [...history];
    setHistory([...newHistory, newMap]);
    const len = history.length;
    setIndex(len);
  };

  const addHistory = () => {
    const newMap = new Map(nodes);
    const newHistory = [...history];
    setHistory([...newHistory, newMap]);
    const len = history.length;
    setIndex(len);
  };

  return { addHistoryByDoubleClick, addHistory };
};

export default useHistory;
