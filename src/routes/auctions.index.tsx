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
  const [make, setMake] = useState("all");
  const [model, setModel] = useState("all");
  const [fuel, setFuel] = useState("all");
  const [transmission, setTransmission] = useState("all");
  const [status, setStatus] = useState("active");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [kmMax, setKmMax] = useState("");
  const [hasCoc, setHasCoc] = useState(false);
  const [immediate, setImmediate] = useState(false);
  const [sort, setSort] = useState("ending");
  const [searchReady, setSearchReady] = useState(false);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setStatus(params.get("status") || "active");
    setMake(params.get("make") || "all");
    setModel(params.get("model") || "all");
    setFuel(params.get("fuel") || "all");
    setTransmission(params.get("transmission") || "all");
    setYearFrom(params.get("yearFrom") || "");
    setYearTo(params.get("yearTo") || "");
    setPriceMin(params.get("priceMin") || "");
    setPriceMax(params.get("priceMax") || "");
    setKmMax(params.get("kmMax") || "");
    setHasCoc(params.get("coc") === "1");
    setImmediate(params.get("immediate") === "1");
    setSort(params.get("sort") || "ending");
    setSearchReady(true);
  }, []);

  useEffect(() => {
    if (!searchReady) return;

    const params = new URLSearchParams();
    if (status !== "active") params.set("status", status);
    if (make !== "all") params.set("make", make);
    if (model !== "all") params.set("model", model);
    if (fuel !== "all") params.set("fuel", fuel);
    if (transmission !== "all") params.set("transmission", transmission);
    if (yearFrom) params.set("yearFrom", yearFrom);
    if (yearTo) params.set("yearTo", yearTo);
    if (priceMin) params.set("priceMin", priceMin);
    if (priceMax) params.set("priceMax", priceMax);
    if (kmMax) params.set("kmMax", kmMax);
    if (hasCoc) params.set("coc", "1");
    if (immediate) params.set("immediate", "1");
    if (sort !== "ending") params.set("sort", sort);

    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }, [
    fuel,
    hasCoc,
    immediate,
    kmMax,
    make,
    model,
    priceMax,
    priceMin,
    searchReady,
    sort,
    status,
    transmission,
    yearFrom,
    yearTo,
  ]);

  const makes = useMemo(() => {
    const vehicleMakes = new Set(
      auctions.map((auction) => auction.vehicle?.make).filter((v): v is string => Boolean(v)),
    );
    return Array.from(vehicleMakes).sort();
  }, [auctions]);

  const models = useMemo(() => {
    const vehicleModels = new Set(
      auctions
        .filter((auction) => make === "all" || auction.vehicle?.make === make)
        .map((auction) => auction.vehicle?.model)
        .filter((v): v is string => Boolean(v)),
    );
    return Array.from(vehicleModels).sort();
  }, [auctions, make]);

  const fuels = useMemo(() => {
    const fuelTypes = new Set(
      auctions.map((auction) => auction.vehicle?.fuelType).filter((v): v is string => Boolean(v)),
    );
    return Array.from(fuelTypes).sort();
  }, [auctions]);

  const transmissions = useMemo(() => {
    const values = new Set(
      auctions
        .map((auction) => auction.vehicle?.transmission)
        .filter((v): v is string => Boolean(v)),
    );
    return Array.from(values).sort();
  }, [auctions]);

  const filtered = useMemo(() => {
    const yFrom = yearFrom ? Number.parseInt(yearFrom, 10) : null;
    const yTo = yearTo ? Number.parseInt(yearTo, 10) : null;
    const pMin = priceMin ? Number.parseInt(priceMin, 10) * 100 : null;
    const pMax = priceMax ? Number.parseInt(priceMax, 10) * 100 : null;
    const kMax = kmMax ? Number.parseInt(kmMax, 10) : null;

    const list = auctions.filter((auction) => {
      if (status !== "all" && auction.status !== status) return false;
      const vehicle = auction.vehicle;
      if (!vehicle) return false;
      if (make !== "all" && vehicle.make !== make) return false;
      if (model !== "all" && vehicle.model !== model) return false;
      if (fuel !== "all" && vehicle.fuelType !== fuel) return false;
      if (transmission !== "all" && vehicle.transmission !== transmission) return false;
      if (yFrom && vehicle.year < yFrom) return false;
      if (yTo && vehicle.year > yTo) return false;
      if (pMin && auction.currentPrice < pMin) return false;
      if (pMax && auction.currentPrice > pMax) return false;
      if (kMax && vehicle.mileage > kMax) return false;
      if (hasCoc && !vehicle.hasCoc) return false;
      if (immediate && (vehicle.leadTimeDays ?? 0) > 0) return false;
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
  }, [
    auctions,
    fuel,
    hasCoc,
    immediate,
    kmMax,
    make,
    model,
    priceMax,
    priceMin,
    sort,
    status,
    transmission,
    yearFrom,
    yearTo,
  ]);

  function clearFilters() {
    setMake("all");
    setModel("all");
    setFuel("all");
    setTransmission("all");
    setStatus("active");
    setYearFrom("");
    setYearTo("");
    setPriceMin("");
    setPriceMax("");
    setKmMax("");
    setHasCoc(false);
    setImmediate(false);
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
            onChange={(value) => {
              setMake(value);
              setModel("all");
            }}
            options={[
              { value: "all", label: "Todas" },
              ...makes.map((m) => ({ value: m, label: m })),
            ]}
          />
          <Select
            label="Modelo"
            value={model}
            onChange={setModel}
            options={[
              { value: "all", label: "Todos" },
              ...models.map((m) => ({ value: m, label: m })),
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
            label="Transmissão"
            value={transmission}
            onChange={setTransmission}
            options={[
              { value: "all", label: "Todas" },
              ...transmissions.map((value) => ({ value, label: value })),
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
          <NumberField
            label="Ano desde"
            value={yearFrom}
            onChange={setYearFrom}
            placeholder="2015"
          />
          <NumberField label="Ano até" value={yearTo} onChange={setYearTo} placeholder="2024" />
          <NumberField
            label="Preço mínimo (€)"
            value={priceMin}
            onChange={setPriceMin}
            placeholder="10000"
          />
          <NumberField
            label="Preço máximo (€)"
            value={priceMax}
            onChange={setPriceMax}
            placeholder="50000"
          />
          <NumberField label="Km máximo" value={kmMax} onChange={setKmMax} placeholder="150000" />
          <ToggleField label="COC disponível" checked={hasCoc} onChange={setHasCoc} />
          <ToggleField
            label="Disponível imediatamente"
            checked={immediate}
            onChange={setImmediate}
          />
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
            {filtered.map((auction) => (
              <VehicleCard key={auction.id} auction={auction} vehicle={auction.vehicle} />
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

function NumberField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 border border-border bg-background px-3 py-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </label>
  );
}
