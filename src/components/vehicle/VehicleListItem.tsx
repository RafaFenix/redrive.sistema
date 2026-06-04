import { Link } from "@tanstack/react-router";
import { CalendarDays, Car, Cloud, FileCheck2, Gauge, Settings, Zap } from "lucide-react";
import { AuctionTimer } from "@/components/auction/AuctionTimer";
import { ReserveIndicator } from "@/components/auction/ReserveIndicator";
import { Auction, Vehicle, formatEUR, formatNumber } from "@/lib/market-data";

interface Props {
  auction: Auction;
  vehicle?: Vehicle;
}

export function VehicleListItem({ auction, vehicle }: Props) {
  const v = vehicle ?? auction.vehicle;
  if (!v) return null;

  const mainPhoto = v.photos[0];
  const title = `${v.year} ${v.make} ${v.model}${v.variant ? ` / ${v.variant}` : ""}`;

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:border-primary/50 hover:shadow-md">
      <div className="grid gap-4 p-3 md:grid-cols-[200px_1fr_220px] md:p-4">
        <Link to="/auctions/$id" params={{ id: auction.id }} className="block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted md:aspect-[1.35]">
            {mainPhoto ? (
              <img
                src={mainPhoto}
                alt={`${v.make} ${v.model}`}
                className="size-full object-cover transition duration-500 hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                Sem foto
              </div>
            )}
            <span className="absolute left-2 top-2 rounded-sm bg-white/95 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-foreground">
              {auction.lotNumber}
            </span>
            <span className="absolute bottom-2 left-2 rounded-sm bg-primary px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              {auction.status === "scheduled"
                ? "Em breve"
                : auction.status === "ended"
                  ? "Terminado"
                  : "Ao vivo"}
            </span>
          </div>
        </Link>

        <div className="min-w-0">
          <Link to="/auctions/$id" params={{ id: auction.id }} className="group">
            <h3 className="line-clamp-2 text-base font-extrabold uppercase leading-snug text-[#20242b] group-hover:text-primary">
              {title}
            </h3>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              #{auction.lotNumber} · {v.make} {v.model}
            </p>
          </Link>

          <div className="mt-4 grid gap-x-6 gap-y-3 border-b border-border pb-4 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
            <Spec icon={CalendarDays} label={`${v.year}`} />
            <Spec icon={Settings} label={v.transmission} />
            <Spec icon={Gauge} label={`${formatNumber(v.mileage)} km`} />
            <Spec icon={Car} label={`${v.fuelType}${v.powerCv ? `, ${v.powerCv} cv` : ""}`} />
            <Spec icon={Zap} label={v.condition || "Verificada"} />
            <Spec
              icon={Cloud}
              label={
                typeof v.leadTimeDays === "number"
                  ? v.leadTimeDays > 0
                    ? `${v.leadTimeDays} dias entrega`
                    : "Disponível"
                  : "Entrega estimada"
              }
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold">
            {v.hasCoc && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-success">
                <FileCheck2 className="size-3.5" />
                COC disponível
              </span>
            )}
            {v.hasDamageReport && (
              <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                Relatório disponível
              </span>
            )}
            <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
              {v.doors} portas · {v.color}
            </span>
          </div>
        </div>

        <aside className="flex flex-col justify-between gap-4 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-4 md:pt-0">
          <div className="text-left md:text-right">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {auction.status === "scheduled" ? "Inicia" : "Tempo restante"}
            </div>
            <div className="mt-1 font-mono text-base font-extrabold text-[#20242b]">
              <AuctionTimer
                endsAt={auction.status === "scheduled" ? auction.startsAt : auction.endsAt}
                status={auction.status}
                size="sm"
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {new Date(
                auction.status === "scheduled" ? auction.startsAt : auction.endsAt,
              ).toLocaleString("pt-PT", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg bg-muted/60 p-3 md:text-right">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Lance atual
              </div>
              <div className="text-2xl font-extrabold tracking-tight text-[#20242b]">
                {formatEUR(auction.currentPrice)}
              </div>
            </div>
            <ReserveIndicator reserveMet={auction.reserveMet} />
            <Link
              to="/auctions/$id"
              params={{ id: auction.id }}
              className="block rounded-full bg-primary px-5 py-3 text-center text-sm font-extrabold text-primary-foreground transition hover:bg-primary/90"
            >
              Aceder para comprar
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}

function Spec({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <Icon className="size-4 shrink-0 text-slate-400" />
      <span className="truncate">{label}</span>
    </span>
  );
}
