import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";

import App from "./App";
import { RoomContextProvider } from "./context/RoomContext";
import { AuthContextProvider } from "./context/AuthContext";
import { SocketContextProvider } from "./context/SocketContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <RoomContextProvider>
        <SocketContextProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </SocketContextProvider>
      </RoomContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
