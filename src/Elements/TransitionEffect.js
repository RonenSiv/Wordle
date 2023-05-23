import { motion } from "framer-motion";
import React from "react";

const variants = {
  hidden: {
    x: "0%",
    width: "0",
  },
  visible: {
    x: "100%",
    width: "100%",
  },
};

export const TransitionEffect = () => {
  return (
    <>
      {[1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className={`transition-effect${index}`}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit={{
            x: ["100%", "0%"],
            width: ["100%", "0%"],
          }}
          transition={{
            delay: (index - 1) * 0.2,
            duration: 0.8,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};
