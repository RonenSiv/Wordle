import React, { useEffect, useReducer, useState } from "react";
import "./GamePage.css";
import { GameBoard } from "./GameBoard";
import { motion } from "framer-motion";
import "animate.css";
import { GameKB } from "./GameKB";
import { PopUp } from "../Elements/PopUp";
import { Rules } from "../WelcomePage/Rules";
import { HelpModal } from "../Elements/HelpModal";

export const GamePage = ({ genWord, generateWord }) => {
  const word = genWord;
  const stateTemplate = {
    isPresent: false,
    isAbsent: false,
    isCorrect: false,
    isGuessed: false,
  };

  const [wordCharMap, setWordCharMap] = React.useState(new Map());
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const flipAnimationDelay = 300;
  const availableLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const availableLettersArray = availableLetters.split("");
  const [guessedWords, setGuessedWord] = React.useState([[]]);
  const [currentWordArray, setCurrentWordArray] = React.useState([]);
  const [tiles, setTiles] = useState();
  const [currentRow, setCurrentRow] = React.useState(0);
  const [currentColumn, setCurrentColumn] = React.useState(0);
  const [isCooldown, setIsCooldown] = React.useState(false);
  const [lettersStates, setLettersState] = React.useState(
    new Map(
      word.split("").map((letter) => [letter.toLowerCase(), stateTemplate])
    )
  );
  const [redraw, setRedraw] = React.useState(false);
  const [isGameOver, setIsGameOver] = React.useState(false);
  const [isGameWon, setIsGameWon] = React.useState(false);

  useEffect(() => {
    if (currentColumn > 5) {
      setCurrentColumn(0);
      setCurrentRow(currentRow + 1);
    }
  }, [currentColumn, currentRow]);

  // useEffect(() => {
  //   if (currentRow === 6) {
  //     console.log("Game Over");
  //     setIsGameOver(true);
  //     setIsGameWon(false);
  //   }
  // }, [currentRow]);

  const handleUpdateState = (
    letter,
    isGuessed,
    isCorrect,
    isPresent,
    isAbsent
  ) => {
    setLettersState((prevLettersStates) => {
      const newLettersStates = new Map(prevLettersStates);
      const curLetter = newLettersStates.get(letter.toLowerCase());
      if (curLetter) {
        const updatedLetter = {
          ...curLetter,
          isGuessed,
          isCorrect: curLetter.isCorrect || isCorrect,
          isPresent: curLetter.isPresent || isPresent,
          isAbsent,
        };
        newLettersStates.set(letter.toLowerCase(), updatedLetter);
      } else {
        newLettersStates.set(letter.toLowerCase(), {
          isGuessed,
          isCorrect,
          isPresent,
          isAbsent,
        });
      }
      return newLettersStates;
    });
  };
  const handleChangeMap = (letter, isAdd) => {
    const charMap = wordCharMap;
    const currentCount = charMap.get(letter.toLowerCase()) || 0;
    if (isAdd) {
      charMap.set(letter.toLowerCase(), currentCount + 1);
    } else {
      charMap.set(letter.toLowerCase(), currentCount - 1);
    }
    setWordCharMap(charMap);
  };
  const handleResetGame = async () => {
    if (isCooldown) {
      return;
    }
    setIsGameOver(false);
    setIsGameWon(false);
    setCurrentRow(0);
    setCurrentColumn(0);
    setCurrentWordArray([]);
    setGuessedWord([[]]);
    setLettersState(
      new Map(
        word.split("").map((letter) => [letter.toLowerCase(), stateTemplate])
      )
    );
    await handleResetMap();
    await handleResetTiles();
    await generateWord();
    await forceUpdate();
    setIsCooldown(true);
    setTimeout(() => {
      setIsCooldown(false);
    }, 1000);
  };
  const handleResetMap = () => {
    const charMap = wordCharMap;
    for (let i = 0; i < word.length; i++) {
      charMap.set(word.charAt(i).toLowerCase(), 0);
    }
    setWordCharMap(charMap);
  };

  const handleResetTiles = () => {
    setTiles(null);
    setRedraw(true);
  };
  async function handleUpdateGuessedWords(letter) {
    return new Promise((resolve) => {
      if (isCooldown || isGameOver) {
        resolve();
        return;
      }
      setIsCooldown(true);

      setTimeout(async () => {
        setIsCooldown(false);
        if (
          !availableLettersArray
            .map((l) => l.toLowerCase())
            .includes(letter.toLowerCase()) &&
          letter.toLowerCase() !== "enter" &&
          letter.toLowerCase() !== "backspace"
        ) {
          // shake the keyboard
          const keyboard = document.getElementById("game-kb-container");
          keyboard.style.animation = "shake 0.5s";
          setTimeout(() => {
            keyboard.style.animation = "";
          }, 100);
          return;
        }
        if (
          currentWordArray &&
          currentColumn < 5 &&
          currentRow < 6 &&
          letter.toLowerCase() !== "enter" &&
          letter.toLowerCase() !== "backspace"
        ) {
          setCurrentWordArray([...currentWordArray, letter]);
          setCurrentColumn(currentColumn + 1);

          const tileId = `tile-${currentRow + 1}-${currentColumn + 1}`;
          const tile = document.getElementById(tileId);
          // Animate the change in innerHTML using Framer Motion
          tile.innerHTML = letter.toUpperCase();
          tile.style.animation = "press 0.5s";
          setTimeout(() => {
            tile.style.animation = "";
          }, 200);
        }

        if (letter.toLowerCase() === "backspace" && currentColumn > 0) {
          setCurrentWordArray(currentWordArray.slice(0, -1));
          setCurrentColumn(currentColumn - 1);
          const tileId = `tile-${currentRow + 1}-${currentColumn}`;
          const tile = document.getElementById(tileId);
          tile.innerHTML = "";
          tile.style.animation = "press 0.5s";
          setTimeout(() => {
            tile.style.animation = "";
          }, 200);
        }
        if (currentColumn === 5 && letter.toLowerCase() === "enter") {
          const createdWord = currentWordArray.join("").toLowerCase();
          if (!(await checkWordValidity(createdWord))) {
            //draw the tiles red and shake the keyboard
            const keyboard = document.getElementById("game-kb-container");
            keyboard.style.animation = "shake 0.5s";
            setTimeout(() => {
              keyboard.style.animation = "";
            }, 300);

            for (let i = 1; i <= 5; i++) {
              const tileId = `tile-${currentRow + 1}-${i}`;
              const tile = document.getElementById(tileId);
              tile.style.animation = "shake 0.5s";
              tile.style.backgroundColor = "var(--loseColor)";
              setTimeout(() => {
                tile.style.animation = "";
                tile.style.backgroundColor = "var(--white)";
              }, 300);
            }

            return;
          }
          if (currentRow === 6) {
            return;
          } else {
            setGuessedWord([...guessedWords, currentWordArray]);
            setCurrentWordArray([]);
            setCurrentColumn(currentColumn + 1);
            await handleResetMap();
            for (let i = 0; i < 5; i++) {
              await handleChangeMap(word.charAt(i), true);
            }
            // remove all the correct tiles from the map
            for (let i = 1; i <= 5; i++) {
              const tileId = `tile-${currentRow + 1}-${i}`;
              const tile = document.getElementById(tileId);
              const tileLetter = tile.innerHTML.toLowerCase();
              const letterInCurrentPosition = word.charAt(i - 1).toLowerCase();
              const isCorrect =
                tileLetter.toLowerCase() ===
                letterInCurrentPosition.toLowerCase();
              if (isCorrect) {
                await handleChangeMap(tileLetter.toLowerCase(), false);
              }
            }

            for (let i = 1; i <= 5; i++) {
              const tileId = `tile-${currentRow + 1}-${i}`;
              const tile = document.getElementById(tileId);
              const tileLetter = tile.innerHTML.toLowerCase();
              const animationDelay = flipAnimationDelay * i; // Delay in milliseconds based on the tile index
              const letterInCurrentPosition = word.charAt(i - 1).toLowerCase();
              const wordIgnoreCase = word.toLowerCase();
              const tileLetterIgnoreCase = tileLetter.toLowerCase();
              const isCorrect =
                tileLetter.toLowerCase() ===
                letterInCurrentPosition.toLowerCase();
              const isIncorrect =
                !wordIgnoreCase.includes(tileLetterIgnoreCase);
              const isPresent = word
                .toLowerCase()
                .includes(tileLetter.toLowerCase());

              handleUpdateState(
                tileLetter.toLowerCase(),
                true,
                isCorrect,
                isPresent,
                isIncorrect
              );

              if (isCorrect) {
                // Remove the letter from the map
                tile.classList.add("correct");
                setTimeout(() => {
                  tile.classList.add("animate__flipInX");
                  tile.style =
                    "background-color: var(--correct); border-color: var(--correct); color:white;";
                }, animationDelay);

                continue;
              }

              if (isPresent) {
                await handleChangeMap(tileLetter.toLowerCase(), false);
                if (wordCharMap.get(tileLetter.toLowerCase()) < 0) {
                  tile.classList.add("incorrect");
                  setTimeout(() => {
                    tile.classList.add("animate__flipInX");
                    tile.style =
                      "background-color: var(--absent); border-color: var(--absent); color:white;";
                  }, animationDelay);
                  continue;
                }
                tile.classList.add("present");
                setTimeout(() => {
                  tile.classList.add("animate__flipInX");
                  tile.style =
                    "background-color: var(--present); border-color: var(--present); color:white;";
                }, animationDelay);
                continue;
              }
              if (isIncorrect) {
                await handleChangeMap(tileLetter.toLowerCase(), false);
                tile.classList.add("incorrect");
                setTimeout(() => {
                  tile.classList.add("animate__flipInX");
                  tile.style =
                    "background-color: var(--absent); border-color: var(--absent); color:white;";
                }, animationDelay);
              }
            }
            if (
              currentWordArray.join("").toLowerCase() === word.toLowerCase()
            ) {
              setIsGameOver(true);
              setIsGameWon(true);
              setTimeout(() => {
                bouceTiles();
              }, 2500);
              return;
            }
            if (currentRow === 5) {
              setIsGameOver(true);
              setIsGameWon(false);
            }
          }
        }
        resolve(letter);
      }, 1);
    });
  }

  const bouceTiles = () => {
    for (let i = 1; i <= 5; i++) {
      const tileId = `tile-${currentRow + 1}-${i}`;
      const tile = document.getElementById(tileId);
      tile.classList.remove("animate__flipInX");
      tile.classList.add("animate__bounceIn");
      tile.style.animationDelay = `${i * 0.1}s`;
    }
  };

  async function handleKeyDown(event) {
    const keyId = `key-${event.key}`;
    await handleUpdateGuessedWords(keyId.substring(4));
  }

  const checkWordValidity = async (word) => {
    try {
      const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      const response = await fetch(apiUrl);
      if (response.ok) {
        console.log(`"${word}" is a valid word.`);
        return true;
      } else {
        console.log(`"${word}" is not a valid word.`);
        return false;
      }
    } catch (error) {
      console.log("An error occurred:", error);
      return false;
    }
  };

  const drawHelpModal = () => {
    const modal = document.getElementById("help-modal");
    modal.classList.add("animate__animated", "animate__bounceInDown");
    modal.style.display = "block";
  };

  const drawPopUp = () => {
    setTimeout(() => {
      const modal = document.getElementsByClassName("pop-up")[0];
      if (!modal) return;
      modal.classList.add("animate__animated", "animate__fadeInUp");
      modal.style.display = "block";
    }, 1000);
  };

  const handleGiveUp = () => {
    if (isGameOver) return;
    setIsGameOver(true);
    setIsGameWon(false);
    //draw the words on the tiles
    for (let i = 1; i <= 5; i++) {
      const tileId = `tile-${currentRow + 1}-${i}`;
      const tile = document.getElementById(tileId);
      const tileLetter = tile.innerHTML.toLowerCase();
      const animationDelay = flipAnimationDelay * i; // Delay in milliseconds based on the tile index
      const letterInCurrentPosition = word.charAt(i - 1).toLowerCase();

      handleUpdateState(tileLetter.toLowerCase(), true, true, true, false);
      tile.classList.add("correct");
      setTimeout(() => {
        tile.innerHTML = letterInCurrentPosition.toUpperCase();
        tile.classList.add("animate__flipInX");
        tile.style =
          "background-color: var(--correct); border-color: var(--correct); color:white;";
      }, animationDelay);
    }
  };

  return (
    <>
      <HelpModal>
        <Rules enableStart={false} />
      </HelpModal>
      <motion.div
        id="game-page"
        onKeyDown={(event) => {
          handleKeyDown(event);
        }}
        tabIndex="0"
        initial={{ display: "none", opacity: 0 }}
        animate={{ display: "flex", opacity: 1 }}
        exit={{ display: "none", opacity: 0 }}
        transition={{ duration: 2, delay: 2 }}
      >
        <div id="game">
          <h1>
            <motion.span
              style={{
                marginRight: "10px",
              }}
              className="tooltip"
              tooltip="true"
              tooltip-text="Help"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width={20}
                height={20}
                fill={"var(--keyboard-color)"}
                whileHover={{
                  scale: 1.1,
                  fill: "var(--absent)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  drawHelpModal();
                }}
              >
                <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
              </motion.svg>
            </motion.span>
            Wordle
            <span
              style={{
                marginLeft: "10px",
              }}
              className="tooltip"
              tooltip="true"
              tooltip-text="Give Up"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                width={20}
                height={20}
                fill={"var(--keyboard-color)"}
                whileHover={{
                  scale: 1.1,
                  fill: "var(--loseColor)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleGiveUp();
                }}
              >
                <path d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24V64 350.5 400v88c0 13.3 10.7 24 24 24s24-10.7 24-24V388l80.3-20.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L48 52V24zm0 77.5l96.6-24.2c27-6.7 55.5-3.6 80.4 8.8c54.9 27.4 118.7 29.7 175 6.8V334.7l-24.4 9.1c-33.7 12.6-71.2 10.7-103.4-5.4c-48.2-24.1-103.3-30.1-155.6-17.1L48 338.5v-237z" />
              </motion.svg>
            </span>
            <span
              style={{
                marginLeft: "10px",
              }}
              className="tooltip"
              tooltip="true"
              tooltip-text="Reset Game"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                width={20}
                height={20}
                fill={"var(--keyboard-color)"}
                whileHover={{
                  scale: 1.1,
                  fill: "var(--correct)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleResetGame();
                }}
              >
                <path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z" />
              </motion.svg>
            </span>
          </h1>
          <hr />
          {isGameOver && (
            <div
              id="end screen"
              style={{
                color: isGameWon ? "var(--winColor)" : "var(--loseColor)",
              }}
            >
              <h2>
                {isGameWon
                  ? "Congratulations! You won!"
                  : "Sorry, you lost. Try again!"}
              </h2>
            </div>
          )}
          {isGameOver && drawPopUp()}
          <GameBoard
            handleUpdateGuessedWords={handleUpdateGuessedWords}
            lettersStates={lettersStates}
            redraw={redraw}
            setRedraw={setRedraw}
            tiles={tiles}
            setTiles={setTiles}
            isGameWon={isGameWon}
          />

          {isGameOver && (
            <div
              id="end screen"
              style={{
                color: isGameWon ? "var(--winColor)" : "var(--loseColor)",
              }}
            >
              <h2>
                The word was:{" "}
                <span
                  style={{
                    color: "var(--infoColor)",
                  }}
                >
                  {word}
                </span>
              </h2>
            </div>
          )}
          <GameKB
            handleUpdateGuessedWords={handleUpdateGuessedWords}
            lettersStates={lettersStates}
          />
        </div>
        {isGameOver && (
          <PopUp
            title={`You ${isGameWon ? "won" : "lost"}!`}
            text={`The word was: ${word}`}
            buttonText="Play again"
            buttonAction={handleResetGame}
          />
        )}
      </motion.div>
    </>
  );
};
