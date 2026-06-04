import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import type { Auction } from "@/lib/market-data";
import { getTopBrandsByCount } from "@/lib/home-helpers";

interface BrandCarouselProps {
  auctions: Auction[];
}

export function BrandCarousel({ auctions }: BrandCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const navigate = useNavigate();

  const brands = getTopBrandsByCount(auctions, 10);

  useEffect(() => {
    if (!emblaApi) return;
    const updateButtons = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    updateButtons();
    emblaApi.on("select", updateButtons);
    return () => emblaApi.off("select", updateButtons);
  }, [emblaApi]);

  if (brands.length === 0) return null;

  return (
    <section className="py-12">
      <h2 className="mb-8 text-3xl font-bold">Comprar os melhores carros por marca</h2>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {brands.map((brand) => (
              <div
                key={brand.brand}
                className="flex-[0_0_calc(25%-12px)] min-w-0 md:flex-[0_0_calc(20%-12px)]"
              >
                <button
                  onClick={() => navigate({ to: `/auctions?make=${brand.brand}` })}
                  className="w-full space-y-2 rounded-lg border border-border bg-card p-6 text-center transition hover:shadow-md"
                >
                  <p className="text-lg font-semibold text-foreground">{brand.brand}</p>
                  <p className="text-sm text-muted-foreground">{brand.count} leilões</p>
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          className="absolute -left-12 top-1/2 -translate-y-1/2 disabled:opacity-30"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          className="absolute -right-12 top-1/2 -translate-y-1/2 disabled:opacity-30"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}
