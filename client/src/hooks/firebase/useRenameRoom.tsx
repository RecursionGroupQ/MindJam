import { useContext } from "react";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";
import { RoomsDocument } from "../../firebase/types";
import { db } from "../../firebase/config";

const useRenameRoom = () => {
  const { authState } = useContext(AuthContext);

  const renameRoom = async (roomId: string, newProjectName: string) => {
    try {
      const uid = authState.user?.uid;
      if (!uid) throw new Error("uid undefined");
      const docRef = doc(db, "rooms", roomId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("room does not exist :(");

      const data = docSnap.data() as RoomsDocument;

      if (data.roles[uid].role === "owner") {
        await updateDoc(docRef, { projectName: newProjectName });
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  return { renameRoom };
};

export default useRenameRoom;
