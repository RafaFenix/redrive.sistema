import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { auctions, getVehicle } from "@/lib/mock-data";

export const Route = createFileRoute("/auctions/")({
  head: () => ({
    meta: [
      { title: "Leilões ativos — ReDrive" },
      { name: "description", content: "Veja todas as viaturas em leilão na ReDrive: BMW, Mercedes, Audi, VW e mais." },
    ],
  }),
  component: AuctionsList,
});

function AuctionsList() {
  const [make, setMake] = useState<string>("all");
  const [fuel, setFuel] = useState<string>("all");
  const [status, setStatus] = useState<string>("active");

  const makes = useMemo(() => {
    const s = new Set<string>();
    auctions.forEach((a) => {
      const v = getVehicle(a.vehicleId);
      if (v) s.add(v.make);
    });
    return Array.from(s).sort();
  }, []);

  const filtered = auctions.filter((a) => {
    if (status !== "all" && a.status !== status) return false;
    const v = getVehicle(a.vehicleId);
    if (!v) return false;
    if (make !== "all" && v.make !== make) return false;
    if (fuel !== "all" && v.fuelType !== fuel) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
              Catálogo
            </span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Leilões ativos</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "lote disponível" : "lotes disponíveis"}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-2 gap-3 border border-border bg-card p-4 md:grid-cols-4">
          <Select label="Estado" value={status} onChange={setStatus} options={[
            { value: "all", label: "Todos" },
            { value: "active", label: "Ao vivo" },
            { value: "scheduled", label: "Em breve" },
            { value: "ended", label: "Terminados" },
          ]} />
          <Select label="Marca" value={make} onChange={setMake} options={[
            { value: "all", label: "Todas" },
            ...makes.map((m) => ({ value: m, label: m })),
          ]} />
          <Select label="Combustível" value={fuel} onChange={setFuel} options={[
            { value: "all", label: "Todos" },
            { value: "Gasolina", label: "Gasolina" },
            { value: "Gasóleo", label: "Gasóleo" },
            { value: "Elétrico", label: "Elétrico" },
            { value: "Híbrido", label: "Híbrido" },
          ]} />
          <div className="flex items-end">
            <button
              onClick={() => { setMake("all"); setFuel("all"); setStatus("active"); }}
              className="w-full border border-border py-2 text-xs font-bold uppercase tracking-wider hover:bg-muted"
            >
              Limpar filtros
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
            Sem resultados para estes filtros.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <VehicleCard key={a.id} auction={a} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
