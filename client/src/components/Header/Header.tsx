import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "@material-tailwind/react";
import { motion } from "framer-motion";
import useLogin from "../../hooks/useLogin";
import { AuthContext } from "../../context/AuthContext";
import RoomUsers from "./RoomUsers";
import UserMenu from "./UserMenu";
import { RoomContext } from "../../context/RoomContext";

const Header = () => {
  const { authState } = useContext(AuthContext);
  const { dark, roomName } = useContext(RoomContext);
  const { googleLogin } = useLogin();

  return (
    <header className="bg-transparent text-gray-600 body-font z-50">
      <div className="container mx-auto flex flex-wrap flex-col md:flex-row p-5 items-center justify-between">
        <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className={`ml-3 text-xl ${dark ? "text-white" : "text-black"}`}>Mindmap</span>
        </Link>
        {roomName && (
          <motion.div
            initial={{ y: -800 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100, bounce: 0.2 }}
          >
            <Card className="py-1 px-2" shadow>
              <strong>{roomName}</strong>
            </Card>
          </motion.div>
        )}
        {!authState.user ? (
          <Button
            type="button"
            className="flex"
            size="sm"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={googleLogin}
          >
            login
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
        ) : (
          <div className="flex items-center">
            <RoomUsers />
            <UserMenu />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
