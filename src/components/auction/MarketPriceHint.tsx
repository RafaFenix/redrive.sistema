import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { formatEUR } from "@/lib/market-data";
import { cn } from "@/lib/utils";

interface Props {
  currentPrice: number;
  marketPriceRef?: number | null;
}

/**
 * Mostra como o lance atual se compara com o preço de mercado de referência.
 * O valor de referência vem de fontes públicas (Autoscout, OLX, etc.) e
 * funciona como guia, não como avaliação oficial.
 */
export function MarketPriceHint({ currentPrice, marketPriceRef }: Props) {
  if (!marketPriceRef || marketPriceRef <= 0) return null;

  const diff = currentPrice - marketPriceRef;
  const pct = (diff / marketPriceRef) * 100;
  const absPct = Math.abs(pct).toFixed(1);

  const isBelow = diff < -marketPriceRef * 0.02;
  const isAbove = diff > marketPriceRef * 0.02;
  const Icon = isBelow ? TrendingDown : isAbove ? TrendingUp : Minus;
  const tone = isBelow
    ? "text-success border-success/30 bg-success/5"
    : isAbove
      ? "text-destructive border-destructive/30 bg-destructive/5"
      : "text-muted-foreground border-border bg-muted/30";

  const label = isBelow
    ? `${absPct}% abaixo do mercado`
    : isAbove
      ? `${absPct}% acima do mercado`
      : "alinhado com o mercado";

  return (
    <div className={cn("flex items-center gap-3 rounded-sm border p-3", tone)}>
      <Icon className="size-4 shrink-0" />
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-wider">{label}</p>
        <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
          Ref. mercado: {formatEUR(marketPriceRef)}
        </p>
      </div>
    </div>
  );
}
