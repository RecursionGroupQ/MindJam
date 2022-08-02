import { Avatar } from "@material-tailwind/react";
import React, { useContext } from "react";
import { motion } from "framer-motion";
import { RoomContext } from "../../context/RoomContext";

const RoomUsers = () => {
  const { roomUsers } = useContext(RoomContext);

  const list = {
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };

  const item = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: 300 },
  };

  return (
    <div>
      {roomUsers && (
        <motion.div initial="hidden" animate="visible" variants={list} className="flex pr-4 border-r-2">
          {Array.from(roomUsers.keys()).map((key) => {
            const currUser = roomUsers.get(key);
            if (!currUser) return null;
            return (
              <motion.div
                key={key}
                variants={item}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
                className="px-1"
              >
                <Avatar
                  variant="circular"
                  size="sm"
                  src={currUser.photoURL || ""}
                  className="outline"
                  style={{ outlineColor: `${currUser.color}` }}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default RoomUsers;
