import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Car,
  ChevronDown,
  Fuel,
  Gauge,
  Gavel,
  Search,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";
import { AuctionTenderList, type AuctionTenderGroup } from "@/components/auction/AuctionTenderList";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { VehicleListItem } from "@/components/vehicle/VehicleListItem";
import { Auction, listPublicAuctions } from "@/lib/market-data";

type CatalogTab = "auctions" | "cars";

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
  const [tab, setTab] = useState<CatalogTab>("auctions");
  const [query, setQuery] = useState("");
  const [auctionType, setAuctionType] = useState("all");
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
    setTab(params.get("tab") === "cars" ? "cars" : "auctions");
    setQuery(params.get("q") || "");
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
    params.set("tab", tab);
    if (query) params.set("q", query);
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

    const nextQuery = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`,
    );
  }, [
    fuel,
    hasCoc,
    immediate,
    kmMax,
    make,
    model,
    priceMax,
    priceMin,
    query,
    searchReady,
    sort,
    status,
    tab,
    transmission,
    yearFrom,
    yearTo,
  ]);

  const makes = useMemo(() => {
    const vehicleMakes = new Set(
      auctions
        .map((auction) => auction.vehicle?.make)
        .filter((value): value is string => Boolean(value)),
    );
    return Array.from(vehicleMakes).sort();
  }, [auctions]);

  const models = useMemo(() => {
    const vehicleModels = new Set(
      auctions
        .filter((auction) => make === "all" || auction.vehicle?.make === make)
        .map((auction) => auction.vehicle?.model)
        .filter((value): value is string => Boolean(value)),
    );
    return Array.from(vehicleModels).sort();
  }, [auctions, make]);

  const fuels = useMemo(() => {
    const fuelTypes = new Set(
      auctions
        .map((auction) => auction.vehicle?.fuelType)
        .filter((value): value is string => Boolean(value)),
    );
    return Array.from(fuelTypes).sort();
  }, [auctions]);

  const transmissions = useMemo(() => {
    const values = new Set(
      auctions
        .map((auction) => auction.vehicle?.transmission)
        .filter((value): value is string => Boolean(value)),
    );
    return Array.from(values).sort();
  }, [auctions]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const yearMin = yearFrom ? Number.parseInt(yearFrom, 10) : null;
    const yearMax = yearTo ? Number.parseInt(yearTo, 10) : null;
    const minimumPrice = priceMin ? Number.parseInt(priceMin, 10) * 100 : null;
    const maximumPrice = priceMax ? Number.parseInt(priceMax, 10) * 100 : null;
    const maximumMileage = kmMax ? Number.parseInt(kmMax, 10) : null;

    const list = auctions.filter((auction) => {
      if (status !== "all" && auction.status !== status) return false;
      if (tab === "auctions" && !matchesAuctionType(auction, auctionType)) return false;

      const vehicle = auction.vehicle;
      if (!vehicle) return false;

      if (normalizedQuery) {
        const haystack = [
          auction.lotNumber,
          vehicle.make,
          vehicle.model,
          vehicle.variant,
          vehicle.year,
          vehicle.fuelType,
          vehicle.transmission,
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(normalizedQuery)) return false;
      }

      if (make !== "all" && vehicle.make !== make) return false;
      if (model !== "all" && vehicle.model !== model) return false;
      if (fuel !== "all" && vehicle.fuelType !== fuel) return false;
      if (transmission !== "all" && vehicle.transmission !== transmission) return false;
      if (yearMin && vehicle.year < yearMin) return false;
      if (yearMax && vehicle.year > yearMax) return false;
      if (minimumPrice && auction.currentPrice < minimumPrice) return false;
      if (maximumPrice && auction.currentPrice > maximumPrice) return false;
      if (maximumMileage && vehicle.mileage > maximumMileage) return false;
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
    auctionType,
    auctions,
    fuel,
    hasCoc,
    immediate,
    kmMax,
    make,
    model,
    priceMax,
    priceMin,
    query,
    sort,
    status,
    tab,
    transmission,
    yearFrom,
    yearTo,
  ]);

  function clearFilters() {
    setQuery("");
    setAuctionType("all");
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

  function openTender(group: AuctionTenderGroup) {
    setTab("cars");
    setQuery(group.auctions[0]?.lotNumber ?? "");
  }

  return (
    <div className="min-h-screen bg-[#f2f4f7]">
      <PublicHeader />

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[300px_1fr] lg:px-6">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <div className="border-b border-border p-4">
              <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-tight text-[#20242b]">
                <Search className="size-5" />
                Procurar
              </h2>
              <div className="mt-3 grid grid-cols-2 rounded-xl bg-muted p-1 text-sm font-bold">
                <TabButton active={tab === "auctions"} onClick={() => setTab("auctions")}>
                  Leilões
                </TabButton>
                <TabButton active={tab === "cars"} onClick={() => setTab("cars")}>
                  Carro
                </TabButton>
              </div>
              <label className="mt-3 flex items-center gap-2 rounded-full border border-border px-3 py-2">
                <Search className="size-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Lote, marca, modelo, versão..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                />
              </label>
            </div>

            <div className="space-y-2 p-3">
              {tab === "auctions" ? (
                <AuctionFilters
                  auctions={auctions}
                  filteredCount={filtered.length}
                  auctionType={auctionType}
                  setAuctionType={setAuctionType}
                />
              ) : (
                <CarFilters
                  makes={makes}
                  models={models}
                  fuels={fuels}
                  transmissions={transmissions}
                  make={make}
                  setMake={setMake}
                  model={model}
                  setModel={setModel}
                  fuel={fuel}
                  setFuel={setFuel}
                  transmission={transmission}
                  setTransmission={setTransmission}
                  status={status}
                  setStatus={setStatus}
                  yearFrom={yearFrom}
                  setYearFrom={setYearFrom}
                  yearTo={yearTo}
                  setYearTo={setYearTo}
                  priceMin={priceMin}
                  setPriceMin={setPriceMin}
                  priceMax={priceMax}
                  setPriceMax={setPriceMax}
                  kmMax={kmMax}
                  setKmMax={setKmMax}
                  hasCoc={hasCoc}
                  setHasCoc={setHasCoc}
                  immediate={immediate}
                  setImmediate={setImmediate}
                />
              )}
            </div>

            <div className="border-t border-border p-3">
              <button
                type="button"
                className="w-full rounded-full bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground transition hover:bg-primary/90"
              >
                Mostrar {filtered.length} {tab === "auctions" ? "leilões" : "veículos"}
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 w-full text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                Reset filter
              </button>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-4 rounded-xl bg-[#f2f4f7] pb-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-xl font-extrabold uppercase tracking-tight text-[#20242b]">
                  {tab === "auctions"
                    ? `Resumo do leilão (${filtered.length} veículos)`
                    : `Resultados da pesquisa (${filtered.length} veículos)`}
                </h1>
                <div className="mt-2 h-0.5 w-full max-w-4xl bg-primary" />
              </div>
              <Select
                label="Ordenar"
                value={sort}
                onChange={setSort}
                options={[
                  { value: "ending", label: "Tempo restante" },
                  { value: "price-asc", label: "Preço (↑)" },
                  { value: "price-desc", label: "Preço (↓)" },
                  { value: "year-desc", label: "Ano (mais novo)" },
                  { value: "km-asc", label: "Quilometragem (↑)" },
                ]}
              />
            </div>
          </div>

          {tab === "auctions" ? (
            <AuctionTenderList auctions={filtered} onOpenTender={openTender} />
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-white p-12 text-center text-muted-foreground">
              Sem resultados para estes filtros.
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((auction) => (
                <VehicleListItem key={auction.id} auction={auction} vehicle={auction.vehicle} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function matchesAuctionType(auction: Auction, auctionType: string) {
  if (auctionType === "all") return true;
  if (auctionType === "fixed") return auction.buyNowPrice !== null;
  if (auctionType === "open") return auction.mode !== "blind" && auction.status === "active";
  if (auctionType === "blind") return auction.mode === "blind";
  if (auctionType === "buy-now") return auction.buyNowPrice !== null;
  return true;
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active ? "rounded-lg bg-white py-2 text-[#20242b] shadow-sm" : "py-2 text-muted-foreground"
      }
    >
      {children}
    </button>
  );
}

function AuctionFilters({
  auctions,
  filteredCount,
  auctionType,
  setAuctionType,
}: {
  auctions: Auction[];
  filteredCount: number;
  auctionType: string;
  setAuctionType: (value: string) => void;
}) {
  return (
    <>
      <FilterGroup icon={Gavel} title="Tipo de leilão">
        <AuctionTypeOption
          label="Todos"
          count={auctions.length}
          checked={auctionType === "all"}
          onClick={() => setAuctionType("all")}
        />
        <AuctionTypeOption
          label="Preços fixos"
          count={auctions.filter((auction) => auction.buyNowPrice !== null).length}
          checked={auctionType === "fixed"}
          onClick={() => setAuctionType("fixed")}
        />
        <AuctionTypeOption
          label="Leilão aberto"
          count={
            auctions.filter((auction) => auction.mode !== "blind" && auction.status === "active")
              .length
          }
          checked={auctionType === "open"}
          onClick={() => setAuctionType("open")}
        />
        <AuctionTypeOption
          label="Leilões às cegas"
          count={auctions.filter((auction) => auction.mode === "blind").length}
          checked={auctionType === "blind"}
          onClick={() => setAuctionType("blind")}
        />
        <AuctionTypeOption
          label="Aposte ou Compre Agora"
          count={auctions.filter((auction) => auction.buyNowPrice !== null).length}
          checked={auctionType === "buy-now"}
          onClick={() => setAuctionType("buy-now")}
        />
      </FilterGroup>

      <FilterGroup icon={Car} title="País">
        <DisabledFilter label="Bélgica" count={0} />
        <DisabledFilter label="Países Baixos" count={0} />
        <DisabledFilter label="França" count={0} />
        <DisabledFilter label="Luxemburgo" count={0} />
        <DisabledFilter label="Itália" count={0} />
        <DisabledFilter label="Alemanha" count={0} />
        <DisabledFilter label="Espanha" count={0} />
      </FilterGroup>

      <FilterGroup icon={Car} title="Tipo de carroceria">
        <DisabledFilter label="Veículos pessoais" count={filteredCount} />
        <DisabledFilter label="Veículos comerciais ligeiros" count={0} />
      </FilterGroup>
    </>
  );
}

function CarFilters({
  makes,
  models,
  fuels,
  transmissions,
  make,
  setMake,
  model,
  setModel,
  fuel,
  setFuel,
  transmission,
  setTransmission,
  status,
  setStatus,
  yearFrom,
  setYearFrom,
  yearTo,
  setYearTo,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  kmMax,
  setKmMax,
  hasCoc,
  setHasCoc,
  immediate,
  setImmediate,
}: {
  makes: string[];
  models: string[];
  fuels: string[];
  transmissions: string[];
  make: string;
  setMake: (value: string) => void;
  model: string;
  setModel: (value: string) => void;
  fuel: string;
  setFuel: (value: string) => void;
  transmission: string;
  setTransmission: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  yearFrom: string;
  setYearFrom: (value: string) => void;
  yearTo: string;
  setYearTo: (value: string) => void;
  priceMin: string;
  setPriceMin: (value: string) => void;
  priceMax: string;
  setPriceMax: (value: string) => void;
  kmMax: string;
  setKmMax: (value: string) => void;
  hasCoc: boolean;
  setHasCoc: (value: boolean) => void;
  immediate: boolean;
  setImmediate: (value: boolean) => void;
}) {
  return (
    <>
      <FilterGroup icon={Car} title="Estado">
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
      </FilterGroup>

      <FilterGroup icon={SlidersHorizontal} title="Marca e modelo">
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
      </FilterGroup>

      <FilterGroup icon={Fuel} title="Combustível">
        <Select
          label="Combustível"
          value={fuel}
          onChange={setFuel}
          options={[
            { value: "all", label: "Todos" },
            ...fuels.map((fuelType) => ({ value: fuelType, label: fuelType })),
          ]}
        />
      </FilterGroup>

      <FilterGroup icon={CalendarDays} title="Primeiro registo">
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="Desde" value={yearFrom} onChange={setYearFrom} placeholder="2020" />
          <NumberField label="Até" value={yearTo} onChange={setYearTo} placeholder="2024" />
        </div>
      </FilterGroup>

      <FilterGroup icon={Zap} title="Mudanças">
        <Select
          label="Transmissão"
          value={transmission}
          onChange={setTransmission}
          options={[
            { value: "all", label: "Todas" },
            ...transmissions.map((value) => ({ value, label: value })),
          ]}
        />
      </FilterGroup>

      <FilterGroup icon={Gauge} title="Quilometragem">
        <NumberField label="Km máximo" value={kmMax} onChange={setKmMax} placeholder="150000" />
      </FilterGroup>

      <FilterGroup icon={Sparkles} title="Preço">
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="Mínimo" value={priceMin} onChange={setPriceMin} placeholder="10000" />
          <NumberField label="Máximo" value={priceMax} onChange={setPriceMax} placeholder="50000" />
        </div>
      </FilterGroup>

      <FilterGroup icon={Sparkles} title="Documentos e entrega">
        <ToggleField label="COC disponível" checked={hasCoc} onChange={setHasCoc} />
        <ToggleField label="Disponível imediatamente" checked={immediate} onChange={setImmediate} />
      </FilterGroup>
    </>
  );
}

function AuctionTypeOption({
  label,
  count,
  checked,
  onClick,
}: {
  label: string;
  count: number;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-left text-sm transition hover:bg-primary/5"
    >
      <span className="flex items-center gap-2">
        <span
          className={
            checked
              ? "size-4 rounded border border-primary bg-primary"
              : "size-4 rounded border border-primary"
          }
        />
        {label}
      </span>
      <span className="rounded bg-muted px-1.5 text-xs font-extrabold text-slate-600">{count}</span>
    </button>
  );
}

function DisabledFilter({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-white px-3 py-2 text-sm text-muted-foreground opacity-60">
      <span className="flex items-center gap-2">
        <span className="size-4 rounded border border-primary/60" />
        {label}
      </span>
      <span className="rounded bg-muted px-1.5 text-xs font-extrabold text-slate-600">{count}</span>
    </div>
  );
}

function FilterGroup({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-muted/60">
      <div className="flex items-center justify-between gap-2 px-3 py-3 font-bold text-[#20242b]">
        <span className="flex items-center gap-2">
          <Icon className="size-4 text-slate-400" />
          {title}
        </span>
        <ChevronDown className="size-4 text-slate-500" />
      </div>
      <div className="space-y-2 border-t border-white/80 px-3 pb-3 pt-2">{children}</div>
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
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
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
      <span className="sr-only">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
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
    <label className="flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="font-semibold text-muted-foreground">{label}</span>
    </label>
  );
}
