import { getRandomNumber } from "./get-random-number";

export function shuffleArray<T>(array: T[]) {
  // For each index, swap it with another random index.
  for (let i = 0; i < array.length; i++) {
    const randomIndex = getRandomNumber(0, array.length);
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
}
