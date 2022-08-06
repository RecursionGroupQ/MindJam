import { Timestamp } from "firebase/firestore";
import { Node } from "../../context/RoomContext";

type Roles = "owner" | "editor";

export type RoomsDocument = {
  projectName: string;
  nodes: Record<string, Node>;
  roles: Record<string, { uid: string; name: string | null; role: Roles }>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type UserRoom = {
  projectName: string;
  roomId: string;
  ownerName: string | null;
  role: Roles;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
