const POLL_CODE_PATTERN = /^\d{6}$/;

export function buildPollShareUrl(code, origin = window.location.origin) {
  return `${origin}/poll?code=${encodeURIComponent(code)}`;
}

// Returns the 6-digit join code from a URL search string, or null if missing/invalid.
export function getPollCodeFromSearch(search = "") {
  const code = new URLSearchParams(search).get("code")?.trim();
  return code && POLL_CODE_PATTERN.test(code) ? code : null;
}
