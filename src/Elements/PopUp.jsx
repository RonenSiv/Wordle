import { motion } from "framer-motion";
export const PopUp = ({
  title = "Title",
  text = "Text",
  buttonText = "Button",
  buttonAction = () => {},
}) => {
  const handleClosing = () => {
    const popup = document.getElementsByClassName("pop-up")[0];
    popup.classList.remove("animate__animated", "animate__fadeInUp");
    popup.classList.add("animate__animated", "animate__fadeOutDown");
    setTimeout(() => {
      popup.classList.remove("animate__animated", "animate__fadeOutDown");
      popup.style.display = "none";
    }, 1000);
  };
  return (
    <>
      <div className="pop-up">
        <motion.div
          id="close-help-modal"
          onClick={() => {
            handleClosing();
          }}
          whileHover={{ scale: 1.1 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </motion.div>
        <div className="pop-up-content">
          <div className="pop-up-header">
            <div className="pop-up-title">
              <h1>{title}</h1>
            </div>
          </div>
          <div className="pop-up-body">
            <div className="pop-up-text">
              <p>{text}</p>
            </div>
          </div>
          <div className="pop-up-footer">
            <div className="pop-up-button">
              <motion.button
                onClick={() => {
                  handleClosing();
                  buttonAction();
                }}
              >
                {buttonText}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
