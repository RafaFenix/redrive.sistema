import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { VehicleGallery } from "@/components/vehicle/VehicleGallery";
import { BidPanel } from "@/components/auction/BidPanel";
import { BidHistory } from "@/components/auction/BidHistory";
import { formatEUR, formatNumber, getPublicAuction } from "@/lib/market-data";
import { FileText, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/auctions/$id")({
  loader: async ({ params }) => {
    const auctionData = await getPublicAuction(params.id);
    if (!auctionData) throw notFound();
    return auctionData;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          {
            title: `${loaderData.vehicle.year} ${loaderData.vehicle.make} ${loaderData.vehicle.model} — ReDrive`,
          },
          {
            name: "description",
            content: `Leilão do lote ${loaderData.auction.lotNumber}: ${loaderData.vehicle.make} ${loaderData.vehicle.model} ${loaderData.vehicle.variant}, ${formatNumber(loaderData.vehicle.mileage)} km.`,
          },
          {
            property: "og:title",
            content: `${loaderData.vehicle.make} ${loaderData.vehicle.model} — Leilão ReDrive`,
          },
          { property: "og:image", content: loaderData.vehicle.photos[0] },
        ]
      : [],
  }),
  component: AuctionDetail,
  errorComponent: ({ error }) => (
    <div className="p-12 text-center text-sm text-muted-foreground">Erro: {error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="p-12 text-center text-sm text-muted-foreground">Leilão não encontrado.</div>
  ),
});

function AuctionDetail() {
  const router = useRouter();
  const { auction, vehicle, bids } = Route.useLoaderData();
  const hasDamageReport = vehicle.damageReportUrl !== "#";

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Breadcrumb + Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Leilões ativos</span>
            <span>/</span>
            <span className="text-foreground">Lote {auction.lotNumber}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-balance">
              {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.variant}
            </h1>
            <div className="flex gap-2">
              {hasDamageReport && (
                <span className="inline-flex items-center gap-1.5 border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-bold uppercase text-primary">
                  <AlertTriangle className="size-3" />
                  Relatório de danos disponível
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left */}
          <div className="space-y-6 lg:col-span-8">
            <VehicleGallery photos={vehicle.photos} alt={`${vehicle.make} ${vehicle.model}`} />

            {/* Specs */}
            <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-6 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Especificações técnicas
              </h3>
              <div className="grid grid-cols-2 gap-y-6 md:grid-cols-4">
                <Spec label="Quilometragem" value={`${formatNumber(vehicle.mileage)} km`} />
                <Spec label="Combustível" value={vehicle.fuelType} />
                <Spec label="Transmissão" value={vehicle.transmission} />
                <Spec label="Cor exterior" value={vehicle.color} />
                <Spec label="Potência" value={vehicle.power} />
                <Spec label="Portas" value={vehicle.doors.toString()} />
                <Spec label="Ano" value={vehicle.year.toString()} />
                <Spec label="Estado geral" value={vehicle.condition} />
              </div>
            </div>

            {/* Description */}
            <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Descrição
              </h3>
              <p className="text-sm leading-relaxed text-foreground">{vehicle.description}</p>
            </div>

            {/* Damage report */}
            {hasDamageReport && (
              <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      Relatório de danos
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Inspeção certificada de 150 pontos · PDF
                    </p>
                  </div>
                  <a
                    href={vehicle.damageReportUrl}
                    className="inline-flex items-center gap-2 border border-foreground px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-foreground hover:text-background"
                  >
                    <FileText className="size-3.5" />
                    Ver PDF
                  </a>
                </div>
              </div>
            )}

            {/* Additional services */}
            {vehicle.additionalServices.length > 0 && (
              <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Serviços adicionais (opcional)
                </h3>
                <ul className="divide-y divide-border">
                  {vehicle.additionalServices.map((s: { name: string; price: number }) => (
                    <li key={s.name} className="flex items-center justify-between py-3 text-sm">
                      <span className="font-medium">{s.name}</span>
                      <span className="font-mono font-bold">{formatEUR(s.price)}</span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between py-3 text-sm">
                    <span className="font-medium">Legalização</span>
                    <span className="font-mono font-bold">
                      {formatEUR(vehicle.legalizationCost)}
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Right — sticky bid panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 space-y-4">
              <BidPanel auction={auction} onBidPlaced={() => router.invalidate()} />
              <BidHistory bids={bids} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase text-muted-foreground">{label}</span>
      <span className="font-mono text-sm font-medium">{value}</span>
    </div>
  );
}
