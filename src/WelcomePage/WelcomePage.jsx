import React, { useState } from "react";
import "./WelcomePage.css";
import { GamePage } from "../GamePage/GamePage";
import { AnimatePresence } from "framer-motion";
import { TransitionEffect } from "../Elements/TransitionEffect";
import { Rules } from "./Rules";

export const WelcomePage = ({ enableStart = true }) => {
  const [startGame, setStartGame] = useState(false);
  const [showTransition, setShowTransition] = useState(true);
  const [word, setWord] = useState("");

  const generateWord = async () => {
    try {
      const response = await fetch(
        "https://random-word-api.vercel.app/api?words=1&length=5&type=uppercase"
      );
      if (response.ok) {
        const data = await response.json();
        setWord(data[0]);
        console.log(data[0]);
      } else {
        console.log("Unable to generate word");
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!startGame && (
          <Rules
            enableStart={enableStart}
            generateWord={generateWord}
            setStartGame={setStartGame}
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {startGame && (
          <>
            <AnimatePresence mode="wait">
              {showTransition && <TransitionEffect />}
              {setTimeout(() => {
                setShowTransition(false);
              }, 2000)}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <GamePage genWord={word} generateWord={generateWord} />
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
