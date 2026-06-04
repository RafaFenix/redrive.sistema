import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import type { Auction } from "@/lib/market-data";

interface VehicleGridSectionProps {
  auctions: Auction[];
}

export function VehicleGridSection({ auctions }: VehicleGridSectionProps) {
  const navigate = useNavigate();
  const featured = auctions.filter((a) => a.status === "active").slice(0, 6);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Carros adicionados recentemente</h2>
        <Button variant="outline" onClick={() => navigate({ to: "/auctions" })}>
          Ver todos →
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((auction) => (
          <VehicleCard key={auction.id} auction={auction} vehicle={auction.vehicle} />
        ))}
      </div>
    </section>
  );
}
