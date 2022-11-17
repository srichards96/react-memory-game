import { useState } from "react";
import { GridCell } from "./types/grid-cell.type";
import GridCard from "./components/grid-card.component";
import produce from "immer";

function createGrid(): GridCell[][] {
  return [
    [
      { value: 1, flipped: false, solved: false },
      { value: 6, flipped: false, solved: false },
      { value: 2, flipped: false, solved: false },
      { value: 5, flipped: false, solved: false },
    ],
    [
      { value: 3, flipped: false, solved: false },
      { value: 4, flipped: false, solved: false },
      { value: 0, flipped: false, solved: false },
      { value: 4, flipped: false, solved: false },
    ],
    [
      { value: 2, flipped: false, solved: false },
      { value: 7, flipped: false, solved: false },
      { value: 1, flipped: false, solved: false },
      { value: 0, flipped: false, solved: false },
    ],
    [
      { value: 0, flipped: false, solved: false },
      { value: 3, flipped: false, solved: false },
      { value: 7, flipped: false, solved: false },
      { value: 5, flipped: false, solved: false },
    ],
  ];
}

export default function App() {
  const [grid, setGrid] = useState(createGrid());

  const setCellFlipped = (row: number, col: number) => {
    setGrid(
      produce(grid, (draft) => {
        draft[row][col].flipped = true;
      })
    );
  };

  return (
    <main className="bg-blue-500 max-w-[800px] mx-auto grid grid-rows-4 grid-cols-4 gap-2 md:gap-4">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <GridCard
            key={`cell-${rowIndex}-${colIndex}`}
            {...cell}
            setFlippedFn={() => setCellFlipped(rowIndex, colIndex)}
          />
        ))
      )}
    </main>
  );
}
