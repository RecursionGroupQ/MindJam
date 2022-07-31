import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import RoomPage from "./pages/RoomPage";
import HomePage from "./pages/HomePage";
import { AuthContext } from "./context/AuthContext";
import DashboardPage from "./pages/DashboardPage";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { authState } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {authState.authIsReady && (
        <>
          <Header />
          <Routes>
            <Route path="/" element={!authState.user ? <HomePage /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={authState.user ? <DashboardPage /> : <Navigate to="/" />} />
            <Route path="/room/:id" element={authState.user ? <RoomPage /> : <Navigate to="/" />} />
          </Routes>
          <ToastContainer />
        </>
      )}
    </BrowserRouter>
  );
};

export default App;
