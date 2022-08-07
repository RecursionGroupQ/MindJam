import React, { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header/Header";
import RoomPage from "./pages/RoomPage";
import HomePage from "./pages/HomePage";
import { AuthContext } from "./context/AuthContext";
import DashboardPage from "./pages/DashboardPage";
import "react-toastify/dist/ReactToastify.css";
import { RoomContext } from "./context/RoomContext";

const App = () => {
  const { authState } = useContext(AuthContext);
  const { dark } = useContext(RoomContext);

  useEffect(() => {
    if (dark) {
      document.body.className = "bg-blue-grey-600";
    } else {
      document.body.className = "bg-blue-grey-50";
    }
  }, [dark]);

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
