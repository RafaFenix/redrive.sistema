import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BuyerBid,
  getWatchlistAuctionIds,
  formatEUR,
  listBuyerBids,
  listBuyerNegotiations,
  listBuyerOrders,
} from "@/lib/market-data";
import { AuctionTimer } from "@/components/auction/AuctionTimer";
import { Gavel, Trophy, Handshake, Eye } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/buyer/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ReDrive" }] }),
  component: BuyerDashboard,
});

function BuyerDashboard() {
  const [myBids, setMyBids] = useState<BuyerBid[]>([]);
  const [wonCount, setWonCount] = useState(0);
  const [negotiationCount, setNegotiationCount] = useState(0);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBids() {
      try {
        const [bids, orders, negotiations, watchlist] = await Promise.all([
          listBuyerBids(),
          listBuyerOrders(),
          listBuyerNegotiations(),
          getWatchlistAuctionIds(),
        ]);

        setMyBids(bids);
        setWonCount(orders.length);
        setNegotiationCount(
          negotiations.filter((negotiation) => negotiation.status === "open").length,
        );
        setWatchlistCount(watchlist.size);
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível carregar o dashboard.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadBids();
  }, []);

  const activeBids = myBids.filter((bid) => bid.status === "active");
  const visibleActiveBids = activeBids.slice(0, 8);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Conta aprovada
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Dashboard</h1>
        </div>
        <Link
          to="/auctions"
          className="bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
        >
          Ver leilões ao vivo
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KPI icon={Gavel} label="Lances ativos" value={activeBids.length} accent="text-primary" />
        <KPI icon={Trophy} label="Leilões ganhos" value={wonCount} accent="text-success" />
        <KPI icon={Handshake} label="Em negociação" value={negotiationCount} />
        <KPI icon={Eye} label="A observar" value={watchlistCount} />
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Os meus leilões ativos
        </h2>
        <div className="border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Lote</th>
                <th className="px-4 py-3">Viatura</th>
                <th className="px-4 py-3">O meu lance</th>
                <th className="px-4 py-3">Lance atual</th>
                <th className="px-4 py-3">Termina</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    A carregar lances...
                  </td>
                </tr>
              )}
              {!isLoading &&
                visibleActiveBids.map((b) => {
                  const a = b.auction;
                  const v = a?.vehicle;
                  if (!a || !v) return null;
                  const isWinning = a.currentPrice === b.amount;
                  return (
                    <tr key={b.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-mono text-xs">{a.lotNumber}</td>
                      <td className="px-4 py-3 font-medium">
                        {v.year} {v.make} {v.model}
                      </td>
                      <td className="px-4 py-3 font-mono">{formatEUR(b.amount)}</td>
                      <td className="px-4 py-3 font-mono font-bold">{formatEUR(a.currentPrice)}</td>
                      <td className="px-4 py-3">
                        <AuctionTimer endsAt={a.endsAt} status={a.status} size="sm" />
                      </td>
                      <td className="px-4 py-3">
                        <span className={isWinning ? "text-success" : "text-primary"}>
                          {isWinning ? "● A ganhar" : "● Superado"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              {!isLoading && visibleActiveBids.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    Sem lances ativos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPI({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <Icon className={`size-4 ${accent ?? "text-muted-foreground"}`} />
      </div>
      <div className="mt-2 text-3xl font-extrabold tracking-tight">{value}</div>
    </div>
  );
}
