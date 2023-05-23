import React, { useEffect, useState } from "react";
import { GameKB } from "./GameKB";
import { AnimatePresence } from "framer-motion";

export const GameBoard = ({
  handleUpdateGuessedWords,
  lettersStates,
  redraw,
  setRedraw,
  tiles,
  setTiles,
  isGameWon,
}) => {
  const createBoard = () => {
    const tiles = [];

    for (let i = 1; i <= 6; i++) {
      for (let j = 1; j <= 5; j++) {
        const tileId = `tile-${i}-${j}`;
        tiles.push(
          <div
            key={tileId}
            className="tile animate__animated"
            style={{
              backgroundColor: "white",
              border: "2px solid var(--border)",
              color: "black",
            }}
            id={tileId}
          ></div>
        );
      }
    }
    setTiles(tiles);

    return tiles;
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    if (redraw) {
      setTiles(null);
      setTimeout(() => {
        createBoard();
      }, 1);
      setRedraw(false);
    }
  }, [createBoard, redraw, setRedraw, setTiles, tiles]);
  return (
    <>
      <div id="game-board-container">
        <div id="game-board">
          <AnimatePresence>
            {tiles &&
              tiles.map((tile) => {
                return tile;
              })}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
