import { uuidv4 } from "@firebase/util";
import { setDoc, Timestamp, doc } from "firebase/firestore";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { Node } from "../../context/RoomContext";
import { db } from "../../firebase/config";
import { RoomsDocument } from "../../firebase/types";

const defaultNodes: Record<string, Node> = {
  qUU5rH4yXyiPxoNwYGGO5: {
    id: "qUU5rH4yXyiPxoNwYGGO5",
    children: [],
    parents: [],
    text: '{"blocks":[{"key":"8dgss","text":"DATA LOADED!","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    shapeType: "ellipse",
    x: 1144.5321003906242,
    y: 540.4168546874994,
    width: 357.9551366477262,
    height: 177.6603915296051,
    fillStyle: "#ffffff",
    strokeStyle: "#000000",
  },
};

const useCreateRoom = () => {
  const { authState } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const createRoom = async (projectName: string) => {
    console.log("create room");
    try {
      setIsLoading(true);
      const roomId = uuidv4();
      if (authState.user) {
        const payload: RoomsDocument = {
          projectName,
          nodes: defaultNodes,
          roles: { [authState.user.uid]: { uid: authState.user.uid, name: authState.user.displayName, role: "owner" } },
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        const docRef = doc(db, "rooms", roomId);
        await setDoc(docRef, payload);
      }
      navigate(`/room/${roomId}`);
      toast.success("new room created!");
      setIsLoading(false);
    } catch (error) {
      toast.error((error as Error).message);
      setIsLoading(false);
    }
  };

  return { createRoom, isLoading };
};

export default useCreateRoom;
