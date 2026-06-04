import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { Auction } from "@/lib/market-data";
import { getAvailableBrands, getModelsByBrand, buildSearchUrl } from "@/lib/home-helpers";

interface SearchBarProps {
  auctions: Auction[];
}

export function SearchBar({ auctions }: SearchBarProps) {
  const navigate = useNavigate();
  const [selectedMake, setSelectedMake] = useState("all");
  const [selectedModel, setSelectedModel] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");

  const makes = useMemo(() => getAvailableBrands(auctions), [auctions]);
  const models = useMemo(() => getModelsByBrand(auctions, selectedMake), [auctions, selectedMake]);

  const handleSearch = () => {
    const url = buildSearchUrl(selectedMake, selectedModel, maxPrice);
    navigate({ to: url });
  };

  const isDisabled = auctions.length === 0;

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
      {isDisabled ? (
        <p className="py-8 text-center text-muted-foreground">
          Nenhum leilão disponível no momento. Volte em breve.
        </p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Marca</label>
              <select
                value={selectedMake}
                onChange={(e) => {
                  setSelectedMake(e.target.value);
                  setSelectedModel("all");
                }}
                disabled={isDisabled}
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground disabled:opacity-50"
              >
                <option value="all">Todas as marcas</option>
                {makes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Modelo</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isDisabled || selectedMake === "all"}
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground disabled:opacity-50"
              >
                <option value="all">Todos os modelos</option>
                {models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Preço máximo</label>
              <input
                type="number"
                placeholder="Ex: 50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                disabled={isDisabled}
                className="w-full rounded-md border border-border bg-background px-4 py-2 text-foreground disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 md:flex-row">
            <Button
              onClick={handleSearch}
              disabled={isDisabled}
              className="flex-1 bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Procurar Leilões
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/register" })}
              className="flex-1 md:flex-none py-3 border-2"
            >
              Registar Empresa
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
