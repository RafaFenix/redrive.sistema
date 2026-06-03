import { createFileRoute, notFound, Link, useRouter } from "@tanstack/react-router";
import { cancelAuction, formatEUR, getAdminAuction } from "@/lib/market-data";
import { BidHistory } from "@/components/auction/BidHistory";
import { AuctionTimer } from "@/components/auction/AuctionTimer";
import { ReserveIndicator } from "@/components/auction/ReserveIndicator";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/auctions/$id")({
  loader: async ({ params }) => {
    const auctionData = await getAdminAuction(params.id);
    if (!auctionData) throw notFound();
    return auctionData;
  },
  head: () => ({ meta: [{ title: "Detalhe leilão — Admin" }] }),
  component: AdminAuctionDetail,
  errorComponent: ({ error }) => <div className="p-12">{error.message}</div>,
  notFoundComponent: () => <div className="p-12">Leilão não encontrado.</div>,
});

function AdminAuctionDetail() {
  const router = useRouter();
  const { auction, vehicle, bids: bidList } = Route.useLoaderData();

  async function handleCancelAuction() {
    if (!window.confirm("Cancelar este leilão? Esta ação remove-o do catálogo público.")) return;

    try {
      await cancelAuction(auction.id);
      toast.success("Leilão cancelado.");
      await router.invalidate();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível cancelar o leilão.");
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <Link to="/admin/auctions" className="hover:text-foreground">
          Leilões
        </Link>
        <span>/</span>
        <span className="text-foreground">{auction.lotNumber}</span>
      </div>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {vehicle.variant} · VIN {vehicle.vin ?? "—"}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="border border-border px-3 py-2 text-xs font-bold uppercase hover:bg-muted">
            Editar
          </button>
          <button
            onClick={() => void handleCancelAuction()}
            disabled={auction.status === "cancelled" || auction.status === "ended"}
            className="border border-primary px-3 py-2 text-xs font-bold uppercase text-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar leilão
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Live panel */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Metric label="Estado" value={auction.status} />
            <Metric
              label="Reserva (oculta)"
              value={auction.reservePrice ? formatEUR(auction.reservePrice) : "—"}
              accent
            />
            <Metric label="Atual" value={formatEUR(auction.currentPrice)} />
            <Metric
              label="Tempo"
              value={<AuctionTimer endsAt={auction.endsAt} status={auction.status} size="md" />}
            />
          </div>

          <div className="border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Lances ({bidList.length})
              </h3>
              <ReserveIndicator reserveMet={auction.reserveMet} />
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="py-2">Hora</th>
                  <th className="py-2">Empresa</th>
                  <th className="py-2">Valor</th>
                  <th className="py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {bidList.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0">
                    <td className="py-2 font-mono text-xs text-muted-foreground">
                      {new Date(b.createdAt).toLocaleTimeString("pt-PT")}
                    </td>
                    <td className="py-2 font-medium">{b.bidderHint}</td>
                    <td className="py-2 font-mono font-bold">{formatEUR(b.amount)}</td>
                    <td className="py-2 text-xs">
                      <span
                        className={b.status === "active" ? "text-success" : "text-muted-foreground"}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {bidList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground">
                      Sem lances ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="border border-border bg-card p-4">
            <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Resumo
            </h3>
            <dl className="space-y-2 text-sm">
              <Row label="Inicial" value={formatEUR(auction.startingPrice)} />
              <Row
                label="Buy Now"
                value={auction.buyNowPrice ? formatEUR(auction.buyNowPrice) : "—"}
              />
              <Row label="Lances" value={auction.bidCount.toString()} />
              <Row label="Visualizações" value={auction.viewerCount.toString()} />
            </dl>
          </div>
          <BidHistory bids={bidList} showIdentity />
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="border border-border bg-card p-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className={`mt-1 text-xl font-extrabold tracking-tight ${accent ? "text-primary" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border pb-1 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-mono font-medium">{value}</dd>
    </div>
  );
}
