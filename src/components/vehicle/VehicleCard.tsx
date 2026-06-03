import { Link } from "@tanstack/react-router";
import { Auction, Vehicle, formatEUR, formatNumber } from "@/lib/market-data";
import { AuctionTimer } from "@/components/auction/AuctionTimer";
import { ReserveIndicator } from "@/components/auction/ReserveIndicator";
import { WatchlistButton } from "@/components/auction/WatchlistButton";

interface Props {
  auction: Auction;
  vehicle?: Vehicle;
}

export function VehicleCard({ auction, vehicle }: Props) {
  const v = vehicle ?? auction.vehicle;
  if (!v) return null;

  return (
    <article className="group relative overflow-hidden rounded-sm border border-border bg-card transition-all hover:border-foreground hover:shadow-[4px_4px_0px_0px_var(--color-foreground)]">
      <Link to="/auctions/$id" params={{ id: auction.id }} className="block">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={v.photos[0]}
            alt={`${v.make} ${v.model}`}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2">
            <span className="rounded-sm bg-background/90 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur">
              {auction.lotNumber}
            </span>
          </div>
          <div className="absolute right-12 top-2">
            <span className="rounded-sm bg-foreground/90 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-background backdrop-blur">
              {auction.status === "scheduled"
                ? "Em breve"
                : auction.status === "ended"
                  ? "Terminado"
                  : "Ao vivo"}
            </span>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div>
            <h3 className="truncate text-base font-bold leading-tight">
              {v.year} {v.make} {v.model}
            </h3>
            <p className="truncate text-xs text-muted-foreground">{v.variant}</p>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
            <span>{formatNumber(v.mileage)} km</span>
            <span>·</span>
            <span>{v.fuelType}</span>
            <span>·</span>
            <span>{v.transmission.split(" ")[0]}</span>
          </div>

          <div className="flex items-end justify-between border-t border-border pt-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Lance atual
              </span>
              <div className="text-lg font-extrabold tracking-tight">
                {formatEUR(auction.currentPrice)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {auction.status === "scheduled" ? "Inicia" : "Termina"}
              </span>
              <div>
                <AuctionTimer
                  endsAt={auction.status === "scheduled" ? auction.startsAt : auction.endsAt}
                  status={auction.status}
                  size="sm"
                />
              </div>
            </div>
          </div>

          <ReserveIndicator reserveMet={auction.reserveMet} />
        </div>
      </Link>
      <div className="absolute right-2 top-2 z-10">
        <WatchlistButton auctionId={auction.id} />
      </div>
    </article>
  );
}
