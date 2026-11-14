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
 * Shuffles only the items that come after currentIndex.
 * Items at or before currentIndex stay where they are, so the card the user
 * is on (and the cards they already went through) don't move.
 *
 * If there are at least 2 different upcoming items, the new order is always
 * different from the old one. Fisher-Yates can return the same order by
 * chance (50% of the time with 2 cards), which made the button look broken.
 *
 * @param {Array} array - The full list (for flashcards, the card ID order)
 * @param {number} currentIndex - Index of the item the user is currently on
 * @returns {Array} A new array (original array is not modified)
 */
export function shuffleUpcoming(array, currentIndex) {
  const splitAt = Math.max(0, currentIndex + 1);
  const done = array.slice(0, splitAt);
  const upcoming = array.slice(splitAt);

  if (new Set(upcoming).size < 2) return [...array];

  let shuffled = shuffle(upcoming);
  while (shuffled.every((item, i) => item === upcoming[i])) {
    shuffled = shuffle(upcoming);
  }

  return [...done, ...shuffled];
}

/**
 * How many items are left after currentIndex. Shuffling needs at least 2.
 * @param {Array} array
 * @param {number} currentIndex
 * @returns {number}
 */
export function countUpcoming(array, currentIndex) {
  return Math.max(0, array.length - (currentIndex + 1));
}

export default shuffle;