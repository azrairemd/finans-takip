import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { PriceChangeBadge } from "@/components/PriceChangeBadge";
import { useFavorites } from "@/context/FavoritesContext";
import { useMarket } from "@/context/MarketContext";
import { displayName } from "@/types/market";

function formatPrice(value: number) {
  if (value >= 100) return value.toLocaleString("tr-TR", { maximumFractionDigits: 1 });
  return value.toLocaleString("tr-TR", { maximumFractionDigits: 4 });
}

export function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  const { prices } = useMarket();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const enriched = favorites
    .map((f) => ({ fav: f, price: prices[f.symbol] }))
    .filter((x) => x.price);

  const filtered = search
    ? enriched.filter(
        (x) =>
          x.fav.symbol.toLowerCase().includes(search.toLowerCase()) ||
          displayName(x.fav.symbol).toLowerCase().includes(search.toLowerCase())
      )
    : enriched;

  return (
    <div>
      <TopBar
        showSearch
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Favorilerde ara..."
      />

      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="font-display text-lg font-semibold mb-4 text-ink dark:text-ink-dark">
          Favorilerim
        </h1>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Star size={28} className="mx-auto mb-3 text-ink-faint dark:text-ink-faint-dark" />
            <p className="text-sm text-ink-faint dark:text-ink-faint-dark">
              {favorites.length === 0
                ? "Henüz favori eklemedin. Bir hisseye girip yıldıza dokun."
                : "Aramanla eşleşen favori bulunamadı."}
            </p>
          </div>
        )}

        <div className="bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl divide-y divide-line dark:divide-line-dark">
          {filtered.map(({ fav, price }) => (
            <div
              key={fav.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-surface-2 dark:hover:bg-surface-2-dark transition-colors first:rounded-t-2xl last:rounded-b-2xl"
            >
              <div
                onClick={() => navigate(`/stock/${fav.symbol}`)}
                className="cursor-pointer flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-ink dark:text-ink-dark">
                  {displayName(fav.symbol)}
                </p>
                <p className="text-xs text-ink-faint dark:text-ink-faint-dark">{fav.symbol}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-display font-semibold text-ink dark:text-ink-dark">
                    {formatPrice(price!.lastPrice)}
                  </p>
                  <PriceChangeBadge changePercent={price!.priceChangePercent} />
                </div>
                <button
                  onClick={() => toggleFavorite(fav.symbol)}
                  aria-label="Favoriden çıkar"
                  className="text-ink-faint dark:text-ink-faint-dark hover:text-ink dark:hover:text-ink-dark"
                >
                  <Star size={16} className="fill-ink text-ink dark:fill-ink-dark dark:text-ink-dark" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
