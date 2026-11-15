// Tests for the flashcard shuffle helpers (Story #524).
import { shuffleRemaining, countRemaining } from "../utils/shuffle";

const deck = ["a", "b", "c", "d", "e", "f"];

describe("shuffleRemaining", () => {
  test("keeps the cards before the current one in place", () => {
    for (let run = 0; run < 50; run++) {
      expect(shuffleRemaining(deck, 2).slice(0, 2)).toEqual(["a", "b"]);
    }
  });

  test("always puts a different card at the current spot", () => {
    for (let run = 0; run < 50; run++) {
      expect(shuffleRemaining(deck, 0)[0]).not.toBe("a");
      expect(shuffleRemaining(deck, 3)[3]).not.toBe("d");
    }
  });

  test("swaps the last two cards when only 2 are left", () => {
    expect(shuffleRemaining(deck, 4)).toEqual(["a", "b", "c", "d", "f", "e"]);
  });

  test("keeps every card exactly once", () => {
    const result = shuffleRemaining(deck, 1);
    expect([...result].sort()).toEqual([...deck].sort());
  });

  test("does nothing on the last card", () => {
    expect(shuffleRemaining(deck, 5)).toEqual(deck);
  });

  test("does not change the original array", () => {
    const copy = [...deck];
    shuffleRemaining(deck, 0);
    expect(deck).toEqual(copy);
  });
});

describe("countRemaining", () => {
  test("counts the current card and the ones after it", () => {
    expect(countRemaining(deck, 0)).toBe(6);
    expect(countRemaining(deck, 5)).toBe(1);
    expect(countRemaining([], 0)).toBe(0);
  });
});
