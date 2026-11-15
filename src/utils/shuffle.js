/**
 * Utility function for shuffling arrays using the Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} A new shuffled array (original array is not modified)
 */
export function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Shuffles the item at currentIndex and everything after it.
 * Items before currentIndex (cards the user already went through) stay
 * where they are, so Next/Previous never repeats or skips a card.
 *
 * The item at currentIndex is always swapped for a different one, so the
 * user can see that the shuffle worked. Plain Fisher-Yates can leave it
 * in place by chance, which made the button look like it did nothing.
 *
 * @param {Array} array - The full list (for flashcards, the card ID order)
 * @param {number} currentIndex - Index of the item the user is currently on
 * @returns {Array} A new array (original array is not modified)
 */
export function shuffleRemaining(array, currentIndex) {
  const splitAt = Math.max(0, currentIndex);
  const done = array.slice(0, splitAt);
  const remaining = array.slice(splitAt);

  if (new Set(remaining).size < 2) return [...array];

  let shuffled = shuffle(remaining);
  while (shuffled[0] === remaining[0]) {
    shuffled = shuffle(remaining);
  }

  return [...done, ...shuffled];
}

/**
 * How many items are left, counting the current one. Shuffling needs at least 2.
 * @param {Array} array
 * @param {number} currentIndex
 * @returns {number}
 */
export function countRemaining(array, currentIndex) {
  return Math.max(0, array.length - Math.max(0, currentIndex));
}

export default shuffle;