import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Card } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { RiMindMap } from "react-icons/ri";
import { AuthContext } from "../../context/AuthContext";
import RoomUsers from "./RoomUsers";
import UserMenu from "./UserMenu";
import { RoomContext } from "../../context/RoomContext";

const Header = () => {
  const { authState } = useContext(AuthContext);
  const { dark, roomName, roomId } = useContext(RoomContext);

  return (
    <header className="bg-transparent text-gray-600 body-font z-50">
      <div className="container mx-auto flex flex-wrap flex-col md:flex-row p-5 items-center justify-between">
        <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <span className="flex justify-center items-center w-10 h-10 text-white bg-indigo-500 rounded-full">
            <RiMindMap size={25} />
          </span>
          <span className={`ml-3 text-xl ${dark ? "text-white" : "text-black"}`}>MindJam</span>
        </Link>
        {roomName && (
          <div className="absolute top-10 left-1/2" style={{ transform: "translate(-50%, -50%)" }}>
            <motion.div
              initial={{ y: -800 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100, bounce: 0.2 }}
            >
              <Card className="py-1 px-6 font-bold" shadow>
                {roomName}
              </Card>
            </motion.div>
          </div>
        )}
        {authState.user && (
          <div className="flex items-center">
            {roomId && <RoomUsers />}
            <UserMenu />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
