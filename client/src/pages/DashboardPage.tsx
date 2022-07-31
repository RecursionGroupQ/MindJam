import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Input,
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { BsThreeDotsVertical } from "react-icons/bs";
import { motion } from "framer-motion";
import useCreateRoom from "../hooks/firebase/useCreateRoom";
import useGetRooms from "../hooks/firebase/useGetRooms";

const DashboardPage = () => {
  const { createRoom, isLoading: createRoomIsLoading } = useCreateRoom();
  const [openDialog, setOpenDialog] = useState(false);
  const [projectName, setProjectName] = useState<string>("");
  const { userRooms, isLoading: userRoomsIsLoading } = useGetRooms();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRoom(projectName).catch((err) => toast.error((err as Error).message));
  };

  const handleOpen = () => setOpenDialog(!openDialog);

  const handleClick = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

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
    hidden: { opacity: 0, x: -100 },
  };

  return (
    <>
      {userRoomsIsLoading && (
        <div className="absolute top-1/2 left-1/2" style={{ transform: "translate(-50%, -50%)" }}>
          <Oval color="#6366f1" secondaryColor="#fff" width={50} height={50} />
        </div>
      )}
      {!userRoomsIsLoading && (
        <>
          <div className="w-screen flex flex-col items-center justify-center">
            <motion.div
              className="my-4"
              initial={{ y: -200 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100, bounce: 0.2 }}
            >
              <Button className="mx-4" color="green" onClick={handleOpen}>
                Create Project
              </Button>
              <Button className="mx-4" color="grey">
                Join Project
              </Button>
            </motion.div>
            {userRooms && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={list}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              >
                {userRooms.map((doc) => (
                  <motion.div
                    key={doc.roomId}
                    variants={item}
                    whileHover={{
                      cursor: "pointer",
                      scale: 1.05,
                      transition: { duration: 0.3 },
                    }}
                    onClick={() => handleClick(doc.roomId)}
                  >
                    <Card shadow className="w-96 m-4">
                      <BsThreeDotsVertical className="relative" />
                      <CardBody className="text-center">
                        <Typography variant="h4" className="text-center">
                          {doc.projectName}
                        </Typography>
                      </CardBody>
                      <CardFooter divider className="flex items-center justify-between !px-6 !py-1">
                        <Typography variant="small">{doc.createdAt.toDate().toUTCString()}</Typography>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                          {doc.role}
                        </span>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
          <Dialog open={openDialog} handler={handleOpen}>
            <form onSubmit={handleSubmit}>
              <DialogBody divider>
                <Input
                  label="name your project"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </DialogBody>
              <DialogFooter>
                <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
                  <span>Cancel</span>
                </Button>
                <Button type="submit" variant="gradient" color="green" disabled={createRoomIsLoading}>
                  <span>Create Room</span>
                </Button>
              </DialogFooter>
            </form>
          </Dialog>
        </>
      )}
    </>
  );
};

export default DashboardPage;
