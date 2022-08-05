import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { RoomsDocument, UserRoom } from "../../firebase/types";

const useGetRooms = () => {
  const { authState } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [userRooms, setUserRooms] = useState<UserRoom[]>([]);

  useEffect(() => {
    const uid = authState.user?.uid;
    if (!uid) throw new Error("uid undefined");
    const collectionRef = collection(db, "rooms");
    const q = query(collectionRef, where(`roles.${uid}.uid`, "==", uid));

    const unsubcribe = onSnapshot(
      q,
      (snapshot) => {
        const res: UserRoom[] = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data() as RoomsDocument;
          res.push({
            projectName: data.projectName,
            roomId: doc.id,
            role: data.roles[uid].role,
            name: data.roles[uid].name,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          } as UserRoom);
        });
        // アップデート日でソート
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
      },
      (err) => {
        toast.error((err as Error).message);
      }
    );

    return unsubcribe;
  }, [authState.user]);

  return { userRooms, isLoading, setUserRooms };
};

export default useGetRooms;
