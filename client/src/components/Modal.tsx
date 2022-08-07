import React from "react";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  modalIsOpen: boolean;
  children: React.ReactNode;
};

const Modal: React.FC<Props> = ({ modalIsOpen, children }) => {
  const overlayVariants = {
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        duration: 0.3,
        delayChildren: 0.2,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
        duration: 0.3,
        delay: 0.2,
      },
    },
  };

  const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.3,
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      y: "-100vh",
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <AnimatePresence>
      {modalIsOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center backdrop-blur-md z-40"
        >
          <motion.div className="modal" initial="hidden" animate="visible" exit="exit" variants={dropIn}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
