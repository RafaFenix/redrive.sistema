import type { Auction, Vehicle } from "@/lib/market-data";

export interface Testimonial {
  id: string;
  author: string;
  company?: string;
  quote: string;
  rating: number;
}

// Helpers
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
