// Tests for the flashcard shuffle helpers (Story #524).
import { shuffleUpcoming, countUpcoming } from "../utils/shuffle";

const deck = ["a", "b", "c", "d", "e", "f"];

describe("shuffleUpcoming", () => {
  test("keeps the current card and the cards before it in place", () => {
    for (let run = 0; run < 50; run++) {
      const result = shuffleUpcoming(deck, 2);
      expect(result.slice(0, 3)).toEqual(["a", "b", "c"]);
    }
  });

  test("keeps every card exactly once", () => {
    const result = shuffleUpcoming(deck, 1);
    expect([...result].sort()).toEqual([...deck].sort());
    expect(result).toHaveLength(deck.length);
  });

  test("always changes the order when there are 2+ cards left", () => {
    const twoLeft = ["a", "b", "c"];
    for (let run = 0; run < 50; run++) {
      expect(shuffleUpcoming(twoLeft, 0)).toEqual(["a", "c", "b"]);
    }
  });

  test("does nothing when fewer than 2 cards are left", () => {
    expect(shuffleUpcoming(deck, 4)).toEqual(deck);
    expect(shuffleUpcoming(deck, 5)).toEqual(deck);
  });

  test("does not change the original array", () => {
    const copy = [...deck];
    shuffleUpcoming(deck, 0);
    expect(deck).toEqual(copy);
  });
});

describe("countUpcoming", () => {
  test("counts the cards after the current one", () => {
    expect(countUpcoming(deck, 0)).toBe(5);
    expect(countUpcoming(deck, 5)).toBe(0);
    expect(countUpcoming([], 0)).toBe(0);
  });
});
