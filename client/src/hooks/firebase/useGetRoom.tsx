import { getDoc, doc } from "firebase/firestore";
import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Node, RoomContext } from "../../context/RoomContext";
import { db } from "../../firebase/config";
import { RoomsDocument } from "../../firebase/types";

const useGetRoom = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { setNodes, setHistory, setHistoryIndex, setRoomName } = useContext(RoomContext);
  const navigate = useNavigate();

  const getRoom = useCallback(
    async (roomId: string) => {
      try {
        const docRef = doc(db, "rooms", roomId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) throw new Error("room does not exist :(");

        const data = docSnap.data() as RoomsDocument;
        const nodesData = Object.values(data.nodes);

        if (nodesData) {
          const nodesMap: Map<string, Node> = new Map();
          nodesData.forEach((node) => {
            nodesMap.set(node.id, node);
          });
          setNodes(new Map(nodesMap));
          setHistory([
            {
              type: "update",
              diff: null,
              nodes: new Map(nodesMap),
            },
          ]);
          setHistoryIndex(0);
        }
        setIsLoading(false);
        setRoomName(data.projectName);
      } catch (error) {
        navigate("/dashboard");
        toast.error((error as Error).message);
        setIsLoading(false);
      }
    },
    [setNodes, setHistory, navigate, setHistoryIndex, setRoomName]
  );

  return { getRoom, isLoading };
};

export default useGetRoom;
