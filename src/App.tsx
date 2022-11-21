import { useState } from "react";
import { GridCell } from "./types/grid-cell.type";
import GridCard from "./components/grid-card.component";
import produce from "immer";

function createGrid(): GridCell[][] {
  return [
    [
      { value: 1, solved: false },
      { value: 6, solved: false },
      { value: 2, solved: false },
      { value: 5, solved: false },
    ],
    [
      { value: 3, solved: false },
      { value: 4, solved: false },
      { value: 0, solved: false },
      { value: 4, solved: false },
    ],
    [
      { value: 2, solved: false },
      { value: 7, solved: false },
      { value: 1, solved: false },
      { value: 0, solved: false },
    ],
    [
      { value: 6, solved: false },
      { value: 3, solved: false },
      { value: 7, solved: false },
      { value: 5, solved: false },
    ],
  ];
}

type GridPosition = { row: number; col: number };
export default function App() {
  const [grid, setGrid] = useState(createGrid());
  const [flippedCard1, setFlippedCard1] = useState<GridPosition>();
  const [flippedCard2, setFlippedCard2] = useState<GridPosition>();

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
        setTimeout(() => {
          setFlippedCard1(undefined);
          setFlippedCard2(undefined);
        }, 1000);
      }
    }
  };

  const isCardFlipped = ({ row, col }: GridPosition) =>
    (flippedCard1?.row === row && flippedCard1.col === col) ||
    (flippedCard2?.row === row && flippedCard2.col === col);

  return (
    <main className="bg-blue-500 max-w-[800px] mx-auto grid grid-rows-4 grid-cols-4 gap-2 md:gap-4">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <GridCard
            key={`cell-${rowIndex}-${colIndex}`}
            {...cell}
            flipped={isCardFlipped({ row: rowIndex, col: colIndex })}
            setFlippedFn={() =>
              setCellFlipped({ row: rowIndex, col: colIndex })
            }
          />
        ))
      )}
    </main>
  );
}
