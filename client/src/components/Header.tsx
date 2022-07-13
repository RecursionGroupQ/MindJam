import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { RoomContext } from "../context/RoomContext";

const Header = () => {
  const { setStageStyle } = useContext(RoomContext);
  const [dark, setDark] = useState(false);
  return (
    <header className="bg-transparent text-gray-600 body-font z-50">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="ml-3 text-xl">Mindmap</span>
        </Link>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center text-base justify-center">
          <Link to="/" className="mr-5 hover:text-gray-900">
            Home
          </Link>
          <Link to="/room" className="mr-5 hover:text-gray-900">
            Room
          </Link>
        </nav>
        <FontAwesomeIcon
          className="px-5 cursor-pointer"
          icon={dark ? faSun : faMoon}
          color={dark ? "#f8fafc" : "#6b7280"}
          fontSize={30}
          onClick={() => {
            if (!dark) {
              setStageStyle((prevState) => ({
                ...prevState,
                backgroundColor: "#6b7280",
                backgroundImage: "radial-gradient(#cbd5e1 1.1px, #6b7280 1.1px)",
              }));
              setDark(true);
            } else {
              setStageStyle((prevState) => ({
                ...prevState,
                backgroundColor: "#f8fafc",
                backgroundImage: "radial-gradient(#6b7280 1.1px, #f8fafc 1.1px)",
              }));
              setDark(false);
            }
          }}
        />
        <button
          type="button"
          className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
        >
          Login
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
