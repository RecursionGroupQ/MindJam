import { deleteField, doc, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import { History, Node, RoomContext } from "../../context/RoomContext";
import { db } from "../../firebase/config";

const useSaveRoom = () => {
  const { roomId } = useContext(RoomContext);

  const saveUpdatedNodes = async (nodesToUpdate: Node[]) => {
    if (roomId) {
      const docRef = doc(db, "rooms", roomId);
      const payload: Record<string, Node> = {};
      nodesToUpdate.forEach((node) => {
        payload[`nodes.${node.id}`] = node;
      });
      await updateDoc(docRef, { ...payload });
    }
  };

  const saveDeletedNodes = async (nodesToUpdate: Node[], nodesToDelete: Node[]) => {
    if (roomId) {
      const docRef = doc(db, "rooms", roomId);
      const payload: Record<string, Node> = {};
      nodesToUpdate.forEach((node) => {
        payload[`nodes.${node.id}`] = node;
      });
      await updateDoc(docRef, { ...payload });
      nodesToDelete.map(async (node) => {
        await updateDoc(docRef, {
          [`nodes.${node.id}`]: deleteField(),
        });
      });
    }
  };

  const handleUndoAdd = (currHistory: History) => {
    if (roomId && currHistory.diff) {
      const docRef = doc(db, "rooms", roomId);
      currHistory.diff.map(async (nodeId) => {
        await updateDoc(docRef, {
          [`nodes.${nodeId}`]: deleteField(),
        });
      });
    }
  };

  const handleRedoDelete = (nextHistory: History) => {
    if (roomId && nextHistory.diff) {
      const docRef = doc(db, "rooms", roomId);
      nextHistory.diff.map(async (nodeId) => {
        await updateDoc(docRef, {
          [`nodes.${nodeId}`]: deleteField(),
        });
      });
    }
  };

  return { saveUpdatedNodes, saveDeletedNodes, handleUndoAdd, handleRedoDelete };
};

export default useSaveRoom;
