import { deleteField, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import { toast } from "react-toastify";
import { History, Node, RoomContext } from "../../context/RoomContext";
import { db } from "../../firebase/config";

const useSaveRoom = () => {
  const { roomId } = useContext(RoomContext);

  const saveUpdatedNodes = async (nodesToUpdate: Node[]) => {
    try {
      if (roomId) {
        const docRef = doc(db, "rooms", roomId);
        const payload: Record<string, Node> = {};
        nodesToUpdate.forEach((node) => {
          payload[`nodes.${node.id}`] = node;
        });
        await updateDoc(docRef, { ...payload });
        await updateDoc(docRef, {
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      toast.error("room no longer exists :(");
    }
  };

  const saveDeletedNodes = async (nodesToUpdate: Node[], nodesToDelete: Node[]) => {
    try {
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
        await updateDoc(docRef, {
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      toast.error("room no longer exists :(");
    }
  };

  const handleUndoAdd = async (currHistory: History) => {
    try {
      if (roomId && currHistory.diff) {
        const docRef = doc(db, "rooms", roomId);
        currHistory.diff.map(async (nodeId) => {
          await updateDoc(docRef, {
            [`nodes.${nodeId}`]: deleteField(),
          });
        });
        await updateDoc(docRef, {
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      toast.error("room no longer exists :(");
    }
  };

  const handleRedoDelete = async (nextHistory: History) => {
    try {
      if (roomId && nextHistory.diff) {
        const docRef = doc(db, "rooms", roomId);
        nextHistory.diff.map(async (nodeId) => {
          await updateDoc(docRef, {
            [`nodes.${nodeId}`]: deleteField(),
          });
        });
        await updateDoc(docRef, {
          updatedAt: Timestamp.now(),
        });
      }
    } catch (error) {
      toast.error("room no longer exists :(");
    }
  };

  return { saveUpdatedNodes, saveDeletedNodes, handleUndoAdd, handleRedoDelete };
};

export default useSaveRoom;
