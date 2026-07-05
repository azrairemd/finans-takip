import { useMarket } from "@/context/MarketContext";
import { displayName, getTrend } from "@/types/market";
import { useNavigate } from "react-router-dom";

function formatPrice(value: number) {
  if (value >= 100) return value.toLocaleString("tr-TR", { maximumFractionDigits: 1 });
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 4 });
}

export function TopTicker() {
  const { list, flashes } = useMarket();
  const navigate = useNavigate();
  const items = list();

  if (items.length === 0) return null;

  const renderItems = (keyPrefix: string) =>
    items.map((p) => {
      const trend = getTrend(p.priceChangePercent);
      const flash = flashes[p.symbol];
      return (
        <button
          key={`${keyPrefix}-${p.symbol}`}
          onClick={() => navigate(`/stock/${p.symbol}`)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full border border-line dark:border-line-dark whitespace-nowrap transition-colors shrink-0 ${
            flash === "up" ? "flash-green" : flash === "down" ? "flash-red" : ""
          }`}
        >
          <span className="text-xs font-medium text-ink-soft dark:text-ink-soft-dark">
            {displayName(p.symbol)}
          </span>
          <span className="text-xs font-display font-semibold text-ink dark:text-ink-dark">
            {formatPrice(p.lastPrice)}
          </span>
          <span
            className={`text-xs font-medium ${
              trend === "up"
                ? "text-rise"
                : trend === "down"
                ? "text-fall"
                : "text-neutral"
            }`}
          >
            {trend === "up" ? "▲" : trend === "down" ? "▼" : "●"}{" "}
            {Math.abs(p.priceChangePercent).toFixed(2)}%
          </span>
        </button>
      );
    });

  return (
    <div className="w-full overflow-hidden border-b border-line dark:border-line-dark bg-surface/80 dark:bg-surface-dark/80 backdrop-blur">
      <div className="flex gap-2 py-2 w-max animate-marquee hover:[animation-play-state:paused]">
        {renderItems("a")}
        {renderItems("b")}
      </div>
    </div>
  );
}
