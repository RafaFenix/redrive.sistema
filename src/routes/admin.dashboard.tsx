import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  Auction,
  formatEUR,
  listAdminAuctions,
} from "@/lib/market-data";
import { getSupabaseClient } from "@/lib/supabase/client";
import { AuctionTimer } from "@/components/auction/AuctionTimer";
import { ErrorState } from "@/components/system/ErrorState";
import { useRealtimeStatus } from "@/hooks/use-realtime-status";
import {
  Gavel,
  Users,
  Handshake,
  Car,
  Activity,
  Radio,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard — ReDrive" }] }),
  component: AdminDashboard,
});

interface DashboardData {
  auctions: Auction[];
  pendingUsers: number;
  openNegotiations: number;
  bidsLast24h: number;
  ordersPendingPayment: number;
}

function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseClient();
      const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const [
        auctionsData,
        { count: pendingCount, error: pendingError },
        { count: negotiationsCount, error: negotiationsError },
        { count: bidsCount, error: bidsError },
        { count: ordersCount, error: ordersError },
      ] = await Promise.all([
        listAdminAuctions(),
        supabase
          .from("profiles")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("negotiations")
          .select("id", { count: "exact", head: true })
          .eq("status", "open"),
        supabase
          .from("bids")
          .select("id", { count: "exact", head: true })
          .gte("created_at", since24h),
        supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending_payment"),
      ]);

      if (pendingError) throw pendingError;
      if (negotiationsError) throw negotiationsError;
      if (bidsError) throw bidsError;
      if (ordersError) throw ordersError;

      setData({
        auctions: auctionsData,
        pendingUsers: pendingCount ?? 0,
        openNegotiations: negotiationsCount ?? 0,
        bidsLast24h: bidsCount ?? 0,
        ordersPendingPayment: ordersCount ?? 0,
      });
    } catch (err) {
      console.error("[admin/dashboard] load failed", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const realtime = useRealtimeStatus("admin-dashboard-health");

  if (isLoading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8 text-sm text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" /> A carregar dashboard…
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-8">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Dashboard</h1>
        <ErrorState
          title="Não foi possível carregar o dashboard."
          error={error}
          onRetry={() => void loadDashboard()}
        />
      </div>
    );
  }

  const auctions = data?.auctions ?? [];
  const active = auctions.filter((a) => a.status === "active");
  const scheduled = auctions.filter((a) => a.status === "scheduled");
  const endingSoon = active
    .filter((a) => new Date(a.endsAt).getTime() - Date.now() < 60 * 60 * 1000)
    .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime());
  const nextToClose = [...active].sort(
    (a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime(),
  )[0];
  const endedToday = auctions.filter((a) => {
    if (a.status !== "ended") return false;
    return Date.now() - new Date(a.endsAt).getTime() < 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Operações
          </span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Dashboard</h1>
        </div>
        <button
          type="button"
          onClick={() => void loadDashboard()}
          className="border border-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-foreground hover:text-background disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "A atualizar…" : "Atualizar"}
        </button>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorState
            title="Falha parcial ao atualizar (a mostrar últimos dados)."
            error={error}
            onRetry={() => void loadDashboard()}
            variant="inline"
          />
        </div>
      )}

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <KPI icon={Gavel} label="Leilões ativos" value={active.length} accent="text-primary" />
        <KPI icon={Car} label="Terminados hoje" value={endedToday} />
        <KPI
          icon={Users}
          label="Registos pendentes"
          value={data?.pendingUsers ?? 0}
          accent={(data?.pendingUsers ?? 0) > 0 ? "text-warning" : ""}
        />
        <KPI icon={Handshake} label="Negociações abertas" value={data?.openNegotiations ?? 0} />
      </div>

      {/* System status */}
      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="size-4 text-muted-foreground" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Estado do motor
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <StatusCard
            icon={Radio}
            label="Realtime"
            status={
              realtime.status === "connected"
                ? "ok"
                : realtime.status === "connecting"
                  ? "pending"
                  : "error"
            }
            primary={
              realtime.status === "connected"
                ? "Ligado"
                : realtime.status === "connecting"
                  ? "A ligar…"
                  : realtime.status === "closed"
                    ? "Fechado"
                    : "Erro"
            }
            secondary={
              realtime.lastEventAt
                ? `Último evento ${formatRelative(realtime.lastEventAt)}`
                : "Sem eventos ainda"
            }
            error={realtime.lastError}
          />
          <StatusCard
            icon={Clock}
            label="Próximo leilão a fechar"
            status={nextToClose ? "ok" : "idle"}
            primary={
              nextToClose
                ? `Lote ${nextToClose.lotNumber}`
                : "Sem leilões ativos"
            }
            secondary={
              nextToClose ? (
                <AuctionTimer endsAt={nextToClose.endsAt} status={nextToClose.status} size="sm" />
              ) : (
                "—"
              )
            }
          />
          <StatusCard
            icon={Gavel}
            label="Atividade últimas 24h"
            status={(data?.bidsLast24h ?? 0) > 0 ? "ok" : "idle"}
            primary={`${data?.bidsLast24h ?? 0} lances`}
            secondary={`${scheduled.length} agendados · ${data?.ordersPendingPayment ?? 0} orders por pagar`}
          />
        </div>

        {endingSoon.length > 0 && (
          <div className="mt-4 rounded-sm border border-warning/40 bg-warning/5 p-4 text-sm">
            <p className="font-bold">
              {endingSoon.length} {endingSoon.length === 1 ? "leilão termina" : "leilões terminam"}{" "}
              na próxima hora
            </p>
            <ul className="mt-2 space-y-1 font-mono text-xs">
              {endingSoon.slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-center justify-between">
                  <span>
                    {a.lotNumber} — {a.vehicle?.make} {a.vehicle?.model}
                  </span>
                  <AuctionTimer endsAt={a.endsAt} status={a.status} size="sm" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Active auctions */}
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Leilões em curso
          </h2>
          <Link
            to="/admin/auctions"
            className="text-xs font-semibold underline-offset-4 hover:underline"
          >
            Ver todos →
          </Link>
        </div>
        <div className="border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Lote</th>
                <th className="px-4 py-3">Viatura</th>
                <th className="px-4 py-3">Lance atual</th>
                <th className="px-4 py-3">Reserva</th>
                <th className="px-4 py-3">Lances</th>
                <th className="px-4 py-3">Termina em</th>
              </tr>
            </thead>
            <tbody>
              {active.slice(0, 8).map((a) => {
                const v = a.vehicle;
                if (!v) return null;
                return (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link
                        to="/admin/auctions/$id"
                        params={{ id: a.id }}
                        className="hover:text-primary"
                      >
                        {a.lotNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {v.year} {v.make} {v.model}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold">{formatEUR(a.currentPrice)}</td>
                    <td className="px-4 py-3">
                      <span className={a.reserveMet ? "text-success" : "text-primary"}>
                        {a.reserveMet ? "● Atingida" : "● Não"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">{a.bidCount}</td>
                    <td className="px-4 py-3">
                      <AuctionTimer endsAt={a.endsAt} status={a.status} size="sm" />
                    </td>
                  </tr>
                );
              })}
              {active.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-muted-foreground">
                    Sem leilões ativos neste momento.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
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
        <Icon className={`size-4 ${accent || "text-muted-foreground"}`} />
      </div>
      <div className={`mt-2 text-3xl font-extrabold tracking-tight ${accent ?? ""}`}>{value}</div>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  label,
  status,
  primary,
  secondary,
  error,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  status: "ok" | "pending" | "error" | "idle";
  primary: React.ReactNode;
  secondary: React.ReactNode;
  error?: string | null;
}) {
  const dot =
    status === "ok"
      ? "bg-success"
      : status === "pending"
        ? "bg-warning animate-pulse"
        : status === "error"
          ? "bg-destructive"
          : "bg-muted-foreground/40";

  const StatusIcon =
    status === "ok" ? CheckCircle2 : status === "error" ? AlertTriangle : Icon;

  const iconColor =
    status === "ok"
      ? "text-success"
      : status === "error"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${dot}`} aria-hidden />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
        </div>
        <StatusIcon className={`size-4 ${iconColor}`} />
      </div>
      <div className="mt-2 text-xl font-extrabold tracking-tight">{primary}</div>
      <div className="mt-1 text-xs text-muted-foreground">{secondary}</div>
      {error && (
        <p className="mt-2 break-words font-mono text-[10px] text-destructive">{error}</p>
      )}
    </div>
  );
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 5_000) return "agora mesmo";
  if (diff < 60_000) return `há ${Math.round(diff / 1000)}s`;
  if (diff < 3_600_000) return `há ${Math.round(diff / 60_000)}m`;
  return `há ${Math.round(diff / 3_600_000)}h`;
}
