// Checks that the Shuffle button changes the card on screen (Story #524).
import { renderHook, act, waitFor } from "@testing-library/react";

jest.mock("../services/flashcards/studySession", () => ({
  createStudySession: jest.fn(async () => ({ id: "session1" })),
  getActiveSession: jest.fn(async () => null),
  completeStudySession: jest.fn(async () => {}),
  updateLastActivity: jest.fn(async () => {}),
}));

jest.mock("../services/flashcards/flashcardService", () => ({
  __esModule: true,
  default: {
    getFlashcardDeck: jest.fn(async () => ({
      title: "Test deck",
      cards: ["a", "b", "c", "d", "e"].map((id) => ({ id, front: id, back: id })),
    })),
    updateDeckAnalytics: jest.fn(async () => {}),
  },
}));

const { useStudySession } = require("../hooks/useStudySession");

const setup = async () => {
  const hook = renderHook(() => useStudySession("deck1", "user1"));
  await waitFor(() => expect(hook.result.current.loading).toBe(false));
  return hook;
};

test("shuffle shows a different card right away", async () => {
  const { result } = await setup();
  expect(result.current.currentCard.id).toBe("a");

  await act(() => result.current.shuffleCards());

  expect(result.current.currentCard.id).not.toBe("a");
  expect(result.current.cards).toHaveLength(5);
});

test("cards already studied stay in place", async () => {
  const { result } = await setup();
  act(() => result.current.setCurrentCardIndex(2));

  await act(() => result.current.shuffleCards());

  expect(result.current.cards.slice(0, 2).map((c) => c.id)).toEqual(["a", "b"]);
  expect(result.current.currentCard.id).not.toBe("c");
});

test("shuffle is turned off on the last card", async () => {
  const { result } = await setup();
  act(() => result.current.setCurrentCardIndex(4));
  expect(result.current.canShuffle).toBe(false);
});
