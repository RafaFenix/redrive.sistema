import { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import type { Auction } from "@/lib/market-data";
import { getAvailableBrands, getModelsByBrand, buildSearchUrl } from "@/lib/home-helpers";

interface SearchBarProps {
  auctions: Auction[];
}

export function SearchBar({ auctions }: SearchBarProps) {
  const navigate = useNavigate();
  const [selectedMake, setSelectedMake] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");
  const [yearFrom, setYearFrom] = useState("");

  const makes = useMemo(() => getAvailableBrands(auctions), [auctions]);
  const models = useMemo(() => getModelsByBrand(auctions, selectedMake), [auctions, selectedMake]);
  const searchableCount = auctions.length;

  const handleSearch = () => {
    const url = buildSearchUrl(selectedMake, selectedModel, undefined, yearFrom);
    navigate({ to: url });
  };

  const isDisabled = auctions.length === 0;

  return (
    <div className="w-full max-w-5xl">
      {isDisabled ? (
        <p className="rounded-[2rem] border border-border bg-white/90 px-8 py-6 text-center text-muted-foreground shadow-2xl shadow-black/10 backdrop-blur">
          Nenhum leilão disponível no momento. Volte em breve.
        </p>
      ) : (
        <>
          <div className="grid overflow-hidden rounded-[2rem] border border-border/70 bg-white shadow-2xl shadow-black/10 md:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="flex flex-col gap-1 border-b border-border px-6 py-4 md:border-b-0 md:border-r">
              <span className="text-sm font-bold text-foreground">Marca</span>
              <select
                value={selectedMake}
                onChange={(e) => {
                  setSelectedMake(e.target.value);
                  setSelectedModel("all");
                }}
                disabled={isDisabled}
                className="bg-transparent text-sm text-muted-foreground outline-none disabled:opacity-50"
              >
                <option value="all">Todas as marcas</option>
                {makes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 border-b border-border px-6 py-4 md:border-b-0 md:border-r">
              <span className="text-sm font-bold text-foreground">Modelo</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isDisabled || selectedMake === "all"}
                className="bg-transparent text-sm text-muted-foreground outline-none disabled:opacity-50"
              >
                <option value="all">Todos os modelos</option>
                {models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 border-b border-border px-6 py-4 md:border-b-0 md:border-r">
              <span className="text-sm font-bold text-foreground">Ano a partir de</span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Ex: 2020"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                disabled={isDisabled}
                className="bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/70 disabled:opacity-50"
              />
            </label>

            <button
              type="button"
              onClick={handleSearch}
              disabled={isDisabled}
              className="m-2 rounded-[1.6rem] bg-primary px-7 py-4 text-sm font-extrabold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              Procurar {searchableCount} veículos
            </button>
          </div>

          <Link
            to="/auctions"
            className="mt-5 inline-flex items-center gap-2 pl-6 text-sm font-bold text-foreground hover:text-primary"
          >
            <SlidersHorizontal className="size-4" />
            Filtros avançados
          </Link>
        </>
      )}
    </div>
  );
}
