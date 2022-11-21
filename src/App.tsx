import { useState } from "react";
import { GridCell } from "./types/grid-cell.type";
import GridCard from "./components/grid-card.component";
import produce from "immer";
import classNames from "classnames";
import { shuffleArray } from "./util/shuffle-array";

function createGrid(): GridCell[][] {
  // Make 4x4 array of { value: -1, solved: false }.
  const grid: GridCell[][] = Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => ({ value: -1, solved: false }))
  );
  // Get list of indices from 0 to 15, then shuffle them.
  const indices = Array.from(Array(16).keys());
  shuffleArray(indices);

  for (let i = 0; i <= 7; i++) {
    // Go over each pair of indices
    const index0 = indices.pop() ?? 0;
    const index1 = indices.pop() ?? 0;
    // Convert from 1d index (0 to 15) to 2d index ([0][0] to [3][3])
    // By getting the modulo and int division (by 4) of the 1d index.
    const n00 = index0 % 4;
    const n01 = Math.floor(index0 / 4);
    const n10 = index1 % 4;
    const n11 = Math.floor(index1 / 4);
    // Value of both cells
    grid[n00][n01].value = i;
    grid[n10][n11].value = i;
  }

  return grid;
}

type GridPosition = { row: number; col: number };

export default function App() {
  const [grid, setGrid] = useState(() => createGrid());
  const [flippedCard1, setFlippedCard1] = useState<GridPosition>();
  const [flippedCard2, setFlippedCard2] = useState<GridPosition>();
  const [wrongCardsFlipped, setWrongCardsFlipped] = useState(false);

  const setCellFlipped = ({ row, col }: GridPosition) => {
    // If card is already flipped or card is solved, do nothing.
    if (isCardFlipped({ row, col }) || grid[row][col].solved) {
      return;
    }

    if (flippedCard1 == null) {
      setFlippedCard1({ row, col });
    } else if (flippedCard2 == null) {
      setFlippedCard2({ row, col });
      // If 2nd card is being flipped, check both cards.
      const { row: card1Row, col: card1Col } = flippedCard1;
      const match = grid[card1Row][card1Col].value === grid[row][col].value;
      // If values match, set cards to solved.
      if (match) {
        setGrid(
          produce(grid, (draft) => {
            draft[row][col].solved = draft[card1Row][card1Col].solved = true;
          })
        );
        setFlippedCard1(undefined);
        setFlippedCard2(undefined);
      } else {
        // Otherwise let both be flipped for 1s.
        setWrongCardsFlipped(true);
        setTimeout(() => {
          setFlippedCard1(undefined);
          setFlippedCard2(undefined);
          setWrongCardsFlipped(false);
        }, 1000);
      }
    }
  };

  const isCardFlipped = ({ row, col }: GridPosition) =>
    (flippedCard1?.row === row && flippedCard1.col === col) ||
    (flippedCard2?.row === row && flippedCard2.col === col);

  const isGameWon = () =>
    grid.flatMap((r) => r).reduce((acc, cur) => acc && cur.solved, true);

  const resetGame = () => {
    setGrid(() => createGrid());
    setFlippedCard1(undefined);
    setFlippedCard2(undefined);
    setWrongCardsFlipped(false);
  };

  return (
    <div className="h-screen bg-gray-900">
      <main className="max-w-[800px] mx-auto p-4">
        <div className="grid grid-rows-4 grid-cols-4 gap-2 md:gap-4">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <GridCard
                key={`cell-${rowIndex}-${colIndex}`}
                {...cell}
                flipped={isCardFlipped({ row: rowIndex, col: colIndex })}
                wrongCardsFlipped={wrongCardsFlipped}
                setFlippedFn={() =>
                  setCellFlipped({ row: rowIndex, col: colIndex })
                }
              />
            ))
          )}
        </div>

        <div className="flex justify-center mt-4">
          <button
            className={classNames(
              "bg-white bg-opacity-25 text-white px-4 py-2 rounded transition-colors",
              "hover:bg-opacity-30 focus:bg-opacity-30 active:bg-opacity-40"
            )}
            onClick={resetGame}
          >
            Reset
          </button>
        </div>
      </main>

      {isGameWon() && (
        <div
          onClick={resetGame}
          className={classNames(
            "fixed top-0 left-0 w-screen h-screen transition-colors bg-black bg-opacity-30",
            "text-center flex flex-col gap-4 items-center pt-[10%] md:pt-0 md:justify-center cursor-pointer select-none"
          )}
        >
          <h1 className="text-8xl text-white">You Won!</h1>
          <p className="text-4xl text-white">Tap to Reset</p>
        </div>
      )}
    </div>
  );
}
