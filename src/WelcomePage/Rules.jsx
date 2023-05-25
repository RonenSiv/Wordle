import { motion } from "framer-motion";
import React from "react";

export const Rules = ({ enableStart, generateWord, setStartGame }) => {
  const style = {
    width: "clamp(40px, 5vw, 60px)",
    height: "clamp(40px, 5vw, 60px)",
    display: "inline-block",
    textAlign: "center",
    margin: "3px",
    lineHeight: "clamp(40px, 5vw, 60px)",
    color: "#fff",
  };
  const initial = {
    backgroundColor: "#fff",
    transform: "rotateX(180deg)",
    opacity: 0,
  };
  const animate = {
    transform: "rotateX(360deg)",
    opacity: 1,
  };

  const variantCorrect = {
    initial: { initial },
    animate: {
      backgroundColor: "var(--correct)",
      borderColor: "var(--correct)",
      ...animate,
    },
    exit: { backgroundColor: "#fff" },
  };

  const variantPresent = {
    initial: { initial },
    animate: {
      backgroundColor: "var(--present)",
      borderColor: "var(--present)",
      ...animate,
    },
    exit: { backgroundColor: "#fff" },
  };

  const variantAbsent = {
    initial: {
      initial,
    },
    animate: {
      backgroundColor: "var(--absent)",
      borderColor: "var(--absent)",
      ...animate,
    },
    exit: { backgroundColor: "#fff" },
  };

  const handleStart = async () => {
    window.scrollTo(0, 0);
    await generateWord();
    setTimeout(() => {
      setStartGame(true);
    }, 100);
  };
  const createGreenExample = () => {
    const tiles = [];
    const words = ["WORDS", "LOGIC", "BRAIN"];
    const explanation = [
      "The letter G is in the word and in the correct spot.",
      "The letter O is in the word but not in the correct spot.",
      "None of the letters are in the word.",
    ];
    for (let i = 1; i <= 3; i++) {
      if (i > 1) tiles.push(<br />);
      for (let j = 1; j <= 5; j++) {
        const tileId = `example-tile-${i}-${j}`;
        const variant =
          i === 1 ? variantCorrect : i === 2 ? variantPresent : variantAbsent;
        const delay = i * 0.5 + j * 0.1;
        tiles.push(
          <>
            <motion.div
              className="tile animate__animated"
              id={tileId}
              style={style}
              variants={i === j ? variant : variantAbsent}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.5, delay: delay }}
            >
              {words[i - 1].charAt(j - 1)}
            </motion.div>
          </>
        );
      }
      tiles.push(
        <div
          className="explanation"
          style={{
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          {explanation[i - 1]}
        </div>
      );
    }
    return tiles;
  };

  return (
    <>
      <motion.div
        id="welcome-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Wordle</h1>
        <h2>Wordle is a game that tests your vocabulary.</h2>
        <hr />
        <div className="instructions">
          <h3>How to play:</h3>
          <ul>
            <li>
              You will be given a word with a length of 5 letters. You will have
              6 tries guess the word.
            </li>
            <li>
              Each guess must be a valid 5 letter word, you cannot enter random
              letters. Hit the enter button to submit the guess.
            </li>
            <li>
              After your submission, the color of the tiles will change as in
              the examples below.
            </li>
          </ul>
          <h3>Examples</h3>
          <p>{createGreenExample()}</p>

          <h3>Scoring:</h3>
          <p>
            You will be given a score based on how many lives you have left when
            you guess the word. The higher your score, the better.
          </p>
          <h3>Leaderboard:</h3>
          <p>
            You can view the leaderboard to see how you compare to other
            players.
          </p>
          <h3>Settings:</h3>
          <p>
            You can change the difficulty of the game in the settings. The
            difficulty will affect the length of the word and the number of
            lives you have.
          </p>
          <h3>Good luck!</h3>
          {enableStart && (
            <motion.button
              id="start-button"
              onClick={handleStart}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Start
            </motion.button>
          )}
        </div>
      </motion.div>
    </>
  );
};
