/**
 * Fisher-Yates Shuffle Algorithm (Pure Function)
 * Shuffles an array in place (returns a new array to keep purity in React context if needed,
 * but here we copy first).
 */
export const fisherYatesShuffle = <T>(items: T[]): T[] => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
