import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const HomePage = () => {
  const { authState } = useContext(AuthContext);

  return (
    <div>
      {authState?.user?.displayName}
      <img src={authState?.user?.photoURL as string} alt="" />
    </div>
  );
};

export default HomePage;
