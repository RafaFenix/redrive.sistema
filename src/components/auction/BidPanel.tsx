import { useState } from "react";
import { Auction, formatEUR, placeAuctionBid } from "@/lib/market-data";
import { ReserveIndicator } from "./ReserveIndicator";
import { AuctionTimer } from "./AuctionTimer";
import { toast } from "sonner";

interface Props {
  auction: Auction;
  onBidPlaced?: () => void | Promise<void>;
}

export function BidPanel({ auction, onBidPlaced }: Props) {
  const [custom, setCustom] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEnded = auction.status === "ended" || new Date(auction.endsAt).getTime() <= Date.now();

  async function placeBid(amount: number, isBuyNow = false) {
    if (isEnded) return;

    setIsSubmitting(true);

    try {
      await placeAuctionBid({ auctionId: auction.id, amount, isBuyNow });
      toast.success(
        isBuyNow
          ? `Comprar Já confirmado por ${formatEUR(amount)}`
          : `Lance de ${formatEUR(amount)} submetido`,
      );
      setCustom("");
      await onBidPlaced?.();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível submeter o lance.", {
        description:
          error instanceof Error ? error.message : "Tente novamente dentro de instantes.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleQuick(inc: number) {
    void placeBid(auction.currentPrice + inc);
  }

  function handleCustom() {
    const value = parseInt(custom.replace(/\D/g, ""), 10);
    if (isNaN(value) || value <= auction.currentPrice / 100) {
      toast.error("Lance inválido", {
        description: `Deve ser superior a ${formatEUR(auction.currentPrice)}.`,
      });
      return;
    }
    void placeBid(value * 100);
  }

  return (
    <div className="rounded-sm border-2 border-foreground bg-card p-6 shadow-[4px_4px_0px_0px_var(--color-foreground)]">
      {/* Timer */}
      <div className="mb-6">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Tempo restante
          </span>
          <ReserveIndicator reserveMet={auction.reserveMet} />
        </div>
        <AuctionTimer endsAt={auction.endsAt} status={auction.status} size="lg" />
      </div>

      {/* Current price */}
      <div className="mb-6 border-t border-border pt-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Lance atual
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight">
            {formatEUR(auction.currentPrice)}
          </span>
          <span className="text-xs text-muted-foreground">+ Taxas</span>
        </div>
        <div className="mt-1 font-mono text-[10px] text-muted-foreground">
          {auction.bidCount} lances · {auction.viewerCount} a observar
        </div>
      </div>

      {!isEnded ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {auction.bidIncrements.map((inc) => (
              <button
                key={inc}
                onClick={() => handleQuick(inc)}
                disabled={isSubmitting}
                className="border border-border py-2 text-xs font-bold transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                +{formatEUR(inc)}
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Valor personalizado..."
              className="w-full border border-border bg-background px-3 py-3 font-mono text-sm focus:border-primary focus:outline-none"
            />
            <span className="absolute right-3 top-3.5 text-xs text-muted-foreground">EUR</span>
          </div>
          <button
            onClick={handleCustom}
            disabled={isSubmitting}
            className="w-full bg-primary py-4 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "A submeter..." : "Efetuar licitação"}
          </button>
          {auction.buyNowPrice && (
            <button
              onClick={() => void placeBid(auction.buyNowPrice!, true)}
              disabled={isSubmitting}
              className="w-full border-2 border-foreground py-3 text-sm font-bold uppercase transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
            >
              Comprar já: {formatEUR(auction.buyNowPrice)}
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-sm bg-muted p-4 text-center text-sm font-medium text-muted-foreground">
          Este leilão já terminou.
        </div>
      )}
    </div>
  );
}
