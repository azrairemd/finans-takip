import { getTrend } from "@/types/market";

interface PriceChartProps {
  series: number[];
  changePercent: number;
}

export function PriceChart({ series, changePercent }: PriceChartProps) {
  const width = 320;
  const height = 160;
  const padding = 8;

  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;

  const trend = getTrend(changePercent);
  const color =
    trend === "up" ? "var(--color-rise)" : trend === "down" ? "var(--color-fall)" : "var(--color-neutral)";

  const points = series.map((v, i) => {
    const x = padding + (i / (series.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return [x, y];
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1][0]} ${height - padding} L ${points[0][0]} ${height - padding} Z`;

  const gradientId = `chart-gradient-${trend}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-40" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
