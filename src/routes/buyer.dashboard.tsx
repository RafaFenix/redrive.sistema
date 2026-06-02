import { createFileRoute, Link } from "@tanstack/react-router";
import { auctions, bids, formatEUR, getVehicle } from "@/lib/mock-data";
import { AuctionTimer } from "@/components/auction/AuctionTimer";
import { Gavel, Trophy, Handshake, Eye } from "lucide-react";

export const Route = createFileRoute("/buyer/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ReDrive" }] }),
  component: BuyerDashboard,
});

function BuyerDashboard() {
  const userId = "u-buyer-1";
  const myBids = bids.filter((b) => b.bidderId === userId);
  const activeBids = myBids.filter((b) => b.status === "active");
  const wonAuctions = auctions.filter((a) => a.winnerId === userId);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Auto Marques Lda · Aprovado
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Olá, João</h1>
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
        <KPI icon={Trophy} label="Leilões ganhos" value={wonAuctions.length} accent="text-success" />
        <KPI icon={Handshake} label="Em negociação" value={1} />
        <KPI icon={Eye} label="A observar" value={4} />
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
              {activeBids.map((b) => {
                const a = auctions.find((x) => x.id === b.auctionId);
                const v = a ? getVehicle(a.vehicleId) : undefined;
                if (!a || !v) return null;
                const isWinning = a.currentPrice === b.amount;
                return (
                  <tr key={b.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{a.lotNumber}</td>
                    <td className="px-4 py-3 font-medium">{v.year} {v.make} {v.model}</td>
                    <td className="px-4 py-3 font-mono">{formatEUR(b.amount)}</td>
                    <td className="px-4 py-3 font-mono font-bold">{formatEUR(a.currentPrice)}</td>
                    <td className="px-4 py-3"><AuctionTimer endsAt={a.endsAt} status={a.status} size="sm" /></td>
                    <td className="px-4 py-3">
                      <span className={isWinning ? "text-success" : "text-primary"}>
                        {isWinning ? "● A ganhar" : "● Superado"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {activeBids.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Sem lances ativos.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; accent?: string }) {
  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        <Icon className={`size-4 ${accent ?? "text-muted-foreground"}`} />
      </div>
      <div className="mt-2 text-3xl font-extrabold tracking-tight">{value}</div>
    </div>
  );
}
