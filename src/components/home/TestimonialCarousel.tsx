import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialCard } from "./TestimonialCard";
import { TESTIMONIALS } from "@/lib/home-helpers";

export function TestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

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
      <h2 className="mb-8 text-center text-3xl font-bold">
        O que os nossos clientes dizem sobre nós
      </h2>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-[0_0_calc(100%-24px)] min-w-0 md:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-10px)]"
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>

        {TESTIMONIALS.length > 3 && (
          <>
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
          </>
        )}
      </div>
    </section>
  );
}
