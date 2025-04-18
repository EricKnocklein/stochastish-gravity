export function getStats(values) {
  values.sort((a, b) => a - b);
  const sum = values.reduce((acc, v) => acc + v, 0);
  const avg = sum / values.length;
  const min = values[0];
  const max = values[values.length - 1];
  const median =
    values.length % 2 === 0
      ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
      : values[Math.floor(values.length / 2)];
  const variance =
    values.reduce((acc, v) => acc + (v - avg) ** 2, 0) / values.length;
  const stdDev = Math.sqrt(variance);

  return { avg, median, min, max, stdDev };
}