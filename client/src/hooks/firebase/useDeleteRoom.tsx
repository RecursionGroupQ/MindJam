import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

const useDeleteRoom = () => {
  const deleteRoom = async (roomId: string) => {
    const docRef = doc(db, "rooms", roomId);
    await deleteDoc(docRef);
  };
  return { deleteRoom };
};

export default useDeleteRoom;
