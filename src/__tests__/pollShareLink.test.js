// Tests for shareable poll links (/poll?code=XXXXXX).
import { buildPollShareUrl, getPollCodeFromSearch } from "../utils/pollShareLink";

describe("buildPollShareUrl", () => {
  test("builds a /poll link with the code as a query param", () => {
    expect(buildPollShareUrl("482193", "https://x.app")).toBe("https://x.app/poll?code=482193");
  });

  test("defaults to the current window origin", () => {
    expect(buildPollShareUrl("482193")).toBe(`${window.location.origin}/poll?code=482193`);
  });
});

describe("getPollCodeFromSearch", () => {
  test("reads a valid 6-digit code", () => {
    expect(getPollCodeFromSearch("?code=482193")).toBe("482193");
  });

  test("trims surrounding whitespace", () => {
    expect(getPollCodeFromSearch("?code=%20482193%20")).toBe("482193");
  });

  test.each(["", "?code=", "?code=abc", "?code=12345", "?code=1234567", "?other=1"])(
    "returns null for %p",
    (search) => {
      expect(getPollCodeFromSearch(search)).toBeNull();
    }
  );

  test("round-trips a built link", () => {
    const url = new URL(buildPollShareUrl("100200", "https://x.app"));
    expect(getPollCodeFromSearch(url.search)).toBe("100200");
  });
});
