import { useCallback, useContext } from "react";
import { History, RoomContext } from "../context/RoomContext";
import useSaveRoom from "./firebase/useSaveRoom";
import useSocket from "./useSocket";

const useHistory = () => {
  const { setNodes, history, setHistory, historyIndex, setHistoryIndex } = useContext(RoomContext);
  const { saveUpdatedNodes, handleUndoAdd, handleRedoDelete } = useSaveRoom();
  const { updateRoom } = useSocket();

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex: number = historyIndex - 1;
      const currHistory = history[historyIndex];
      // const prevHistory = history[prevIndex];
      const prevHistoryNodes = new Map(history[prevIndex].nodes);
      const updatedNodesToSave = Array.from(prevHistoryNodes.values());

      if (currHistory.type === "add") {
        // handle delete for firebase
        handleUndoAdd(currHistory).catch((err) => console.log(err));
      } else {
        saveUpdatedNodes(updatedNodesToSave).catch((err) => console.log(err));
      }
      setNodes(prevHistoryNodes);
      setHistoryIndex(prevIndex);
      updateRoom(updatedNodesToSave, "history");
    }
  }, [historyIndex, history, setNodes, setHistoryIndex, handleUndoAdd, saveUpdatedNodes, updateRoom]);

  const handleRedo = useCallback(() => {
    if (history.length - 1 > historyIndex) {
      const nextIndex: number = historyIndex + 1;
      const nextHistory = history[nextIndex];
      const nextHistoryNodes = new Map(history[nextIndex].nodes);
      const updatedNodesToSave = Array.from(nextHistoryNodes.values());

      if (nextHistory.type === "delete") {
        // handle delete for firebase
        handleRedoDelete(nextHistory).catch((err) => console.log(err));
      } else {
        saveUpdatedNodes(updatedNodesToSave).catch((err) => console.log(err));
      }
      setNodes(nextHistoryNodes);
      setHistoryIndex(nextIndex);
      updateRoom(updatedNodesToSave, "history");
    }
  }, [history, historyIndex, setNodes, setHistoryIndex, handleRedoDelete, saveUpdatedNodes, updateRoom]);

  const undoByShortcutKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "KeyZ" && (e.ctrlKey || e.metaKey)) {
        handleUndo();
      }
    },
    [handleUndo]
  );

  const redoByShortcutKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.code === "KeyY" && (e.ctrlKey || e.metaKey)) {
        handleRedo();
      }
    },
    [handleRedo]
  );

  const addToHistory = ({ type, diff, nodes: updatedNodes }: History) => {
    const newUpdatedNodes = new Map(updatedNodes);
    const newHistory = [...history];
    setHistory([
      ...newHistory,
      {
        type,
        diff,
        nodes: newUpdatedNodes,
      },
    ]);
    const len = history.length;
    setHistoryIndex(len);
  };

  return { addToHistory, undoByShortcutKey, redoByShortcutKey, handleUndo, handleRedo };
};

export default useHistory;
