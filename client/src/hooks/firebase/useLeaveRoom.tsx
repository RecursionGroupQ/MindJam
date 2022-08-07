import { useContext } from "react";
import { getDoc, updateDoc, doc, deleteField } from "firebase/firestore";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { RoomsDocument } from "../../firebase/types";
import { db } from "../../firebase/config";

const useLeaveRoom = () => {
  const { authState } = useContext(AuthContext);

  const leaveRoom = async (roomId: string) => {
    try {
      const uid = authState.user?.uid;
      if (!uid) throw new Error("uid undefined");
      const docRef = doc(db, "rooms", roomId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("room does not exist :(");

      const data = docSnap.data() as RoomsDocument;

      if (Object.values(data.roles).some((user) => user.uid === uid)) {
        await updateDoc(docRef, {
          [`roles.${uid}`]: deleteField(),
        });
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return { leaveRoom };
};

export default useLeaveRoom;
