import { Avatar, Button, Card, CardBody, CardFooter } from "@material-tailwind/react";
import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { RoomContext } from "../../context/RoomContext";
import Modal from "../Modal";

const RoomUsers = () => {
  const { roomUsers, roomId } = useContext(RoomContext);
  const [shareModalIsOpen, setShareModalIsOpen] = useState(false);

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

  const handleShareModalOpen = () => {
    setShareModalIsOpen(!shareModalIsOpen);
  };

  return (
    <div>
      {roomUsers && (
        <motion.div initial="hidden" animate="visible" variants={list} className="flex items-center pr-4 border-r-2">
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
                className="pr-1"
              >
                <Avatar
                  variant="circular"
                  size="sm"
                  src={currUser.photoURL || ""}
                  className="outline ml-2"
                  style={{ outlineColor: `${currUser.color}` }}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            );
          })}
          <Button onClick={handleShareModalOpen} color="green" className="ml-2" size="sm">
            share
          </Button>
        </motion.div>
      )}
      <Modal modalIsOpen={shareModalIsOpen}>
        <Card shadow>
          <form>
            <CardBody className="w-96">
              <label htmlFor="roomId" className="block pb-1 mb-2 text-sm text-gray-900 font-bold">
                Share with room key...
                <input
                  id="roomId"
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={roomId}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                />
              </label>
              <label htmlFor="roomURL" className="block pb-1 mb-2 text-sm text-gray-900 font-bold">
                Share with room URL...
                <input
                  id="roomURL"
                  readOnly
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={roomId && `${process.env.REACT_APP_CLIENT_HOST || "http://localhost:3000"}/room/${roomId}`}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                />
              </label>
            </CardBody>
            <CardFooter className="flex justify-center !pt-0">
              <Button fullWidth className="mx-3" color="blue-grey" onClick={handleShareModalOpen}>
                Exit
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Modal>
    </div>
  );
};

export default RoomUsers;
