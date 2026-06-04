import type { Auction, Vehicle } from "@/lib/market-data";

// Tipos
export interface BrandStat {
  brand: string;
  count: number;
}

export interface CountryStat {
  code: string;
  label: string;
  flagEmoji: string;
  count: number;
}

export interface Testimonial {
  id: string;
  author: string;
  company?: string;
  quote: string;
  rating: number;
}

// Helpers
export function getTopBrandsByCount(auctions: Auction[], limit: number = 10): BrandStat[] {
  const brandMap = new Map<string, number>();

  auctions.forEach((a) => {
    if (a.vehicle?.make) {
      brandMap.set(a.vehicle.make, (brandMap.get(a.vehicle.make) || 0) + 1);
    }
  });

  return Array.from(brandMap.entries())
    .map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export const POPULAR_COUNTRIES: CountryStat[] = [
  { code: "DE", label: "Alemanha", flagEmoji: "🇩🇪", count: 15 },
  { code: "FR", label: "França", flagEmoji: "🇫🇷", count: 12 },
  { code: "IT", label: "Itália", flagEmoji: "🇮🇹", count: 10 },
  { code: "NL", label: "Holanda", flagEmoji: "🇳🇱", count: 8 },
  { code: "BE", label: "Bélgica", flagEmoji: "🇧🇪", count: 6 },
  { code: "ES", label: "Espanha", flagEmoji: "🇪🇸", count: 5 },
  { code: "CH", label: "Suíça", flagEmoji: "🇨🇭", count: 4 },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    author: "João Silva",
    company: "Auto Peças Lisboa",
    quote:
      "Antes esperávamos semanas, agora compramos em dias. ReDrive é um game-changer para o nosso negócio.",
    rating: 5,
  },
  {
    id: "2",
    author: "Maria Costa",
    company: "Concessionária Porto",
    quote:
      "Leilões em tempo real, documentação perfeita, suporte impecável. Recomendo 100% a qualquer concessionário.",
    rating: 5,
  },
  {
    id: "3",
    author: "Marco Rossi",
    company: "Importadora Itálica",
    quote:
      "Plataforma intuitiva, suporte multilíngue, transparência total. Exactamente o que precisávamos.",
    rating: 5,
  },
  {
    id: "4",
    author: "Anna Mueller",
    quote:
      "Sem surpresas nas taxas, entrega rápida, atendimento de excelência. Voltaremos com certeza.",
    rating: 5,
  },
];

export const BRAND_LOGOS: Record<string, string> = {
  BMW: "https://upload.wikimedia.org/wikipedia/commons/1/18/BMW_logo.svg",
  Porsche: "https://upload.wikimedia.org/wikipedia/commons/5/54/Porsche_logo.svg",
  Volkswagen: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg",
  "Mercedes-Benz": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Mercedes_Benz_logo.svg",
  Audi: "https://upload.wikimedia.org/wikipedia/commons/e/ed/Audi_logo_forward.svg",
  Skoda: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Skoda_logo.svg",
  Seat: "https://upload.wikimedia.org/wikipedia/commons/1/1f/SEAT_logo.svg",
  Fiat: "https://upload.wikimedia.org/wikipedia/commons/9/96/Fiat_logo.png",
  Ford: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Ford_Motor_Company_logo.svg/1024px-Ford_Motor_Company_logo.svg.png",
  Opel: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Opel_logo.svg",
};

export function buildSearchUrl(make?: string, model?: string, maxPrice?: string): string {
  const params = new URLSearchParams();
  if (make && make !== "all") params.set("make", make);
  if (model && model !== "all") params.set("model", model);
  if (maxPrice) params.set("priceMax", maxPrice);
  return `/auctions${params.size > 0 ? `?${params.toString()}` : ""}`;
}

export function getAvailableBrands(auctions: Auction[]): string[] {
  const brands = new Set(
    auctions.map((a) => a.vehicle?.make).filter((v): v is string => Boolean(v)),
  );
  return Array.from(brands).sort();
}

export function getModelsByBrand(auctions: Auction[], make: string): string[] {
  const filtered = make === "all" ? auctions : auctions.filter((a) => a.vehicle?.make === make);
  const models = new Set(
    filtered.map((a) => a.vehicle?.model).filter((v): v is string => Boolean(v)),
  );
  return Array.from(models).sort();
}
