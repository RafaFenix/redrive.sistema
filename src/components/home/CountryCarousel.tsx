import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { POPULAR_COUNTRIES } from "@/lib/home-helpers";

export function CountryCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!emblaApi) return undefined;
    const updateButtons = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    updateButtons();
    emblaApi.on("select", updateButtons);
    return () => {
      emblaApi.off("select", updateButtons);
    };
  }, [emblaApi]);

  return (
    <section className="py-12">
      <h2 className="mb-8 text-3xl font-bold">Melhores leilões de carros por país</h2>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {POPULAR_COUNTRIES.map((country) => (
              <div
                key={country.code}
                className="flex-[0_0_calc(25%-12px)] min-w-0 md:flex-[0_0_calc(14%-12px)]"
              >
                <button
                  onClick={() => navigate({ to: `/auctions?originCountry=${country.code}` })}
                  className="w-full space-y-2 rounded-lg border border-border bg-card p-4 text-center transition hover:shadow-md"
                >
                  <p className="text-4xl">{country.flagEmoji}</p>
                  <p className="text-sm font-semibold text-foreground">{country.label}</p>
                  <p className="text-xs text-muted-foreground">{country.count} leilões</p>
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
