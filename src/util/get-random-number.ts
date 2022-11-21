export function getRandomNumber(inclusiveMin: number, exclusiveMax: number) {
  return inclusiveMin + Math.floor(Math.random() * exclusiveMax);
}
