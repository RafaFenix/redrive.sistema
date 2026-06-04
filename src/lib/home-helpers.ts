import type { Auction } from "@/lib/market-data";

/**
 * Extract unique vehicle makes from auctions, sorted A-Z
 * Example: ["Audi", "BMW", "Mercedes", "Volkswagen"]
 */
export function getAvailableBrands(auctions: Auction[]): string[] {
  const brands = new Set(
    auctions.map((a) => a.vehicle?.make).filter((v): v is string => Boolean(v)),
  );
  return Array.from(brands).sort();
}

/**
 * Extract models for a given make, or all if make="all"
 * Example: getModelsByBrand(auctions, "BMW") → ["M440i", "X3", "X5", "Z4"]
 */
export function getModelsByBrand(auctions: Auction[], make: string): string[] {
  const filtered = make === "all" ? auctions : auctions.filter((a) => a.vehicle?.make === make);
  const models = new Set(
    filtered.map((a) => a.vehicle?.model).filter((v): v is string => Boolean(v)),
  );
  return Array.from(models).sort();
}

/**
 * Build search URL from hero filters
 * Example: buildSearchUrl("BMW", "X5", "50000") → "/auctions?make=BMW&model=X5&priceMax=50000"
 */
export function buildSearchUrl(make?: string, model?: string, maxPrice?: string): string {
  const params = new URLSearchParams();
  if (make && make !== "all") params.set("make", make);
  if (model && model !== "all") params.set("model", model);
  if (maxPrice) params.set("priceMax", maxPrice);
  return `/auctions${params.size > 0 ? `?${params.toString()}` : ""}`;
}
