import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PriceDto } from "@/types/market";
import { MarketApi } from "@/lib/api";
import { startMarketHub } from "@/lib/signalr";
import { getMockPrices, startMockTicker } from "@/lib/mockData";

interface MarketContextValue {
  prices: Record<string, PriceDto>;
  flashes: Record<string, "up" | "down">;
  isLive: boolean;
  list: () => PriceDto[];
}

const MarketContext = createContext<MarketContextValue | undefined>(undefined);

export function MarketProvider({ children }: { children: ReactNode }) {
  const [prices, setPrices] = useState<Record<string, PriceDto>>({});
  const [flashes, setFlashes] = useState<Record<string, "up" | "down">>({});
  const [isLive, setIsLive] = useState(false);
  const flashTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const applyUpdate = (price: PriceDto) => {
    setPrices((prev) => {
      const previous = prev[price.symbol];
      if (previous && previous.lastPrice !== price.lastPrice) {
        const direction = price.lastPrice > previous.lastPrice ? "up" : "down";
        setFlashes((f) => ({ ...f, [price.symbol]: direction }));
        clearTimeout(flashTimers.current[price.symbol]);
        flashTimers.current[price.symbol] = setTimeout(() => {
          setFlashes((f) => {
            const next = { ...f };
            delete next[price.symbol];
            return next;
          });
        }, 900);
      }
      return { ...prev, [price.symbol]: price };
    });
  };

  useEffect(() => {
    let stopMock: (() => void) | null = null;
    let stopHub: (() => void) | null = null;
    let cancelled = false;

    (async () => {
      try {
        const data: PriceDto[] = await MarketApi.getAll();
        if (cancelled) return;
        if (data && data.length > 0) {
          const map: Record<string, PriceDto> = {};
          data.forEach((p) => (map[p.symbol] = p));
          setPrices(map);
          setIsLive(true);
          const cleanup = await startMarketHub(applyUpdate);
          stopHub = cleanup;
          return;
        }
        throw new Error("Boş veri, demo moduna geçiliyor");
      } catch (err) {
        if (cancelled) return;
        const mock = getMockPrices();
        const map: Record<string, PriceDto> = {};
        mock.forEach((p) => (map[p.symbol] = p));
        setPrices(map);
        setIsLive(false);
        stopMock = startMockTicker(applyUpdate);
      }
    })();

    return () => {
      cancelled = true;
      stopMock?.();
      stopHub?.();
    };
  }, []);

  const list = () => Object.values(prices);

  return (
    <MarketContext.Provider value={{ prices, flashes, isLive, list }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error("useMarket, MarketProvider içinde kullanılmalı");
  return ctx;
}