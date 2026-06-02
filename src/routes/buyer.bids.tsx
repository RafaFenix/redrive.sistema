import { createFileRoute, Link } from "@tanstack/react-router";
import { bids, auctions, formatEUR, getVehicle } from "@/lib/mock-data";

export const Route = createFileRoute("/buyer/bids")({
  head: () => ({ meta: [{ title: "Os meus lances — ReDrive" }] }),
  component: BuyerBids,
});

function BuyerBids() {
  const userId = "u-buyer-1";
  const myBids = bids.filter((b) => b.bidderId === userId);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Os meus lances</h1>
      <p className="mt-1 text-sm text-muted-foreground">Histórico completo de licitações.</p>

      <div className="mt-8 border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Lote</th>
              <th className="px-4 py-3">Viatura</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {myBids.map((b) => {
              const a = auctions.find((x) => x.id === b.auctionId);
              const v = a ? getVehicle(a.vehicleId) : undefined;
              if (!a || !v) return null;
              return (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleString("pt-PT")}</td>
                  <td className="px-4 py-3 font-mono text-xs">{a.lotNumber}</td>
                  <td className="px-4 py-3 font-medium">{v.year} {v.make} {v.model}</td>
                  <td className="px-4 py-3 font-mono">{formatEUR(b.amount)}</td>
                  <td className="px-4 py-3">
                    {b.status === "active" && <span className="text-success">A ganhar</span>}
                    {b.status === "outbid" && <span className="text-primary">Superado</span>}
                    {b.status === "won" && <span className="text-success">Vencedor</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link to="/auctions/$id" params={{ id: a.id }} className="text-xs font-semibold underline-offset-4 hover:underline">Ver leilão</Link>
                  </td>
                </tr>
              );
            })}
            {myBids.length === 0 && (
              <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">Ainda não submeteu nenhum lance.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
