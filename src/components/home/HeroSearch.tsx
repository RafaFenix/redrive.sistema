import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import type { Auction } from "@/lib/market-data";
import { getAvailableBrands, getModelsByBrand, buildSearchUrl } from "@/lib/home-helpers";

interface HeroSearchProps {
  auctions: Auction[];
}

export function HeroSearch({ auctions }: HeroSearchProps) {
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
    <div className="space-y-8">
      {/* Hero Headline */}
      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Leilão de automóveis <span className="text-primary">importados.</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Em tempo real. Sem intermediários.
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-block px-3 py-1 border border-border rounded-sm">
            Plataforma B2B · Apenas empresas aprovadas
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-card rounded-sm border border-border shadow-sm p-6 space-y-4">
        {auctions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhum leilão disponível no momento. Volte em breve.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Make Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Marca</label>
                <select
                  value={selectedMake}
                  onChange={(e) => {
                    setSelectedMake(e.target.value);
                    setSelectedModel("all");
                  }}
                  disabled={isDisabled}
                  className="w-full px-4 py-2 border border-border rounded-sm bg-card text-foreground disabled:opacity-50"
                >
                  <option value="all">Todas as marcas</option>
                  {makes.map((make) => (
                    <option key={make} value={make}>
                      {make}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model Dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Modelo</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={isDisabled || selectedMake === "all"}
                  className="w-full px-4 py-2 border border-border rounded-sm bg-card text-foreground disabled:opacity-50"
                >
                  <option value="all">Todos os modelos</option>
                  {models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              {/* Max Price Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Preço máximo</label>
                <input
                  type="number"
                  placeholder="Ex: 50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  disabled={isDisabled}
                  className="w-full px-4 py-2 border border-border rounded-sm bg-card text-foreground disabled:opacity-50"
                />
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col md:flex-row gap-4 pt-4">
              <button
                onClick={handleSearch}
                disabled={isDisabled}
                className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-primary-foreground font-bold py-3 px-6 rounded-sm transition-colors disabled:opacity-50"
              >
                Procurar Leilões
              </button>
              <button
                onClick={() => navigate({ to: "/register" })}
                className="flex-1 md:flex-none border-2 border-foreground hover:bg-foreground hover:text-background text-foreground font-bold py-3 px-6 rounded-sm transition-colors"
              >
                Registar Empresa
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
