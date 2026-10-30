// Turns a poll's vote counts into whole-number percentages that always add up to 100%.
// Percentages are based on the total number of answers picked (not the number of voters),
// so multi-select polls never go over 100%. Leftover points from rounding go to the
// options with the largest remainders.
export function getPollPercentages(votes = []) {
  const counts = votes.map((v) => Number(v) || 0);
  const total = counts.reduce((sum, v) => sum + v, 0);
  if (total === 0) return counts.map(() => 0);

  const exact = counts.map((v) => (v / total) * 100);
  const percents = exact.map(Math.floor);
  let leftover = 100 - percents.reduce((sum, p) => sum + p, 0);

  exact
    .map((value, idx) => ({ idx, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder)
    .forEach(({ idx }) => {
      if (leftover > 0) {
        percents[idx] += 1;
        leftover -= 1;
      }
    });

  return percents;
}
