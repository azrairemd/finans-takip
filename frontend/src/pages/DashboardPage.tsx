import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopTicker } from "@/components/TopTicker";
import { TopBar } from "@/components/TopBar";
import { PriceChangeBadge } from "@/components/PriceChangeBadge";
import { useMarket } from "@/context/MarketContext";
import { displayName } from "@/types/market";

function formatPrice(value: number) {
  if (value >= 100) return value.toLocaleString("tr-TR", { maximumFractionDigits: 1 });
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 4 });
}

export function DashboardPage() {
  const { list, isLive } = useMarket();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const all = list();

  const { gainers, losers } = useMemo(() => {
    const sorted = [...all].sort(
      (a, b) => b.priceChangePercent - a.priceChangePercent
    );
    return {
      gainers: sorted.slice(0, 3),
      losers: sorted.slice(-3).reverse(),
    };
  }, [all]);

  const filtered = search
    ? all.filter(
        (p) =>
          p.symbol.toLowerCase().includes(search.toLowerCase()) ||
          displayName(p.symbol).toLowerCase().includes(search.toLowerCase())
      )
    : all;

  return (
    <div>
      <TopBar showSearch showNotifications showProfile searchValue={search} onSearchChange={setSearch} />
      <TopTicker />

      <div className="max-w-md mx-auto px-4 py-6 space-y-8">
        {!isLive && (
          <p className="text-[11px] text-ink-faint dark:text-ink-faint-dark text-center">
            Demo veri gösteriliyor — backend'e bağlandığında canlı akışa geçer.
          </p>
        )}

        <section>
          <h2 className="font-display text-lg font-semibold mb-3 text-ink dark:text-ink-dark">
            Günün Öne Çıkanları
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-3">
              <p className="text-[11px] font-medium text-ink-faint dark:text-ink-faint-dark uppercase tracking-wide mb-2">
                Yükselenler
              </p>
              <ul className="space-y-2.5">
                {gainers.map((p) => (
                  <li
                    key={p.symbol}
                    onClick={() => navigate(`/stock/${p.symbol}`)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink dark:text-ink-dark truncate">
                        {displayName(p.symbol)}
                      </p>
                      <p className="text-xs text-ink-faint dark:text-ink-faint-dark">
                        {formatPrice(p.lastPrice)}
                      </p>
                    </div>
                    <PriceChangeBadge changePercent={p.priceChangePercent} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-3">
              <p className="text-[11px] font-medium text-ink-faint dark:text-ink-faint-dark uppercase tracking-wide mb-2">
                Düşenler
              </p>
              <ul className="space-y-2.5">
                {losers.map((p) => (
                  <li
                    key={p.symbol}
                    onClick={() => navigate(`/stock/${p.symbol}`)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink dark:text-ink-dark truncate">
                        {displayName(p.symbol)}
                      </p>
                      <p className="text-xs text-ink-faint dark:text-ink-faint-dark">
                        {formatPrice(p.lastPrice)}
                      </p>
                    </div>
                    <PriceChangeBadge changePercent={p.priceChangePercent} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-3 text-ink dark:text-ink-dark">
            Tüm Piyasa
          </h2>
          <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl divide-y divide-line dark:divide-line-dark">
            {filtered.map((p) => (
              <div
                key={p.symbol}
                onClick={() => navigate(`/stock/${p.symbol}`)}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-surface-2 dark:hover:bg-surface-2-dark transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div>
                  <p className="text-sm font-medium text-ink dark:text-ink-dark">
                    {displayName(p.symbol)}
                  </p>
                  <p className="text-xs text-ink-faint dark:text-ink-faint-dark">{p.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-display font-semibold text-ink dark:text-ink-dark">
                    {formatPrice(p.lastPrice)}
                  </p>
                  <PriceChangeBadge changePercent={p.priceChangePercent} />
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="px-4 py-6 text-sm text-ink-faint dark:text-ink-faint-dark text-center">
                Sonuç bulunamadı.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
