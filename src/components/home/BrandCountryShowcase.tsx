import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import bmwLogo from "@/assets/showcase/brands/bmw.svg";
import audiLogo from "@/assets/showcase/brands/audi.svg";
import mercedesLogo from "@/assets/showcase/brands/mercedes.svg";
import volkswagenLogo from "@/assets/showcase/brands/volkswagen.svg";
import toyotaLogo from "@/assets/showcase/brands/toyota.svg";
import miniLogo from "@/assets/showcase/brands/mini.svg";
import belgiumMap from "@/assets/showcase/countries/belgium.svg";
import netherlandsMap from "@/assets/showcase/countries/netherlands.svg";
import luxembourgMap from "@/assets/showcase/countries/luxembourg.svg";
import franceMap from "@/assets/showcase/countries/france.svg";
import germanyMap from "@/assets/showcase/countries/germany.svg";

type ShowcaseItem = {
  label: string;
  image: string;
  make?: string;
};

const BRAND_ITEMS: ShowcaseItem[] = [
  { label: "BMW", make: "BMW", image: bmwLogo },
  { label: "Audi", make: "Audi", image: audiLogo },
  { label: "Mercedes-Benz", make: "Mercedes-Benz", image: mercedesLogo },
  { label: "Volkswagen", make: "Volkswagen", image: volkswagenLogo },
  { label: "Toyota", make: "Toyota", image: toyotaLogo },
  { label: "MINI", make: "MINI", image: miniLogo },
];

const COUNTRY_ITEMS: ShowcaseItem[] = [
  { label: "Bélgica", image: belgiumMap },
  { label: "Países Baixos", image: netherlandsMap },
  { label: "Luxemburgo", image: luxembourgMap },
  { label: "França", image: franceMap },
  { label: "Alemanha", image: germanyMap },
  { label: "Bélgica", image: belgiumMap },
];

export function BrandCountryShowcase() {
  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f3f5f7] py-14">
      <div className="mx-auto max-w-7xl px-6">
        <ShowcaseRow
          title="Comprar os melhores carros europeus usados por marca"
          items={BRAND_ITEMS}
          itemKind="brand"
        />

        <div className="mt-12">
          <ShowcaseRow
            title="Melhores leilões de carros europeus na ReDrive"
            items={COUNTRY_ITEMS}
            itemKind="country"
          />
        </div>
      </div>
    </section>
  );
}

function ShowcaseRow({
  title,
  items,
  itemKind,
}: {
  title: string;
  items: ShowcaseItem[];
  itemKind: "brand" | "country";
}) {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return undefined;

    const updateButtons = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    updateButtons();
    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);

    return () => {
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi]);

  function openBrand(make?: string) {
    if (!make) return;
    void navigate({ to: `/auctions?make=${encodeURIComponent(make)}` });
  }

  return (
    <div>
      <h2 className="text-center text-2xl font-bold tracking-tight text-[#444] md:text-3xl">
        {title}
      </h2>

      <div className="relative mt-8">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex items-center">
            {items.map((item, index) => {
              const isBrand = itemKind === "brand";
              const imageSize = isBrand
                ? "h-20 max-w-[138px] md:h-24 md:max-w-[168px] lg:h-28"
                : "h-20 max-w-[124px] md:h-24 md:max-w-[152px] lg:h-28";

              return (
                <div
                  key={`${item.label}-${index}`}
                  className="flex min-w-0 flex-[0_0_48%] justify-center px-3 sm:flex-[0_0_33.333%] md:flex-[0_0_20%] lg:flex-[0_0_16.666%]"
                >
                  {isBrand ? (
                    <button
                      type="button"
                      onClick={() => openBrand(item.make)}
                      className="group flex h-32 w-full items-center justify-center rounded-sm transition duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#f3f5f7]"
                      aria-label={`Ver leilões ${item.label}`}
                    >
                      <img
                        src={item.image}
                        alt={item.label}
                        className={`${imageSize} object-contain drop-shadow-sm transition duration-200 group-hover:scale-105`}
                        loading="lazy"
                      />
                    </button>
                  ) : (
                    <div
                      className="flex h-32 w-full items-center justify-center"
                      aria-label={item.label}
                    >
                      <img
                        src={item.image}
                        alt={item.label}
                        className={`${imageSize} object-contain drop-shadow-sm`}
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <ArrowButton
          direction="prev"
          disabled={!canScrollPrev}
          onClick={() => emblaApi?.scrollPrev()}
        />
        <ArrowButton
          direction="next"
          disabled={!canScrollNext}
          onClick={() => emblaApi?.scrollNext()}
        />
      </div>
    </div>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const position = direction === "prev" ? "-left-3 md:-left-8" : "-right-3 md:-right-8";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 hidden -translate-y-1/2 rounded-full p-1 text-primary transition hover:scale-110 disabled:pointer-events-none disabled:opacity-35 sm:block ${position}`}
      aria-label={direction === "prev" ? "Ver anteriores" : "Ver seguintes"}
    >
      <Icon className="h-9 w-9 stroke-[4] md:h-11 md:w-11" />
    </button>
  );
}
