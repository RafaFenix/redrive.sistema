import { SearchBar } from "./SearchBar";
import type { Auction } from "@/lib/market-data";

interface HeroSectionProps {
  auctions: Auction[];
}

export function HeroSection({ auctions }: HeroSectionProps) {
  const heroPhotos = auctions
    .flatMap((auction) => auction.vehicle?.photos ?? [])
    .filter(Boolean)
    .slice(0, 3);
  const heroImage = heroPhotos[0];
  const secondaryImage = heroPhotos[1] ?? heroPhotos[0];

  return (
    <div className="relative left-1/2 min-h-[640px] w-screen -translate-x-1/2 overflow-hidden border-b border-border bg-[#f7f8fa]">
      <div className="absolute inset-y-0 right-0 hidden w-[72%] md:block">
        {heroImage ? (
          <div className="relative h-full">
            <img
              src={heroImage}
              alt="Viatura em leilão ReDrive"
              className="h-full w-full object-cover"
              loading="eager"
            />
            {secondaryImage && secondaryImage !== heroImage && (
              <img
                src={secondaryImage}
                alt=""
                aria-hidden="true"
                className="absolute bottom-0 left-10 h-[46%] w-[36%] rounded-sm object-cover opacity-55 blur-[1px]"
                loading="eager"
              />
            )}
          </div>
        ) : (
          <div className="h-full bg-[linear-gradient(115deg,#f8fafc_0%,#e5e7eb_55%,#cbd5e1_100%)]" />
        )}
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,.98)_22%,rgba(255,255,255,.76)_46%,rgba(255,255,255,.35)_66%,rgba(255,255,255,.08)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />

      <div className="relative mx-auto flex min-h-[640px] max-w-7xl flex-col justify-center px-6 py-20">
        <div className="max-w-[560px]">
          <h1 className="text-balance text-5xl font-extrabold leading-[1.04] tracking-tight text-[#20242b] md:text-6xl">
            Descubra leilões de automóveis para profissionais do setor
          </h1>
          <p className="mt-6 max-w-lg text-xl leading-relaxed text-slate-600">
            <strong className="font-extrabold text-slate-700">
              Viaturas importadas verificadas
            </strong>{" "}
            para concessionários, retalhistas e importadores.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-5 text-sm font-bold text-slate-700">
            <span>Empresas aprovadas</span>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span>Lances em tempo real</span>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span>Documentação verificada</span>
          </div>
        </div>

        <div className="mt-16">
          <SearchBar auctions={auctions} />
        </div>
      </div>
    </div>
  );
}
