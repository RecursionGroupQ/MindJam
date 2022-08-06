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
  um1E66ra5rgDx0Evi6ICG: {
    id: "um1E66ra5rgDx0Evi6ICG",
    parents: [],
    x: 1437.4999999999982,
    strokeStyle: "#000",
    height: 132.82849502281758,
    y: 391.25000000000034,
    shapeType: "rect",
    children: [
      {
        id: "-AT-kH8pJ6X_E0fMx7VAP",
        color: "#000",
      },
    ],
    width: 379.9999999999999,
    text: '{"blocks":[{"key":"e3jkh","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2fe8h","text":"CLICK ON 2 DIFFERENT NODES TO CONNECT","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":37,"style":"fontsize-30"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
    fillStyle: "#eab308",
  },
  "-AT-kH8pJ6X_E0fMx7VAP": {
    text: '{"blocks":[{"key":"bpja8","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"2qi06","text":"DOUBLE CLICK TO ADD A NODE","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":26,"style":"fontsize-30"}],"entityRanges":[],"data":{}}],"entityMap":{}}',
    fillStyle: "#fff",
    height: 188.2165438513168,
    id: "-AT-kH8pJ6X_E0fMx7VAP",
    strokeStyle: "#000",
    children: [
      {
        id: "C6ntU1q9WMKosAXfncIix",
        color: "#000",
      },
    ],
    parents: ["um1E66ra5rgDx0Evi6ICG"],
    width: 379.9999999999996,
    y: 542.5000000000007,
    shapeType: "ellipse",
    x: 786.2499999999994,
  },
  C6ntU1q9WMKosAXfncIix: {
    strokeStyle: "#000",
    text: '{"blocks":[{"key":"8q3o9","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"l71t","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"c0100","text":"DOUBLE CLICK TO EDIT TEXT","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":0,"length":25,"style":"fontsize-30"}],"entityRanges":[],"data":{}},{"key":"ee6k6","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"8b3bs","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
    x: 1443.7452240876473,
    shapeType: "polygon",
    children: [],
    parents: ["-AT-kH8pJ6X_E0fMx7VAP"],
    height: 70.07571063808189,
    width: 295.87522269412295,
    y: 724.9952240876419,
    id: "C6ntU1q9WMKosAXfncIix",
    fillStyle: "#84cc16",
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
