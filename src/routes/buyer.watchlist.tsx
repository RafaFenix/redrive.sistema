import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuctionTimer } from "@/components/auction/AuctionTimer";
import {
  formatEUR,
  formatNumber,
  listBuyerWatchlistAuctions,
  toggleAuctionWatchlist,
  type BuyerWatchlistItem,
} from "@/lib/market-data";
import { toast } from "sonner";

export const Route = createFileRoute("/buyer/watchlist")({
  head: () => ({ meta: [{ title: "Watchlist — Buyer" }] }),
  component: BuyerWatchlist,
});

function BuyerWatchlist() {
  const [items, setItems] = useState<BuyerWatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadWatchlist();
  }, []);

  async function loadWatchlist() {
    setIsLoading(true);

    try {
      const data = await listBuyerWatchlistAuctions();
      setItems(data.filter((item) => item.auction));
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar a watchlist.");
    } finally {
      setIsLoading(false);
    }
  }

  async function removeAuction(auctionId: string) {
    try {
      await toggleAuctionWatchlist(auctionId);
      toast.success("Leilão removido da watchlist.");
      await loadWatchlist();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível remover o leilão.");
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Comprador
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Watchlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Leilões que está a observar, ordenados por data de fim.
        </p>
      </div>

      {isLoading ? (
        <div className="border border-border bg-card p-12 text-center text-muted-foreground">
          A carregar watchlist...
        </div>
      ) : items.length === 0 ? (
        <div className="border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">Ainda não está a observar nenhum leilão.</p>
          <Link
            to="/auctions"
            className="mt-4 inline-block bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
          >
            Ver leilões
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items
            .slice()
            .sort((a, b) => {
              const aDate = a.auction ? +new Date(a.auction.endsAt) : 0;
              const bDate = b.auction ? +new Date(b.auction.endsAt) : 0;
              return aDate - bDate;
            })
            .map((item) => {
              const auction = item.auction!;
              const vehicle = auction.vehicle;
              if (!vehicle) return null;

              return (
                <article
                  key={item.id}
                  className="grid gap-4 border border-border bg-card p-4 md:grid-cols-[180px_1fr_auto]"
                >
                  <img
                    src={vehicle.photos[0]}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="aspect-video w-full object-cover md:h-28"
                  />
                  <div>
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {auction.lotNumber}
                    </p>
                    <h2 className="mt-1 text-lg font-extrabold tracking-tight">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h2>
                    <p className="text-sm text-muted-foreground">{vehicle.variant}</p>
                    <p className="mt-2 font-mono text-xs text-muted-foreground">
                      {formatNumber(vehicle.mileage)} km · {vehicle.fuelType} ·{" "}
                      {vehicle.transmission}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <div className="text-left md:text-right">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        Lance atual
                      </p>
                      <p className="text-xl font-extrabold">{formatEUR(auction.currentPrice)}</p>
                    </div>
                    <AuctionTimer endsAt={auction.endsAt} status={auction.status} size="sm" />
                    <div className="flex gap-2">
                      <Link
                        to="/auctions/$id"
                        params={{ id: auction.id }}
                        className="border border-foreground px-3 py-2 text-xs font-bold uppercase hover:bg-foreground hover:text-background"
                      >
                        Ver
                      </Link>
                      <button
                        type="button"
                        onClick={() => void removeAuction(auction.id)}
                        className="border border-primary px-3 py-2 text-xs font-bold uppercase text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      )}
    </div>
  );
}
