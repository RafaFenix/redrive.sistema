import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  formatNumber,
  listAdminVehicleAuctionLinks,
  listAdminVehicles,
  Vehicle,
} from "@/lib/market-data";
import { ExternalLink, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/vehicles/")({
  head: () => ({ meta: [{ title: "Viaturas — Admin" }] }),
  component: AdminVehicles,
});

function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [auctionLinks, setAuctionLinks] = useState<
    Map<string, { id: string; lotNumber: string; status: string }>
  >(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [makeFilter, setMakeFilter] = useState("all");
  const [modelFilter, setModelFilter] = useState("all");

  const makes = useMemo(
    () => Array.from(new Set(vehicles.map((vehicle) => vehicle.make))).sort(),
    [vehicles],
  );
  const models = useMemo(
    () =>
      Array.from(
        new Set(
          vehicles
            .filter((vehicle) => makeFilter === "all" || vehicle.make === makeFilter)
            .map((vehicle) => vehicle.model),
        ),
      ).sort(),
    [vehicles, makeFilter],
  );
  const filteredVehicles = useMemo(
    () =>
      vehicles.filter((vehicle) => {
        if (statusFilter !== "all" && vehicle.status !== statusFilter) return false;
        if (makeFilter !== "all" && vehicle.make !== makeFilter) return false;
        if (modelFilter !== "all" && vehicle.model !== modelFilter) return false;
        return true;
      }),
    [vehicles, statusFilter, makeFilter, modelFilter],
  );

  useEffect(() => {
    async function loadVehicles() {
      try {
        const [data, links] = await Promise.all([
          listAdminVehicles(),
          listAdminVehicleAuctionLinks(),
        ]);
        setVehicles(data);
        setAuctionLinks(links);
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível carregar viaturas.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadVehicles();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Viaturas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filteredVehicles.length} de {vehicles.length} viaturas no inventário
          </p>
        </div>
        <Link
          to="/admin/vehicles/new"
          className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-3.5" />
          Nova viatura
        </Link>
      </div>

      <div className="mb-6 grid gap-3 border border-border bg-card p-4 md:grid-cols-4">
        <Select
          label="Estado"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "Todos" },
            { value: "draft", label: "Rascunho" },
            { value: "active", label: "Ativas" },
            { value: "sold", label: "Vendidas" },
            { value: "archived", label: "Arquivadas" },
          ]}
        />
        <Select
          label="Marca"
          value={makeFilter}
          onChange={(value) => {
            setMakeFilter(value);
            setModelFilter("all");
          }}
          options={[
            { value: "all", label: "Todas" },
            ...makes.map((make) => ({ value: make, label: make })),
          ]}
        />
        <Select
          label="Modelo"
          value={modelFilter}
          onChange={setModelFilter}
          options={[
            { value: "all", label: "Todos" },
            ...models.map((model) => ({ value: model, label: model })),
          ]}
        />
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setMakeFilter("all");
              setModelFilter("all");
            }}
            className="border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-muted"
          >
            Limpar filtros
          </button>
        </div>
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
              <th className="px-4 py-3">Leilão</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-muted-foreground">
                  A carregar viaturas...
                </td>
              </tr>
            )}
            {filteredVehicles.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="border-b border-border last:border-0 hover:bg-muted/30"
              >
                <td className="px-4 py-3 font-mono text-xs">{vehicle.id}</td>
                <td className="px-4 py-3 font-medium">
                  {vehicle.year} {vehicle.make} {vehicle.model}{" "}
                  <span className="text-muted-foreground">— {vehicle.variant}</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{vehicle.vin}</td>
                <td className="px-4 py-3 font-mono">{formatNumber(vehicle.mileage)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={vehicle.status} />
                </td>
                <td className="px-4 py-3">
                  {auctionLinks.get(vehicle.id) ? (
                    <Link
                      to="/auctions/$id"
                      params={{ id: auctionLinks.get(vehicle.id)!.id }}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-semibold underline-offset-4 hover:underline"
                    >
                      {auctionLinks.get(vehicle.id)!.lotNumber}
                      <ExternalLink className="size-3" />
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">Sem leilão</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to="/admin/vehicles/$id"
                    params={{ id: vehicle.id }}
                    className="text-xs font-semibold underline-offset-4 hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {!isLoading && filteredVehicles.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-muted-foreground">
                  Sem viaturas para estes filtros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
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
    <span
      className={`inline-block rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase ${map[status] ?? "bg-muted"}`}
    >
      {status}
    </span>
  );
}
