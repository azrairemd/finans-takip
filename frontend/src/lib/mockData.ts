import type { PriceDto } from "@/types/market";

const seed: PriceDto[] = [
  { symbol: "BTCUSDT", lastPrice: 68420.5, priceChangePercent: 2.14, highPrice24h: 69100, lowPrice24h: 66890, volume24h: 18234, updatedAt: new Date().toISOString() },
  { symbol: "ETHUSDT", lastPrice: 3542.8, priceChangePercent: 1.32, highPrice24h: 3601, lowPrice24h: 3488, volume24h: 92341, updatedAt: new Date().toISOString() },
  { symbol: "BNBUSDT", lastPrice: 612.4, priceChangePercent: -0.86, highPrice24h: 621, lowPrice24h: 605, volume24h: 41234, updatedAt: new Date().toISOString() },
  { symbol: "SOLUSDT", lastPrice: 178.92, priceChangePercent: 5.67, highPrice24h: 182.4, lowPrice24h: 168.1, volume24h: 231234, updatedAt: new Date().toISOString() },
  { symbol: "XRPUSDT", lastPrice: 0.612, priceChangePercent: -2.31, highPrice24h: 0.634, lowPrice24h: 0.605, volume24h: 512341, updatedAt: new Date().toISOString() },
  { symbol: "ADAUSDT", lastPrice: 0.452, priceChangePercent: 0.04, highPrice24h: 0.461, lowPrice24h: 0.447, volume24h: 321234, updatedAt: new Date().toISOString() },
  { symbol: "DOGEUSDT", lastPrice: 0.1421, priceChangePercent: -4.12, highPrice24h: 0.1502, lowPrice24h: 0.1398, volume24h: 812341, updatedAt: new Date().toISOString() },
  { symbol: "AVAXUSDT", lastPrice: 32.15, priceChangePercent: 3.42, highPrice24h: 33.02, lowPrice24h: 30.88, volume24h: 91234, updatedAt: new Date().toISOString() },
  { symbol: "DOTUSDT", lastPrice: 6.82, priceChangePercent: -1.02, highPrice24h: 6.98, lowPrice24h: 6.71, volume24h: 61234, updatedAt: new Date().toISOString() },
  { symbol: "MATICUSDT", lastPrice: 0.712, priceChangePercent: 0.91, highPrice24h: 0.729, lowPrice24h: 0.698, volume24h: 71234, updatedAt: new Date().toISOString() },
];

export function getMockPrices(): PriceDto[] {
  return seed.map((s) => ({ ...s }));
}

export function startMockTicker(
  onUpdate: (price: PriceDto) => void
): () => void {
  const interval = setInterval(() => {
    const base = seed[Math.floor(Math.random() * seed.length)];
    const drift = (Math.random() - 0.5) * 0.006;
    base.lastPrice = +(base.lastPrice * (1 + drift)).toFixed(4);
    base.priceChangePercent = +(base.priceChangePercent + drift * 100).toFixed(2);
    base.updatedAt = new Date().toISOString();
    onUpdate({ ...base });
  }, 2200);

  return () => clearInterval(interval);
}
