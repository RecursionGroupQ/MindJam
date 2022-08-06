import React, { useContext } from "react";
import { Menu, MenuHandler, MenuList, MenuItem, Avatar } from "@material-tailwind/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { RoomContext } from "../../context/RoomContext";
import useLogout from "../../hooks/useLogout";

const UserMenu = () => {
  const { authState } = useContext(AuthContext);
  const { dark, setDark, setStageStyle } = useContext(RoomContext);
  const { logout } = useLogout();

  const handleDarkMode = () => {
    if (!dark) {
      setStageStyle((prevState) => ({
        ...prevState,
        backgroundColor: "#1E293B",
        backgroundImage: "radial-gradient(#bdc3cc 1.1px, #1E293B 1.1px)",
      }));
      setDark(true);
    } else {
      setStageStyle((prevState) => ({
        ...prevState,
        backgroundColor: "#e2e8f0",
        backgroundImage: "radial-gradient(#6b7280 1.1px, #e2e8f0 1.1px)",
      }));
      setDark(false);
    }
  };

  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <div className="pl-5">
          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
          >
            <Avatar
              size="sm"
              variant="circular"
              className={`cursor-pointer outline ${dark ? "outline-white" : "outline-blue-grey-700"}`}
              src={authState.user?.photoURL || ""}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </MenuHandler>
      <MenuList className="!min-w-[50px]">
        <MenuItem onClick={handleDarkMode}>
          {dark ? (
            <div className="flex justify-between items-center">
              Light
              <FaSun className="pl-2" size={20} />
            </div>
          ) : (
            <div className="flex justify-between items-center">
              Dark
              <FaMoon className="pl-2" size={20} />
            </div>
          )}
        </MenuItem>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <MenuItem onClick={() => logout()} className="flex justify-between items-center">
          Logout
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
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserMenu;
