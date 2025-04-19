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

export function getTrendline(data) {
  const n = data.length;
  const sumX = data.reduce((sum, p) => sum + p.x, 0);
  const sumY = data.reduce((sum, p) => sum + p.y, 0);
  const sumXY = data.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = data.reduce((sum, p) => sum + p.x * p.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}