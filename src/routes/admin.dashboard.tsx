import { createFileRoute, Link } from "@tanstack/react-router";
import { auctions, profiles, negotiations, formatEUR, getVehicle } from "@/lib/mock-data";
import { AuctionTimer } from "@/components/auction/AuctionTimer";
import { Gavel, Users, Handshake, Car } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard — ReDrive" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const activeAuctions = auctions.filter((a) => a.status === "active");
  const endedToday = auctions.filter((a) => {
    const end = new Date(a.endsAt).getTime();
    return a.status === "ended" && Date.now() - end < 24 * 60 * 60 * 1000;
  }).length;
  const pendingUsers = profiles.filter((p) => p.status === "pending").length;
  const openNegotiations = negotiations.filter((n) => n.status === "open").length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Operações
        </span>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KPI icon={Gavel} label="Leilões ativos" value={activeAuctions.length} accent="text-primary" />
        <KPI icon={Car} label="Terminados hoje" value={endedToday} />
        <KPI icon={Users} label="Registos pendentes" value={pendingUsers} accent={pendingUsers > 0 ? "text-warning" : ""} />
        <KPI icon={Handshake} label="Negociações abertas" value={openNegotiations} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Leilões em curso
          </h2>
          <Link to="/admin/auctions" className="text-xs font-semibold underline-offset-4 hover:underline">
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
              {activeAuctions.map((a) => {
                const v = getVehicle(a.vehicleId);
                if (!v) return null;
                return (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link to="/admin/auctions/$id" params={{ id: a.id }} className="hover:text-primary">
                        {a.lotNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium">{v.year} {v.make} {v.model}</td>
                    <td className="px-4 py-3 font-mono font-bold">{formatEUR(a.currentPrice)}</td>
                    <td className="px-4 py-3">
                      <span className={a.reserveMet ? "text-success" : "text-primary"}>
                        {a.reserveMet ? "● Atingida" : "● Não"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">{a.bidCount}</td>
                    <td className="px-4 py-3"><AuctionTimer endsAt={a.endsAt} status={a.status} size="sm" /></td>
                  </tr>
                );
              })}
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
        <Icon className={`size-4 ${accent || "text-muted-foreground"}`} />
      </div>
      <div className={`mt-2 text-3xl font-extrabold tracking-tight ${accent ?? ""}`}>{value}</div>
    </div>
  );
}
