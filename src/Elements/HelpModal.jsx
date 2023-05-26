import { motion } from "framer-motion";

export const HelpModal = ({ children }) => {
  return (
    <>
      <div id="help-modal">
        <motion.div
          id="close-help-modal"
          onClick={() => {
            const modal = document.getElementById("help-modal");
            modal.classList.remove(
              "animate__animated",
              "animate__bounceInDown"
            );
            document.getElementsByTagName("body")[0].style.overflowY = "hidden";
            modal.classList.add("animate__animated", "animate__backOutDown");
            setTimeout(() => {
              modal.classList.remove(
                "animate__animated",
                "animate__backOutDown"
              );
              modal.style.display = "none";
              document.getElementsByTagName("body")[0].style.overflowY = "auto";
            }, 1000);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </motion.div>
        <div
          id="help-modal-content"
          style={{ overflowY: "auto", height: "100%" }}
        >
          {children}
        </div>
      </div>
    </>
  );
};
