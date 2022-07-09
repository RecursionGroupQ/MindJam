import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import RoomPage from "./pages/RoomPage";
import HomePage from "./pages/HomePage";

const App = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/room" element={<RoomPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
