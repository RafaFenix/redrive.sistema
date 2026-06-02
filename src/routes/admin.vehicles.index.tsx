import { createFileRoute, Link } from "@tanstack/react-router";
import { vehicles, formatNumber } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/admin/vehicles/")({
  head: () => ({ meta: [{ title: "Viaturas — Admin" }] }),
  component: AdminVehicles,
});

function AdminVehicles() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Viaturas</h1>
          <p className="mt-1 text-sm text-muted-foreground">{vehicles.length} viaturas no inventário</p>
        </div>
        <Link to="/admin/vehicles/new" className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
          <Plus className="size-3.5" />
          Nova viatura
        </Link>
      </div>

      <div className="border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Viatura</th>
              <th className="px-4 py-3">VIN</th>
              <th className="px-4 py-3">KM</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-mono text-xs">{v.id}</td>
                <td className="px-4 py-3 font-medium">{v.year} {v.make} {v.model} <span className="text-muted-foreground">— {v.variant}</span></td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{v.vin}</td>
                <td className="px-4 py-3 font-mono">{formatNumber(v.mileage)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={v.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs font-semibold underline-offset-4 hover:underline">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-success/10 text-success",
    draft: "bg-muted text-muted-foreground",
    sold: "bg-foreground/10 text-foreground",
    archived: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-block rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${map[status] ?? "bg-muted"}`}>
      {status}
    </span>
  );
}
