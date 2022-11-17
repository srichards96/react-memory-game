import type { GridCell } from "../types/grid-cell.type";

type Props = GridCell & {
  setFlippedFn: () => void;
};

export default function GridCard({
  value,
  flipped,
  solved,
  setFlippedFn,
}: Props) {
  return (
    <button
      className="bg-red-500 aspect-square inline-flex items-center justify-center"
      onClick={setFlippedFn}
    >
      <h2 className="text-4xl font-bold">{solved || flipped ? value : ""}</h2>
    </button>
  );
}
