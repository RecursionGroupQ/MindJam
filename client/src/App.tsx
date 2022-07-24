import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import RoomPage from "./pages/RoomPage";
import HomePage from "./pages/HomePage";
import { AuthContext } from "./context/AuthContext";

const App = () => {
  const { authState } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {authState.authIsReady && (
        <>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/room" element={<RoomPage />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
};

export default App;
