import React, { useCallback, useEffect, useState } from "react";
import { Button, Input, Card, CardBody, CardFooter, Select, Option } from "@material-tailwind/react";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import { motion } from "framer-motion";
import useCreateRoom from "../hooks/firebase/useCreateRoom";
import useGetRooms from "../hooks/firebase/useGetRooms";
import { UserRoom } from "../firebase/types";
import Modal from "../components/Modal";
import RoomCard from "../components/Dashboard/RoomCard";

const DashboardPage = () => {
  const { createRoom, isLoading: createRoomIsLoading } = useCreateRoom();
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [joinModalIsOpen, setJoinModalIsOpen] = useState(false);
  const [projectName, setProjectName] = useState<string>("");
  const { userRooms, getRooms, setUserRooms, isLoading: userRoomsIsLoading } = useGetRooms();
  const [filteredRooms, setFilteredRooms] = useState<UserRoom[] | null>(null);
  const [selectedSortValue, setSelectedSortValue] = useState<string>("");
  const [isAscendingOrder, setIsAscendingOder] = useState<boolean>(true);
  const [joinRoomId, setJoinRoomId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    getRooms().catch((err) => toast.error((err as Error).message));
  }, [getRooms]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRoom(projectName).catch((err) => toast.error((err as Error).message));
  };

  const handleJoinRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/room/${joinRoomId}`);
  };

  const handleCreateModalOpen = () => {
    if (userRooms.filter((room) => room.role === "owner").length >= 9) {
      toast.info("You have reached the maximum projects that can be created");
      return;
    }
    setJoinModalIsOpen(false);
    setCreateModalIsOpen(!createModalIsOpen);
  };

  const handleJoinModalOpen = () => {
    setCreateModalIsOpen(false);
    setJoinModalIsOpen(!joinModalIsOpen);
  };

  // Project名でソート
  const sortProjectName = (rooms: UserRoom[], isAscOrder: boolean) => {
    const newUserRooms = [...rooms];
    if (isAscOrder) {
      newUserRooms.sort((a, b) => {
        if (a.projectName.toLocaleLowerCase() > b.projectName.toLocaleLowerCase()) {
          return 1;
        }
        if (a.projectName.toLocaleLowerCase() < b.projectName.toLocaleLowerCase()) {
          return -1;
        }
        return 0;
      });
      return newUserRooms;
    }
    newUserRooms.sort((a, b) => {
      if (a.projectName.toLocaleLowerCase() < b.projectName.toLocaleLowerCase()) {
        return 1;
      }
      if (a.projectName.toLocaleLowerCase() > b.projectName.toLocaleLowerCase()) {
        return -1;
      }
      return 0;
    });
    return newUserRooms;
  };

  // 作成日でソート
  const sortCreatedAt = (rooms: UserRoom[], isAscOrder: boolean) => {
    const newUserRooms = [...rooms];
    if (isAscOrder) {
      newUserRooms.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return 1;
        }
        if (a.createdAt < b.createdAt) {
          return -1;
        }
        return 0;
      });
      return newUserRooms;
    }
    newUserRooms.sort((a, b) => {
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      return 0;
    });
    return newUserRooms;
  };

  // 作成日でソート
  const sortUpdatedAt = (rooms: UserRoom[], isAscOrder: boolean) => {
    const newUserRooms = [...rooms];
    if (isAscOrder) {
      newUserRooms.sort((a, b) => {
        if (a.updatedAt > b.updatedAt) {
          return 1;
        }
        if (a.updatedAt < b.updatedAt) {
          return -1;
        }
        return 0;
      });
      return newUserRooms;
    }
    newUserRooms.sort((a, b) => {
      if (a.updatedAt < b.updatedAt) {
        return 1;
      }
      if (a.updatedAt > b.updatedAt) {
        return -1;
      }
      return 0;
    });
    return newUserRooms;
  };

  const filterRooms = useCallback(
    (value: "MyProjects" | "JoinedProjects") => {
      let newUserRooms: UserRoom[] = [];
      if (value === "MyProjects") {
        newUserRooms = userRooms.filter((room) => room.role === "owner");
      }
      if (value === "JoinedProjects") {
        newUserRooms = userRooms.filter((room) => room.role === "editor");
      }
      return newUserRooms;
    },
    [userRooms]
  );

  const sortProject = useCallback(
    (value: string, isAscending: boolean) => {
      if (value === "ProjectName") {
        setFilteredRooms(null);
        setUserRooms((prevState) => sortProjectName(prevState, isAscending));
      }
      if (value === "CreatedDate") {
        setFilteredRooms(null);
        setUserRooms((prevState) => sortCreatedAt(prevState, isAscending));
      }
      if (value === "UpdatedDate") {
        setFilteredRooms(null);
        setUserRooms((prevState) => sortUpdatedAt(prevState, isAscending));
      }
    },
    [setUserRooms]
  );

  const handleChange = (value: React.ReactNode) => {
    setSelectedSortValue(value as string);
    sortProject(value as string, isAscendingOrder);
  };

  useEffect(() => {
    if (selectedSortValue === "MyProjects" || selectedSortValue === "JoinedProjects") {
      setFilteredRooms(filterRooms(selectedSortValue));
    }
  }, [filterRooms, selectedSortValue, userRooms]);

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
              className="my-4 w-96 flex"
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
            <motion.div
              className="my-4 flex justify-end"
              initial={{ y: -200 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100, bounce: 0.2 }}
            >
              <div className="flex w-72 mx-4">
                <Select
                  label="Sort Projects"
                  value={selectedSortValue}
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                  onChange={handleChange}
                >
                  <Option value="ProjectName">Project Name</Option>
                  <Option value="UpdatedDate">Updated Date</Option>
                  <Option value="CreatedDate">Created Date</Option>
                  <Option value="MyProjects">My Projects</Option>
                  <Option value="JoinedProjects">Joined Projects</Option>
                </Select>
                <Button
                  variant="outlined"
                  color="grey"
                  size="sm"
                  disabled={
                    selectedSortValue === "" ||
                    selectedSortValue === "MyProjects" ||
                    selectedSortValue === "JoinedProjects"
                  }
                  onClick={() =>
                    setIsAscendingOder((prevState) => {
                      sortProject(selectedSortValue, !prevState);
                      return !prevState;
                    })
                  }
                >
                  {isAscendingOrder ? <HiSortAscending size={20} /> : <HiSortDescending size={20} />}
                </Button>
              </div>
            </motion.div>
            {userRooms && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={list}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
              >
                {!filteredRooms
                  ? userRooms.map((doc) => <RoomCard setUserRooms={setUserRooms} key={doc.roomId} doc={doc} />)
                  : filteredRooms.map((doc) => <RoomCard setUserRooms={setUserRooms} key={doc.roomId} doc={doc} />)}
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
