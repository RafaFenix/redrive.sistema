import { SearchBar } from "./SearchBar";
import type { Auction } from "@/lib/market-data";

interface HeroSectionProps {
  auctions: Auction[];
}

export function HeroSection({ auctions }: HeroSectionProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold leading-tight md:text-6xl">
          Leilão de automóveis <span className="text-primary">importados.</span>
        </h1>
        <p className="max-w-2xl text-xl text-muted-foreground">
          Em tempo real. Sem intermediários.
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-block rounded-full border border-border px-3 py-1">
            B2B · Apenas empresas aprovadas
          </span>
        </div>
      </div>

      <SearchBar auctions={auctions} />
    </div>
  );
}
