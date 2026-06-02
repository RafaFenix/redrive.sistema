import { Bid, formatEUR, getProfile } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface Props {
  bids: Bid[];
  showIdentity?: boolean; // admin view
  className?: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function BidHistory({ bids, showIdentity = false, className }: Props) {
  if (bids.length === 0) {
    return (
      <div className={cn("rounded-sm border border-border bg-card p-4 shadow-sm", className)}>
        <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Histórico de lances
        </h4>
        <p className="py-4 text-center text-xs text-muted-foreground">Sem lances ainda.</p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-sm border border-border bg-card p-4 shadow-sm", className)}>
      <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Histórico de lances
      </h4>
      <div className="space-y-3">
        {bids.slice(0, 8).map((b, i) => {
          const identity = showIdentity ? getProfile(b.bidderId)?.companyName ?? b.bidderHint : b.bidderHint;
          return (
            <div
              key={b.id}
              className={cn(
                "flex items-center justify-between gap-3 font-mono text-xs",
                i === 0 && "animate-slide-up",
                i > 0 && "opacity-60",
              )}
            >
              <span className={cn("flex-1 truncate font-medium", i === 0 && "text-primary")}>
                {identity}
              </span>
              <span className="font-bold">{formatEUR(b.amount)}</span>
              <span className="text-[10px] text-muted-foreground">{formatTime(b.createdAt)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
