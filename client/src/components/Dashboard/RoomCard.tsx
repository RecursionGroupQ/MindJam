/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Menu,
  MenuHandler,
  MenuItem,
  Button,
  MenuList,
} from "@material-tailwind/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserRoom } from "../../firebase/types";
import useDeleteRoom from "../../hooks/firebase/useDeleteRoom";
import useLeaveRoom from "../../hooks/firebase/useLeaveRoom";
import Modal from "../Modal";

type Props = {
  doc: UserRoom;
};

const RoomCard: React.FC<Props> = ({ doc }) => {
  const navigate = useNavigate();
  const { deleteRoom } = useDeleteRoom();
  const { leaveRoom } = useLeaveRoom();
  const [deleteConfirmModalIsOpen, setDeleteConfirmModalIsOpen] = useState(false);
  const [leaveConfirmModalIsOpen, setLeaveConfirmModalIsOpen] = useState(false);

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deleteRoom(doc.roomId).catch((err) => toast.error((err as Error).message));
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    leaveRoom(doc.roomId).catch((err) => toast.error((err as Error).message));
  };

  const handleClick = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  const handleDeleteConfirmModalIsOpen = () => {
    setDeleteConfirmModalIsOpen(!deleteConfirmModalIsOpen);
  };

  const handleLeaveConfirmModalIsOpen = () => {
    setLeaveConfirmModalIsOpen(!leaveConfirmModalIsOpen);
  };

  const item = {
    visible: { opacity: 1, x: 0 },
    hidden: { opacity: 0, x: -100 },
  };

  return (
    <>
      <motion.div
        key={doc.roomId}
        variants={item}
        whileHover={{
          cursor: "pointer",
          scale: 1.05,
          transition: { duration: 0.3 },
        }}
      >
        <Card shadow className="w-96 m-4">
          <div className="flex justify-end p-2">
            <Menu>
              <MenuHandler>
                <Button size="sm" color="blue-grey">
                  <BsThreeDotsVertical />
                </Button>
              </MenuHandler>
              <MenuList className="!min-w-[50px]">
                {doc.role === "owner" ? (
                  <MenuItem className="flex justify-between items-center" onClick={handleDeleteConfirmModalIsOpen}>
                    Delete <FaTrash className="ml-2" />
                  </MenuItem>
                ) : (
                  <MenuItem className="flex justify-between items-center" onClick={handleLeaveConfirmModalIsOpen}>
                    Leave <FiLogOut className="ml-2" />
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleClick(doc.roomId);
            }}
            role="presentation"
          >
            <CardBody className="text-center !pt-2">
              <Typography variant="h4" className="text-center">
                {doc.projectName}
              </Typography>
            </CardBody>
            <CardFooter divider className="flex items-center justify-between !px-6 !py-1">
              <div className="flex flex-col">
                <Typography variant="small">
                  <span className="font-bold">last updated:</span> {doc.updatedAt.toDate().toDateString()}
                </Typography>
                <Typography variant="small">
                  <span className="font-bold">created:</span> {doc.createdAt.toDate().toDateString()}
                </Typography>
                <Typography variant="small">
                  <span className="font-bold">owner:</span> {doc.role === "owner" ? "You" : doc.ownerName}
                </Typography>
              </div>
              {doc.role === "owner" ? (
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                  {doc.role}
                </span>
              ) : (
                <span className="bg-pink-100 text-pink-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-pink-200 dark:text-pink-900">
                  {doc.role}
                </span>
              )}
            </CardFooter>
          </div>
        </Card>
      </motion.div>
      <Modal modalIsOpen={deleteConfirmModalIsOpen}>
        <Card shadow>
          <form onSubmit={handleDeleteSubmit}>
            <CardBody className="text-center w-96">Are you sure you want to delete?</CardBody>
            <CardFooter className="flex justify-between !pt-1">
              <Button fullWidth className="mx-3" color="blue-grey" onClick={handleDeleteConfirmModalIsOpen}>
                Cancel
              </Button>
              <Button fullWidth type="submit" className="mx-3" color="red">
                Delete
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Modal>
      <Modal modalIsOpen={leaveConfirmModalIsOpen}>
        <Card shadow>
          <form onSubmit={handleLeaveSubmit}>
            <CardBody className="text-center w-96">Are you sure you want to leave?</CardBody>
            <CardFooter className="flex justify-between !pt-1">
              <Button fullWidth className="mx-3" color="blue-grey" onClick={handleLeaveConfirmModalIsOpen}>
                Cancel
              </Button>
              <Button fullWidth type="submit" className="mx-3" color="red">
                Leave
              </Button>
            </CardFooter>
          </form>
        </Card>
      </Modal>
    </>
  );
};

export default RoomCard;
