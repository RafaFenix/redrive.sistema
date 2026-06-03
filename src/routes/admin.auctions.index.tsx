import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Auction, formatEUR, listAdminAuctions } from "@/lib/market-data";
import { AuctionTimer } from "@/components/auction/AuctionTimer";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/auctions/")({
  head: () => ({ meta: [{ title: "Leilões — Admin" }] }),
  component: AdminAuctions,
});

function AdminAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuctions() {
      try {
        const data = await listAdminAuctions();
        setAuctions(data);
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível carregar leilões.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadAuctions();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Leilões</h1>
          <p className="mt-1 text-sm text-muted-foreground">{auctions.length} leilões no total</p>
        </div>
        <Link
          to="/admin/auctions/new"
          className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-3.5" />
          Novo leilão
        </Link>
      </div>

      <div className="border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Lote</th>
              <th className="px-4 py-3">Viatura</th>
              <th className="px-4 py-3">Reserva</th>
              <th className="px-4 py-3">Atual</th>
              <th className="px-4 py-3">Lances</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Tempo</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={8} className="p-12 text-center text-muted-foreground">
                  A carregar leilões...
                </td>
              </tr>
            )}
            {auctions.map((a) => {
              const v = a.vehicle;
              if (!v) return null;
              return (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{a.lotNumber}</td>
                  <td className="px-4 py-3 font-medium">
                    {v.year} {v.make} {v.model}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {a.reservePrice ? formatEUR(a.reservePrice) : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono font-bold">{formatEUR(a.currentPrice)}</td>
                  <td className="px-4 py-3 font-mono">{a.bidCount}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3">
                    <AuctionTimer
                      endsAt={a.status === "scheduled" ? a.startsAt : a.endsAt}
                      status={a.status}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to="/admin/auctions/$id"
                      params={{ id: a.id }}
                      className="text-xs font-semibold underline-offset-4 hover:underline"
                    >
                      Detalhe
                    </Link>
                  </td>
                </tr>
              );
            })}
            {!isLoading && auctions.length === 0 && (
              <tr>
                <td colSpan={8} className="p-12 text-center text-muted-foreground">
                  Ainda não existem leilões.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-success/10 text-success",
    scheduled: "bg-warning/10 text-warning",
    ended: "bg-muted text-muted-foreground",
    cancelled: "bg-primary/10 text-primary",
  };
  return (
    <span
      className={`inline-block rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${map[status] ?? "bg-muted"}`}
    >
      {status}
    </span>
  );
}
