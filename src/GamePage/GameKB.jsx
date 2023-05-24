import { motion } from "framer-motion";
export const GameKB = ({ handleUpdateGuessedWords, lettersStates }) => {
  const handleCreateKB = (keyarray) => {
    const kb = [];
    for (let i = 0; i < keyarray.length; i++) {
      const keyId = `key-${keyarray[i].toLowerCase()}`;
      const curLetter = lettersStates.get(keyarray[i].toLowerCase());
      let background = "var(--keyboard-bg)";
      let color = "var(--keyboard-color)";
      if (curLetter) {
        if (curLetter.isGuessed) {
          if (curLetter.isCorrect) {
            background = "var(--correct)";
            color = "#fff";
          } else if (curLetter.isAbsent) {
            background = "var(--absent)";
            color = "#fff";
          } else if (curLetter.isPresent) {
            background = "var(--present)";
            color = "#fff";
          }
        }
      }

      kb.push(
        <motion.button
          key={keyId}
          className="key"
          id={keyId}
          onClick={() => {
            handleUpdateGuessedWords(keyId.substring(4));
          }}
          style={{
            backgroundColor: background,
            color: color,
          }}
        >
          {keyarray[i]}
        </motion.button>
      );
    }
    return kb;
  };

  return (
    <>
      <div id="game-kb-container">
        <div className="keyboard-row">
          {handleCreateKB(["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"])}
        </div>
        <div className="keyboard-row">
          <div className="spacer-half"></div>
          {handleCreateKB(["A", "S", "D", "F", "G", "H", "J", "K", "L"])}
          <div className="spacer-half"></div>
        </div>
        <div className="keyboard-row">
          <motion.button
            className="wide-button"
            key="key-enter"
            id="key-enter"
            onClick={() => {
              handleUpdateGuessedWords("enter");
            }}
            whileHover={{
              scale: 1.1,
              backgroundColor: "var(--keyboard-hover)",
            }}
          >
            Enter
          </motion.button>
          {handleCreateKB(["Z", "X", "C", "V", "B", "N", "M"])}
          <motion.button
            className="wide-button"
            key="key-backspace"
            id="key-backspace"
            onClick={() => {
              handleUpdateGuessedWords("backspace");
            }}
            whileHover={{
              scale: 1.1,
              backgroundColor: "var(--keyboard-hover)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              width={30}
              height={20}
            >
              <path d="M576 128c0-35.3-28.7-64-64-64H205.3c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7H512c35.3 0 64-28.7 64-64V128zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
            </svg>
          </motion.button>
        </div>
      </div>
    </>
  );
};
