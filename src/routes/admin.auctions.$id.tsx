import { createFileRoute, notFound, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  cancelAuction,
  euroToCents,
  formatEUR,
  getAdminAuction,
  listAuctionWatchers,
  openAuctionNegotiation,
  parseBidIncrements,
  type AuctionWatcher,
} from "@/lib/market-data";
import { getSupabaseClient } from "@/lib/supabase/client";
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
  const [isEditing, setIsEditing] = useState(false);
  const [watchers, setWatchers] = useState<AuctionWatcher[]>([]);

  useEffect(() => {
    listAuctionWatchers(auction.id)
      .then(setWatchers)
      .catch((error) => {
        console.error(error);
        setWatchers([]);
      });
  }, [auction.id]);

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

  async function handleOpenNegotiation(bidderId: string, fallbackAmount: number) {
    const value = window.prompt(
      "Oferta inicial para negociação (€):",
      String(Math.round(fallbackAmount / 100)),
    );
    if (value === null) return;

    const amount = euroToCents(value);
    if (!amount) {
      toast.error("Introduza uma proposta válida.");
      return;
    }

    const message = window.prompt("Mensagem para o comprador (opcional):") ?? undefined;

    try {
      await openAuctionNegotiation({
        auctionId: auction.id,
        buyerId: bidderId,
        amount,
        message,
      });
      toast.success("Negociação aberta.");
      await router.invalidate();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível abrir a negociação.", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  }

  async function handleUpdateAuction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (auction.status !== "scheduled") {
      toast.error("Só é possível editar leilões agendados.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const startingPrice = euroToCents(formData.get("starting_price"));
    const reservePrice = euroToCents(formData.get("reserve_price"));
    const startsAt = String(formData.get("starts_at") ?? "");
    const endsAt = String(formData.get("ends_at") ?? "");

    if (!startingPrice || !reservePrice || !startsAt || !endsAt) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("auctions")
        .update({
          lot_number: String(formData.get("lot_number") ?? "").trim() || auction.lotNumber,
          status: String(formData.get("status") ?? "scheduled"),
          mode: String(formData.get("mode") ?? "standard"),
          starting_price: startingPrice,
          reserve_price: reservePrice,
          buy_now_price: euroToCents(formData.get("buy_now_price")),
          current_price: startingPrice,
          bid_increments: parseBidIncrements(formData.get("bid_increments")),
          starts_at: new Date(startsAt).toISOString(),
          ends_at: new Date(endsAt).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", auction.id);

      if (error) throw error;

      toast.success("Leilão atualizado.");
      setIsEditing(false);
      await router.invalidate();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar o leilão.");
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
          <button
            onClick={() => setIsEditing((current) => !current)}
            disabled={auction.status !== "scheduled"}
            className="border border-border px-3 py-2 text-xs font-bold uppercase hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
          >
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

      {isEditing && auction.status === "scheduled" && (
        <form
          onSubmit={(event) => void handleUpdateAuction(event)}
          className="mb-6 max-w-3xl space-y-4 border border-border bg-card p-5"
        >
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Editar leilão agendado
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Lote" name="lot_number" defaultValue={auction.lotNumber} />
            <Field
              label="Preço inicial (€)"
              name="starting_price"
              type="number"
              defaultValue={String(auction.startingPrice / 100)}
              required
            />
            <Field
              label="Preço de reserva (€)"
              name="reserve_price"
              type="number"
              defaultValue={String((auction.reservePrice ?? 0) / 100)}
              required
            />
            <Field
              label="Comprar Já (€)"
              name="buy_now_price"
              type="number"
              defaultValue={auction.buyNowPrice ? String(auction.buyNowPrice / 100) : ""}
            />
            <Field
              label="Início"
              name="starts_at"
              type="datetime-local"
              defaultValue={toDateTimeLocal(auction.startsAt)}
              required
            />
            <Field
              label="Fim"
              name="ends_at"
              type="datetime-local"
              defaultValue={toDateTimeLocal(auction.endsAt)}
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Estado
              </span>
              <select
                name="status"
                defaultValue={auction.status}
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
              >
                <option value="scheduled">Agendado</option>
                <option value="active">Ativo</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Modo
              </span>
              <select
                name="mode"
                defaultValue={auction.mode ?? "standard"}
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
              >
                <option value="standard">Standard</option>
                <option value="blind">Blind</option>
              </select>
            </label>
          </div>
          <Field
            label="Incrementos (cêntimos, separados por vírgula)"
            name="bid_increments"
            defaultValue={auction.bidIncrements.join(", ")}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
            >
              Guardar alterações
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="border border-border px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-muted"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

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
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {bidList.map((b: (typeof bidList)[number]) => (
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
                    <td className="py-2 text-right">
                      <button
                        onClick={() => void handleOpenNegotiation(b.bidderId, b.amount)}
                        className="text-[10px] font-bold uppercase text-primary underline-offset-4 hover:underline"
                      >
                        Negociar
                      </button>
                    </td>
                  </tr>
                ))}
                {bidList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
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
          <div className="border border-border bg-card p-4">
            <h3 className="mb-3 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Watchlist ({watchers.length})
            </h3>
            {watchers.length ? (
              <ul className="divide-y divide-border text-sm">
                {watchers.map((watcher) => (
                  <li key={watcher.id} className="py-2">
                    <p className="font-medium">{watcher.companyName}</p>
                    <p className="text-xs text-muted-foreground">
                      {watcher.contactName || "Sem contacto"} ·{" "}
                      {new Date(watcher.createdAt).toLocaleString("pt-PT")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Sem buyers a observar este leilão.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
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

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}
