import { useMemo } from "react";

export type RangeOption = "6h" | "12h" | "24h";

const RANGE_POINTS: Record<RangeOption, number> = {
  "6h": 12,
  "12h": 18,
  "24h": 24,
};

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function usePriceSeries(
  symbol: string,
  currentPrice: number,
  range: RangeOption
) {
  return useMemo(() => {
    const points = RANGE_POINTS[range];
    const seed = hashString(symbol + range) + Math.floor(currentPrice);
    const rnd = seededRandom(seed);

    const volatility = currentPrice * 0.006;
    const series: number[] = [];
    let value = currentPrice - volatility * (points / 2) * (rnd() - 0.5) * 2;

    for (let i = 0; i < points; i++) {
      value += (rnd() - 0.48) * volatility;
      series.push(value);
    }
    series[series.length - 1] = currentPrice;

    const first = series[0];
    const changePercent = ((currentPrice - first) / first) * 100;

    return { series, changePercent };
  }, [symbol, currentPrice, range]);
}
