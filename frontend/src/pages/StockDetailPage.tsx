import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Star, Bell } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { TopTicker } from "@/components/TopTicker";
import { PriceChangeBadge } from "@/components/PriceChangeBadge";
import { PriceChart } from "@/components/PriceChart";
import { useMarket } from "@/context/MarketContext";
import { useFavorites } from "@/context/FavoritesContext";
import { displayName } from "@/types/market";
import { usePriceSeries, type RangeOption } from "@/hooks/usePriceSeries";

const RANGES: { key: RangeOption; label: string }[] = [
  { key: "6h", label: "6 Saat" },
  { key: "12h", label: "12 Saat" },
  { key: "24h", label: "24 Saat" },
];

function formatPrice(value: number) {
  if (value >= 100) return value.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 4 });
}

export function StockDetailPage() {
  const { symbol = "" } = useParams();
  const navigate = useNavigate();
  const { prices } = useMarket();
  const { isFavorite, toggleFavorite, alertSettings, toggleAlert } = useFavorites();
  const [range, setRange] = useState<RangeOption>("24h");
  const [alarmOpen, setAlarmOpen] = useState(false);

  const price = prices[symbol];
  const { series, changePercent: mockChangePercent } = usePriceSeries(
    symbol,
    price?.lastPrice ?? 0,
    range
  );

  if (!price) {
    return (
      <div>
        <TopTicker />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <p className="text-sm text-ink-faint dark:text-ink-faint-dark">
            Bu sembol için veri bulunamadı.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-sm font-medium text-ink dark:text-ink-dark underline"
          >
            Geri dön
          </button>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(symbol);
  const alerts = alertSettings[symbol] ?? { onRise: false, onFall: false };
  const previousClose = price.lastPrice / (1 + price.priceChangePercent / 100);

  return (
    <div>
      <TopTicker />

      <div className="max-w-md mx-auto px-4 py-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-ink-soft dark:text-ink-soft-dark mb-4"
        >
          <ChevronLeft size={16} /> Geri
        </button>

        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink dark:text-ink-dark">
              {displayName(symbol)}
            </h1>
            <p className="text-xs text-ink-faint dark:text-ink-faint-dark">{symbol}</p>
          </div>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => toggleFavorite(symbol)}
              aria-label="Favorilere ekle"
              className="flex items-center justify-center h-9 w-9 rounded-full border border-line dark:border-line-dark"
            >
              <Star
                size={17}
                className={favorite ? "fill-ink text-ink dark:fill-ink-dark dark:text-ink-dark" : "text-ink-faint dark:text-ink-faint-dark"}
              />
            </button>

            <button
              onClick={() => setAlarmOpen((v) => !v)}
              aria-label="Fiyat alarmı"
              className="flex items-center justify-center h-9 w-9 rounded-full border border-line dark:border-line-dark"
            >
              <Bell
                size={17}
                className={
                  alerts.onRise || alerts.onFall
                    ? "fill-ink text-ink dark:fill-ink-dark dark:text-ink-dark"
                    : "text-ink-faint dark:text-ink-faint-dark"
                }
              />
            </button>

            <AnimatePresence>
              {alarmOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  className="absolute right-0 top-11 w-56 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl shadow-lg p-3 z-20"
                >
                  <p className="text-xs font-medium text-ink-faint dark:text-ink-faint-dark mb-2">
                    Fiyat bildirimleri
                  </p>
                  <label className="flex items-center justify-between py-1.5 text-sm text-ink dark:text-ink-dark cursor-pointer">
                    Yükselişte bildir
                    <input
                      type="checkbox"
                      checked={alerts.onRise}
                      onChange={() => toggleAlert(symbol, "onRise")}
                      className="accent-ink dark:accent-ink-dark"
                    />
                  </label>
                  <label className="flex items-center justify-between py-1.5 text-sm text-ink dark:text-ink-dark cursor-pointer">
                    Düşüşte bildir
                    <input
                      type="checkbox"
                      checked={alerts.onFall}
                      onChange={() => toggleAlert(symbol, "onFall")}
                      className="accent-ink dark:accent-ink-dark"
                    />
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="font-display text-4xl font-semibold text-ink dark:text-ink-dark">
            {formatPrice(price.lastPrice)}
          </span>
          <PriceChangeBadge changePercent={price.priceChangePercent} size="md" />
        </div>

        <div className="flex gap-2 mb-3">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                range === r.key
                  ? "bg-ink dark:bg-ink-dark text-canvas dark:text-canvas-dark"
                  : "bg-surface-2 dark:bg-surface-2-dark text-ink-soft dark:text-ink-soft-dark"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-3 mb-6">
          <PriceChart series={series} changePercent={mockChangePercent} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Önceki Kapanış" value={formatPrice(previousClose)} />
          <Stat label="Güncel Fiyat" value={formatPrice(price.lastPrice)} />
          <Stat label="24s En Düşük" value={formatPrice(price.lowPrice24h)} />
          <Stat label="24s En Yüksek" value={formatPrice(price.highPrice24h)} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl px-4 py-3">
      <p className="text-[11px] text-ink-faint dark:text-ink-faint-dark mb-1">{label}</p>
      <p className="text-sm font-display font-semibold text-ink dark:text-ink-dark">{value}</p>
    </div>
  );
}
