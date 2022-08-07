import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useContext, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { RoomsDocument, UserRoom } from "../../firebase/types";

const useGetRooms = () => {
  const { authState } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [userRooms, setUserRooms] = useState<UserRoom[]>([]);

  const getRooms = useCallback(async () => {
    try {
      const uid = authState.user?.uid;
      if (!uid) throw new Error("uid undefined");
      const collectionRef = collection(db, "rooms");
      const q = query(collectionRef, where(`roles.${uid}.uid`, "==", uid));
      const snapshot = await getDocs(q);

      const res: UserRoom[] = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data() as RoomsDocument;
        const ownerUser = Object.values(data.roles).filter((user) => user.role === "owner")[0];
        res.push({
          projectName: data.projectName,
          roomId: doc.id,
          ownerName: ownerUser.name,
          role: data.roles[uid].role,
          name: data.roles[uid].name,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        } as UserRoom);
      });
      res.sort((a, b) => {
        if (a.updatedAt < b.updatedAt) {
          return 1;
        }
        if (a.updatedAt > b.updatedAt) {
          return -1;
        }
        return 0;
      });
      setUserRooms(res);
      setIsLoading(false);
    } catch (error) {
      toast.error((error as Error).message);
      setIsLoading(false);
    }
  }, [authState.user]);

  return { getRooms, userRooms, isLoading, setUserRooms };
};

export default useGetRooms;
