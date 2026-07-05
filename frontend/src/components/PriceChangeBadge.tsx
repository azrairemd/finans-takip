import { getTrend } from "@/types/market";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Props {
  changePercent: number;
  size?: "sm" | "md";
}

export function PriceChangeBadge({ changePercent, size = "sm" }: Props) {
  const trend = getTrend(changePercent);
  const color =
    trend === "up"
      ? "text-rise bg-rise-soft dark:bg-rise/15"
      : trend === "down"
      ? "text-fall bg-fall-soft dark:bg-fall/15"
      : "text-neutral bg-surface-2 dark:bg-surface-2-dark";

  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const padding = size === "sm" ? "px-2 py-0.5" : "px-3 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${color} ${textSize} ${padding}`}
    >
      <Icon size={size === "sm" ? 12 : 14} />
      {Math.abs(changePercent).toFixed(2)}%
    </span>
  );
}
