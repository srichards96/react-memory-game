import classNames from "classnames";
import type { GridCell } from "../types/grid-cell.type";

type Props = GridCell & {
  flipped: boolean;
  wrongCardsFlipped: boolean;
  setFlippedFn: () => void;
};

export default function GridCard({
  value,
  flipped,
  wrongCardsFlipped,
  solved,
  setFlippedFn,
}: Props) {
  return (
    <button
      className={classNames(
        "bg-white bg-opacity-10 border-2 md:border-4 border-white border-opacity-10 rounded",
        "aspect-square inline-flex items-center justify-center text-white",
        "transition-colors",
        {
          "border-opacity-100": flipped || solved,
          "border-red-400 bg-red-400 text-red-500":
            flipped && wrongCardsFlipped,
          "border-green-400 bg-green-400 text-green-500": solved,
        }
      )}
      onClick={setFlippedFn}
    >
      <h2 className="text-4xl font-bold">{solved || flipped ? value : ""}</h2>
    </button>
  );
}
