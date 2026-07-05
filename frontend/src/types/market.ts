export interface PriceDto {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number;
  highPrice24h: number;
  lowPrice24h: number;
  volume24h: number;
  updatedAt: string;
}

export interface WatchlistItemDto {
  id: string;
  symbol: string;
  addedAt: string;
}

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  isNewUser: boolean;
}

export type TrendDirection = "up" | "down" | "flat";

export function getTrend(changePercent: number): TrendDirection {
  if (changePercent > 0.01) return "up";
  if (changePercent < -0.01) return "down";
  return "flat";
}

export const SYMBOL_LABELS: Record<string, string> = {
  BTCUSDT: "Bitcoin",
  ETHUSDT: "Ethereum",
  BNBUSDT: "BNB",
  SOLUSDT: "Solana",
  XRPUSDT: "XRP",
  ADAUSDT: "Cardano",
  DOGEUSDT: "Dogecoin",
  AVAXUSDT: "Avalanche",
  DOTUSDT: "Polkadot",
  MATICUSDT: "Polygon",
};

export function displayName(symbol: string): string {
  return SYMBOL_LABELS[symbol] ?? symbol.replace("USDT", "");
}
