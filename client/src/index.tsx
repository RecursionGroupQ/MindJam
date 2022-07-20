import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";

import App from "./App";
import { RoomContextProvider } from "./context/RoomContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <RoomContextProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </RoomContextProvider>
  </React.StrictMode>
);
