import { Clock, Gavel, Info, Car, Euro } from "lucide-react";
import { AuctionTimer } from "@/components/auction/AuctionTimer";
import { Auction, formatNumber } from "@/lib/market-data";

export type AuctionTenderGroup = {
  id: string;
  title: string;
  dateLabel: string;
  closesAt: string;
  auctions: Auction[];
  photoUrls: string[];
  totalBids: number;
  dominantStatus: Auction["status"];
};

interface AuctionTenderListProps {
  auctions: Auction[];
  onOpenTender: (group: AuctionTenderGroup) => void;
}

export function AuctionTenderList({ auctions, onOpenTender }: AuctionTenderListProps) {
  const groupsByDate = buildTenderGroups(auctions);

  if (groupsByDate.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center text-muted-foreground">
        Sem leilões para estes filtros.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupsByDate.map((dateGroup) => (
        <section key={dateGroup.dateKey} className="relative pl-8">
          <div className="absolute left-0 top-0 flex size-9 items-center justify-center rounded-full bg-slate-200 text-slate-500">
            <Clock className="size-5" />
          </div>
          <h2 className="mb-3 text-base font-extrabold uppercase tracking-tight text-slate-500">
            Hora de fecho: {dateGroup.dateLabel}
          </h2>

          <div className="space-y-3">
            {dateGroup.groups.map((group) => (
              <AuctionTenderCard key={group.id} group={group} onOpenTender={onOpenTender} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function AuctionTenderCard({
  group,
  onOpenTender,
}: {
  group: AuctionTenderGroup;
  onOpenTender: (group: AuctionTenderGroup) => void;
}) {
  const visiblePhotos = group.photoUrls.slice(0, 8);
  const hiddenPhotoCount = Math.max(group.photoUrls.length - visiblePhotos.length, 0);
  const statusLabel = statusLabels[group.dominantStatus];
  const tenderDate = new Date(group.closesAt).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-white p-3 shadow-sm transition hover:border-primary/40 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <h3 className="flex flex-wrap items-center gap-2 text-lg font-extrabold leading-tight text-[#20242b]">
            <span className="inline-flex h-4 w-6 overflow-hidden rounded-sm">
              <span className="flex-1 bg-black" />
              <span className="flex-1 bg-yellow-400" />
              <span className="flex-1 bg-red-600" />
            </span>
            {group.title}
            <Info className="size-4 text-primary" />
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="rounded-full bg-muted px-2 py-1">🏁 {tenderDate}</span>
            <span className="rounded-full bg-muted px-2 py-1">
              ⏱ <AuctionTimer endsAt={group.closesAt} status="active" size="sm" />
            </span>
            {group.dominantStatus === "scheduled" && (
              <span className="rounded-full bg-primary px-2 py-1 font-bold text-primary-foreground">
                NEW
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatBubble icon={Gavel} value={formatNumber(group.totalBids)} />
          <StatBubble icon={Car} value={formatNumber(group.auctions.length)} />
          <StatBubble icon={Euro} value={statusLabel} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpenTender(group)}
        className="mt-4 block w-full text-left"
      >
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-8">
          {visiblePhotos.map((photoUrl, index) => {
            const isLastWithMore = index === visiblePhotos.length - 1 && hiddenPhotoCount > 0;
            return (
              <div
                key={`${photoUrl}-${index}`}
                className="relative aspect-[4/3] overflow-hidden rounded-sm bg-muted"
              >
                <img
                  src={photoUrl}
                  alt=""
                  aria-hidden="true"
                  className="size-full object-cover"
                  loading="lazy"
                />
                {isLastWithMore && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55 text-3xl font-extrabold text-white">
                    +{hiddenPhotoCount}
                  </div>
                )}
              </div>
            );
          })}
          {visiblePhotos.length === 0 && (
            <div className="col-span-full flex h-28 items-center justify-center rounded-sm bg-muted text-sm text-muted-foreground">
              Sem fotografias disponíveis
            </div>
          )}
        </div>
      </button>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => onOpenTender(group)}
          className="rounded-full bg-primary px-5 py-2 text-sm font-extrabold text-primary-foreground transition hover:bg-primary/90"
        >
          Ver viaturas
        </button>
      </div>
    </article>
  );
}

function StatBubble({
  icon: Icon,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
}) {
  return (
    <span className="inline-flex min-w-10 items-center justify-center gap-1 rounded-full bg-muted px-2 py-1 text-xs font-extrabold text-slate-600">
      <Icon className="size-4" />
      {value}
    </span>
  );
}

function buildTenderGroups(auctions: Auction[]) {
  const dateBuckets = new Map<string, Auction[]>();

  auctions.forEach((auction) => {
    const dateKey = toDateKey(auction.endsAt);
    const current = dateBuckets.get(dateKey) ?? [];
    current.push(auction);
    dateBuckets.set(dateKey, current);
  });

  return Array.from(dateBuckets.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([dateKey, dayAuctions]) => {
      const sortedDayAuctions = [...dayAuctions].sort(
        (a, b) => +new Date(a.endsAt) - +new Date(b.endsAt),
      );
      const chunks = chunk(sortedDayAuctions, 6);

      return {
        dateKey,
        dateLabel: formatDateHeading(sortedDayAuctions[0].endsAt),
        groups: chunks.map((groupAuctions, index) => {
          const closesAt = groupAuctions
            .map((auction) => auction.endsAt)
            .sort((a, b) => +new Date(a) - +new Date(b))[0];

          return {
            id: `${dateKey}-${index}`,
            title: `Tender: ReDrive ${dateKey}-${String(index + 1).padStart(2, "0")}`,
            dateLabel: formatDateHeading(closesAt),
            closesAt,
            auctions: groupAuctions,
            photoUrls: groupAuctions.flatMap((auction) => auction.vehicle?.photos ?? []),
            totalBids: groupAuctions.reduce((sum, auction) => sum + auction.bidCount, 0),
            dominantStatus: getDominantStatus(groupAuctions),
          };
        }),
      };
    });
}

function toDateKey(value: string) {
  const date = new Date(value);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
}

function formatDateHeading(value: string) {
  return new Date(value)
    .toLocaleDateString("pt-PT", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .toUpperCase();
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function getDominantStatus(auctions: Auction[]): Auction["status"] {
  const counts = auctions.reduce(
    (acc, auction) => {
      acc[auction.status] = (acc[auction.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<Auction["status"], number>,
  );

  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "active") as Auction["status"];
}

const statusLabels: Record<Auction["status"], string> = {
  active: "OPEN",
  scheduled: "NEW",
  ended: "END",
  cancelled: "OFF",
};
