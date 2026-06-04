import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { Auction, listPublicAuctions } from "@/lib/market-data";

export const Route = createFileRoute("/auctions/")({
  head: () => ({
    meta: [
      { title: "Leilões ativos — ReDrive" },
      {
        name: "description",
        content: "Veja todas as viaturas em leilão na ReDrive: BMW, Mercedes, Audi, VW e mais.",
      },
    ],
  }),
  component: AuctionsList,
});

function AuctionsList() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [make, setMake] = useState<string>("all");
  const [fuel, setFuel] = useState<string>("all");
  const [status, setStatus] = useState<string>("active");
  const [yearFrom, setYearFrom] = useState<string>("");
  const [yearTo, setYearTo] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [kmMax, setKmMax] = useState<string>("");
  const [sort, setSort] = useState<string>("ending");

  useEffect(() => {
    async function loadAuctions() {
      try {
        const data = await listPublicAuctions();
        setAuctions(data);
      } catch (error) {
        console.error("Failed to load public auctions catalog", error);
      }
    }

    void loadAuctions();
  }, []);

  const makes = useMemo(() => {
    const vehicleMakes = new Set(
      auctions.map((auction) => auction.vehicle?.make).filter((v): v is string => Boolean(v)),
    );
    return Array.from(vehicleMakes).sort();
  }, [auctions]);

  const fuels = useMemo(() => {
    const fuelTypes = new Set(
      auctions.map((auction) => auction.vehicle?.fuelType).filter((v): v is string => Boolean(v)),
    );
    return Array.from(fuelTypes).sort();
  }, [auctions]);

  const filtered = useMemo(() => {
    const yFrom = yearFrom ? Number.parseInt(yearFrom, 10) : null;
    const yTo = yearTo ? Number.parseInt(yearTo, 10) : null;
    const pMax = priceMax ? Number.parseInt(priceMax, 10) * 100 : null;
    const kMax = kmMax ? Number.parseInt(kmMax, 10) : null;

    const list = auctions.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      const v = a.vehicle;
      if (!v) return false;
      if (make !== "all" && v.make !== make) return false;
      if (fuel !== "all" && v.fuelType !== fuel) return false;
      if (yFrom && v.year < yFrom) return false;
      if (yTo && v.year > yTo) return false;
      if (pMax && a.currentPrice > pMax) return false;
      if (kMax && v.mileage > kMax) return false;
      return true;
    });

    const sorted = [...list];
    if (sort === "ending") sorted.sort((a, b) => +new Date(a.endsAt) - +new Date(b.endsAt));
    else if (sort === "price-asc") sorted.sort((a, b) => a.currentPrice - b.currentPrice);
    else if (sort === "price-desc") sorted.sort((a, b) => b.currentPrice - a.currentPrice);
    else if (sort === "year-desc")
      sorted.sort((a, b) => (b.vehicle?.year ?? 0) - (a.vehicle?.year ?? 0));
    else if (sort === "km-asc")
      sorted.sort((a, b) => (a.vehicle?.mileage ?? 0) - (b.vehicle?.mileage ?? 0));
    return sorted;
  }, [auctions, status, make, fuel, yearFrom, yearTo, priceMax, kmMax, sort]);

  function clearFilters() {
    setMake("all");
    setFuel("all");
    setStatus("active");
    setYearFrom("");
    setYearTo("");
    setPriceMax("");
    setKmMax("");
    setSort("ending");
  }

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
        <div className="mb-8 grid gap-3 border border-border bg-card p-4 md:grid-cols-4">
          <Select
            label="Estado"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "Todos" },
              { value: "active", label: "Ao vivo" },
              { value: "scheduled", label: "Em breve" },
              { value: "ended", label: "Terminados" },
            ]}
          />
          <Select
            label="Marca"
            value={make}
            onChange={setMake}
            options={[
              { value: "all", label: "Todas" },
              ...makes.map((m) => ({ value: m, label: m })),
            ]}
          />
          <Select
            label="Combustível"
            value={fuel}
            onChange={setFuel}
            options={[
              { value: "all", label: "Todos" },
              ...fuels.map((fuelType) => ({ value: fuelType, label: fuelType })),
            ]}
          />
          <Select
            label="Ordenar por"
            value={sort}
            onChange={setSort}
            options={[
              { value: "ending", label: "A terminar" },
              { value: "price-asc", label: "Preço (↑)" },
              { value: "price-desc", label: "Preço (↓)" },
              { value: "year-desc", label: "Ano (mais novo)" },
              { value: "km-asc", label: "Quilometragem (↑)" },
            ]}
          />
          <NumberField label="Ano desde" value={yearFrom} onChange={setYearFrom} placeholder="2015" />
          <NumberField label="Ano até" value={yearTo} onChange={setYearTo} placeholder="2024" />
          <NumberField
            label="Preço máximo (€)"
            value={priceMax}
            onChange={setPriceMax}
            placeholder="50000"
          />
          <NumberField label="Km máximo" value={kmMax} onChange={setKmMax} placeholder="150000" />
          <div className="flex items-end md:col-span-4">
            <button
              onClick={clearFilters}
              className="border border-border px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-muted"
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
              <VehicleCard key={a.id} auction={a} vehicle={a.vehicle} />
            ))}
          </div>
        )}
      </main>
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
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}
