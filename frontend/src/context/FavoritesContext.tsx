import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { WatchlistApi } from "@/lib/api";
import { useAuth } from "./AuthContext";
import type { WatchlistItemDto } from "@/types/market";

interface FavoritesContextValue {
  favorites: WatchlistItemDto[];
  isFavorite: (symbol: string) => boolean;
  toggleFavorite: (symbol: string) => Promise<void>;
  alertSettings: Record<string, { onRise: boolean; onFall: boolean }>;
  toggleAlert: (symbol: string, kind: "onRise" | "onFall") => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined
);

const LOCAL_KEY = "ft_favorites_local";
const ALERT_KEY = "ft_alert_settings";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<WatchlistItemDto[]>(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  });
  const [alertSettings, setAlertSettings] = useState<
    Record<string, { onRise: boolean; onFall: boolean }>
  >(() => {
    const raw = localStorage.getItem(ALERT_KEY);
    return raw ? JSON.parse(raw) : {};
  });

  useEffect(() => {
    if (!user) return;
    WatchlistApi.getMine(user.userId)
      .then((items) => setFavorites(items))
      .catch(() => {
      });
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(ALERT_KEY, JSON.stringify(alertSettings));
  }, [alertSettings]);

  const isFavorite = (symbol: string) =>
    favorites.some((f) => f.symbol === symbol);

  const toggleFavorite = async (symbol: string) => {
    const existing = favorites.find((f) => f.symbol === symbol);
    if (existing) {
      setFavorites((prev) => prev.filter((f) => f.symbol !== symbol));
      if (user) {
        try {
          await WatchlistApi.remove(existing.id, user.userId);
        } catch {
        }
      }
      return;
    }

    const newItem: WatchlistItemDto = {
      id: crypto.randomUUID(),
      symbol,
      addedAt: new Date().toISOString(),
    };
    setFavorites((prev) => [...prev, newItem]);

    if (user) {
      try {
        const created = await WatchlistApi.add(user.userId, symbol);
        setFavorites((prev) =>
          prev.map((f) => (f.symbol === symbol ? created : f))
        );
      } catch {
      }
    }
  };

  const toggleAlert = (symbol: string, kind: "onRise" | "onFall") => {
    setAlertSettings((prev) => {
      const current = prev[symbol] ?? { onRise: false, onFall: false };
      return { ...prev, [symbol]: { ...current, [kind]: !current[kind] } };
    });
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, alertSettings, toggleAlert }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites, FavoritesProvider içinde kullanılmalı");
  return ctx;
}
