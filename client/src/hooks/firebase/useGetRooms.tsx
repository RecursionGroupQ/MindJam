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
        res.sort((a, b) => b.updatedAt.toDate().getTime() - a.updatedAt.toDate().getTime());
        setUserRooms(res);
        setIsLoading(false);
      },
      (err) => {
        toast.error((err as Error).message);
      }
    );

    return unsubcribe;
  }, [authState.user]);

  return { userRooms, isLoading };
};

export default useGetRooms;
