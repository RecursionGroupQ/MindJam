import React, { useState } from "react";
import { Button, Input, Card, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { BsThreeDotsVertical } from "react-icons/bs";
import { motion } from "framer-motion";
import useCreateRoom from "../hooks/firebase/useCreateRoom";
import useGetRooms from "../hooks/firebase/useGetRooms";
import Modal from "../components/Modal";

const DashboardPage = () => {
  const { createRoom, isLoading: createRoomIsLoading } = useCreateRoom();
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [joinModalIsOpen, setJoinModalIsOpen] = useState(false);
  const [projectName, setProjectName] = useState<string>("");
  const [joinRoomId, setJoinRoomId] = useState<string>("");
  const { userRooms, isLoading: userRoomsIsLoading } = useGetRooms();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRoom(projectName).catch((err) => toast.error((err as Error).message));
  };

  const handleJoinRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/room/${joinRoomId}`);
  };

  const handleCreateModalOpen = () => {
    setJoinModalIsOpen(false);
    setCreateModalIsOpen(!createModalIsOpen);
  };

  const handleJoinModalOpen = () => {
    setCreateModalIsOpen(false);
    setJoinModalIsOpen(!joinModalIsOpen);
  };

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
              className="my-4 w-96 flex justify-center"
              initial={{ y: -200 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100, bounce: 0.2 }}
            >
              <Button fullWidth className="mx-4" color="green" onClick={handleCreateModalOpen}>
                Create Project
              </Button>
              <Button fullWidth className="mx-4" color="blue-grey" onClick={handleJoinModalOpen}>
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
                      <div className="flex justify-end p-2">{doc.role === "owner" && <BsThreeDotsVertical />}</div>
                      <CardBody className="text-center !pt-2">
                        <Typography variant="h4" className="text-center">
                          {doc.projectName}
                        </Typography>
                      </CardBody>
                      <CardFooter divider className="flex items-center justify-between !px-6 !py-1">
                        <div className="flex flex-col">
                          <Typography variant="small">
                            <span className="font-bold">last modified:</span> {doc.updatedAt.toDate().toDateString()}
                          </Typography>
                          <Typography variant="small">
                            <span className="font-bold">created:</span> {doc.createdAt.toDate().toDateString()}
                          </Typography>
                          {doc.role !== "owner" && (
                            <Typography variant="small">
                              <span className="font-bold">owner:</span> {doc.ownerName}
                            </Typography>
                          )}
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
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
          <Modal modalIsOpen={createModalIsOpen}>
            <Card shadow>
              <form onSubmit={handleSubmit}>
                <CardBody className="w-96">
                  <Input
                    label="Name your project..."
                    required
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </CardBody>
                <CardFooter className="flex justify-between !pt-1">
                  <Button fullWidth className="mx-3" color="blue-grey" onClick={handleCreateModalOpen}>
                    Cancel
                  </Button>
                  <Button fullWidth type="submit" className="mx-3" color="green" disabled={createRoomIsLoading}>
                    Create
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </Modal>
          <Modal modalIsOpen={joinModalIsOpen}>
            <Card shadow>
              <form onSubmit={handleJoinRoomSubmit}>
                <CardBody className="w-96">
                  <Input
                    label="Enter room key..."
                    required
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                  />
                </CardBody>
                <CardFooter className="flex justify-between !pt-1">
                  <Button fullWidth className="mx-3" color="blue-grey" onClick={handleJoinModalOpen}>
                    Cancel
                  </Button>
                  <Button fullWidth type="submit" className="mx-3" color="green">
                    Join
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </Modal>
        </>
      )}
    </>
  );
};

export default DashboardPage;
