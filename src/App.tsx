import { useState } from "react";
import { GridCell } from "./types/grid-cell.type";
import GridCard from "./components/grid-card.component";
import produce from "immer";
import classNames from "classnames";
import { shuffleArray } from "./util/shuffle-array";

function createGrid(size = 4): GridCell[][] {
  const sizeSquared = size ** 2;
  // Make 4x4 array of { value: -1, solved: false }.
  const grid: GridCell[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ value: -1, solved: false }))
  );
  // Get list of indices from 0 to 15, then shuffle them.
  const indices = Array.from(Array(sizeSquared).keys());
  shuffleArray(indices);

  for (let i = 0; i < sizeSquared / 2; i++) {
    // Go over each pair of indices
    const index0 = indices.pop() ?? 0;
    const index1 = indices.pop() ?? 0;
    // Convert from 1d index (0 to 15) to 2d index ([0][0] to [3][3])
    // By getting the modulo and int division (by 4) of the 1d index.
    const n00 = index0 % size;
    const n01 = Math.floor(index0 / size);
    const n10 = index1 % size;
    const n11 = Math.floor(index1 / size);
    // Value of both cells
    grid[n00][n01].value = i;
    grid[n10][n11].value = i;
  }

  return grid;
}

type GridPosition = { row: number; col: number };

export default function App() {
  const [size, setSize] = useState(4);
  const [grid, setGrid] = useState(() => createGrid(size));
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

  const resetGame = (newSize = size) => {
    setSize(newSize);
    setGrid(() => createGrid(newSize));
    setFlippedCard1(undefined);
    setFlippedCard2(undefined);
    setWrongCardsFlipped(false);
  };

  // Treeshaking breaks classnames if using grid-rows-${size}, etc.
  const gridSizeClassnames = new Map([
    [2, "grid-rows-2 grid-cols-2"],
    [4, "grid-rows-4 grid-cols-4"],
    [6, "grid-rows-6 grid-cols-6"],
    [8, "grid-rows-8 grid-cols-8"],
  ]);

  return (
    <div className="h-screen bg-gray-900">
      <main className="max-w-[800px] mx-auto p-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-white mb-4">
          Memory Game
        </h1>

        <div className={`grid gap-2 md:gap-4 ${gridSizeClassnames.get(size)}`}>
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

        <div className="flex justify-between items-center gap-4 mt-4">
          <button
            className={classNames(
              "bg-white bg-opacity-25 text-white px-4 py-2 rounded transition-colors",
              "hover:bg-opacity-30 focus:bg-opacity-30 active:bg-opacity-40"
            )}
            onClick={() => resetGame()}
          >
            Reset
          </button>

          <div className="flex items-center gap-1">
            <label htmlFor="sizeSelect" className="text-white">
              Size:{" "}
            </label>
            <select
              id="sizeSelect"
              className="text-black px-2 py-1 rounded"
              value={size}
              onChange={(e) => resetGame(Number(e.target.value))}
            >
              <option value={2}>2x2</option>
              <option value={4}>4x4</option>
              <option value={6}>6x6</option>
              <option value={8}>8x8</option>
            </select>
          </div>
        </div>
      </main>

      {isGameWon() && (
        <div
          onClick={() => resetGame()}
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
