# ReDrive Home Redesign — Mock Data & Examples

**Purpose:** Reference data for component development and testing
**Date:** 2026-06-04

---

## MOCK TESTIMONIALS

```typescript
export const mockTestimonials = [
  {
    id: "1",
    rating: 5,
    quote:
      "ReDrive simplificou todo o processo. Antes esperávamos semanas por uma boa oportunidade. Agora compramos 5 viaturas em 2 semanas e dormimos tranquilos com a qualidade.",
    author: "João Silva",
    company: "Auto Peças Lisboa",
  },
  {
    id: "2",
    rating: 5,
    quote:
      "Leilões em tempo real, documentação perfeita, suporte atento em português. Recomendo 100% para quem quer comprar viaturas de qualidade sem surpresas.",
    author: "Maria Costa",
    company: "Concessionária Oporto",
  },
  {
    id: "3",
    rating: 5,
    quote:
      "Plataforma intuitiva, interface limpa, sem surpresas nas taxas. Suporte multilíngue foi crucial para negociar com confiança com vendedores europeus.",
    author: "Marco Rossi",
    company: "Importador (Itália)",
  },
  // Optional 4th
  {
    id: "4",
    rating: 5,
    quote:
      "Transparência total, processo claro do início ao fim. Nenhuma taxa oculta, nenhuma complicação. Voltaremos com certeza para compras futuras.",
    author: "Anonymous",
    company: "Concessionária",
  },
];
```

---

## COUNTRY MAPPING

```typescript
export const countryNameMap: Record<string, string> = {
  DE: "Alemanha",
  FR: "França",
  IT: "Itália",
  BE: "Bélgica",
  NL: "Países Baixos",
  ES: "Espanha",
  AT: "Áustria",
  CH: "Suíça",
  SE: "Suécia",
  PL: "Polónia",
  CZ: "República Checa",
  DK: "Dinamarca",
  PT: "Portugal",
  GR: "Grécia",
  UK: "Reino Unido",
  GB: "Reino Unido",
  NO: "Noruega",
  FI: "Finlândia",
  HU: "Hungria",
};

export const countryEmojiMap: Record<string, string> = {
  DE: "🇩🇪",
  FR: "🇫🇷",
  IT: "🇮🇹",
  BE: "🇧🇪",
  NL: "🇳🇱",
  ES: "🇪🇸",
  AT: "🇦🇹",
  CH: "🇨🇭",
  SE: "🇸🇪",
  PL: "🇵🇱",
  CZ: "🇨🇿",
  DK: "🇩🇰",
  PT: "🇵🇹",
  GR: "🇬🇷",
  UK: "🇬🇧",
  GB: "🇬🇧",
  NO: "🇳🇴",
  FI: "🇫🇮",
  HU: "🇭🇺",
};
```

---

## MOCK BRANDS DATA

```typescript
export const mockBrandsData = [
  { make: "BMW", count: 12 },
  { make: "Audi", count: 8 },
  { make: "Mercedes-Benz", count: 6 },
  { make: "Volkswagen", count: 10 },
  { make: "Renault", count: 5 },
  { make: "Ford", count: 4 },
  { make: "Fiat", count: 3 },
  { make: "Peugeot", count: 5 },
  { make: "Opel", count: 3 },
  { make: "Citroën", count: 4 },
];
```

---

## MOCK COUNTRIES DATA

```typescript
export const mockCountriesData = [
  { code: "DE", name: "Alemanha", emoji: "🇩🇪", count: 15 },
  { code: "FR", name: "França", emoji: "🇫🇷", count: 10 },
  { code: "IT", name: "Itália", emoji: "🇮🇹", count: 8 },
  { code: "BE", name: "Bélgica", emoji: "🇧🇪", count: 5 },
  { code: "NL", name: "Países Baixos", emoji: "🇳🇱", count: 4 },
  { code: "ES", name: "Espanha", emoji: "🇪🇸", count: 6 },
  { code: "AT", name: "Áustria", emoji: "🇦🇹", count: 3 },
  { code: "CH", name: "Suíça", emoji: "🇨🇭", count: 2 },
];
```

---

## BENEFITS DATA

```typescript
// Hero section benefits
export const heroBenefits = [
  {
    icon: "Globe",
    title: "Suporte multilíngue 24/7",
    description:
      "Equipa pronta para ajudar em português, inglês e alemão. Dúvidas? Respondemos em minutos.",
  },
  {
    icon: "DollarSign",
    title: "Taxas transparentes e baixas",
    description:
      "Comissões justas, sem custos ocultos. Saiba exatamente quanto vai pagar antes de licitar.",
  },
  {
    icon: "Truck",
    title: "Entrega e legalização inclusos",
    description:
      "Transporte, documentação, COC — tudo tratado. A viatura chega pronta para circular.",
  },
  {
    icon: "TrendingUp",
    title: "Preços justos, sem intermediários",
    description:
      "Algoritmo de pricing que reflete custos reais. Nem sobrecarga, nem risco para o comprador.",
  },
  {
    icon: "Award",
    title: "Qualidade verificada e documentada",
    description:
      "Todas as viaturas passam por inspeção rigorosa. Damage report, service history e COC disponíveis.",
  },
];

// Why Choose benefits
export const whyChooseBenefits = [
  {
    icon: "TrendingUp",
    title: "Preço Competitivo",
    description:
      "Custos logísticos distribuídos entre vários compradores. Mais quantidade = melhor preço.",
  },
  {
    icon: "ShieldCheck",
    title: "COC Garantido em todas as viaturas",
    description:
      "Importação simplificada. Documentação 100% legal, pronta para matriculação em Portugal.",
  },
  {
    icon: "Truck",
    title: "Importação e legalização por conta da ReDrive",
    description:
      "Documentação aduaneira, testes técnicos, seguros — tudo gerido pela nossa equipa.",
  },
  {
    icon: "Zap",
    title: "Lances em tempo real, contadores ao segundo",
    description:
      "Leilões com Realtime WebSocket. Anti-sniping automático nos últimos 2 minutos. Transparência total.",
  },
  {
    icon: "Lock",
    title: "Segurança com Row Level Security",
    description:
      "RLS automático no Supabase. Nenhuma mistura de dados. Cada empresa só vê seus dados e leilões públicos.",
  },
  {
    icon: "MessageCircle",
    title: "Não ganhou? Negocie com a ReDrive",
    description: "Se o leilão fecha sem vitória, abrimos negociação direta com o vendedor.",
  },
];
```

---

## MOCK STATS

```typescript
export const statsData = [
  { label: "Lotes / mês", value: "~60" },
  { label: "Compradores aprovados", value: "240+" },
  { label: "Países de origem", value: "DE · FR · IT" },
  { label: "Taxa de adjudicação", value: "92%" },
];
```

---

## DATA DERIVATION EXAMPLES

### Brands Data Derivation

```typescript
// Input: Auctions array
const auctions: Auction[] = [
  {
    id: '1',
    vehicle: { make: 'BMW', model: '3 Series', ... },
    status: 'active',
    ...
  },
  {
    id: '2',
    vehicle: { make: 'Audi', model: 'A4', ... },
    status: 'active',
    ...
  },
  {
    id: '3',
    vehicle: { make: 'BMW', model: '5 Series', ... },
    status: 'active',
    ...
  },
  // ... more
];

// Process: Extract, count, sort
const brandsMap = new Map<string, number>();
auctions.forEach(auction => {
  if (auction.status === 'active' && auction.vehicle.make) {
    const make = auction.vehicle.make;
    brandsMap.set(make, (brandsMap.get(make) || 0) + 1);
  }
});

const brandsData = Array.from(brandsMap)
  .map(([make, count]) => ({ make, count }))
  .sort((a, b) => b.count - a.count) // Sort descending by count
  .slice(0, 10); // Take top 10

// Output: BrandCard[] ready for carousel
console.log(brandsData);
// [
//   { make: 'BMW', count: 12 },
//   { make: 'Audi', count: 8 },
//   { make: 'Mercedes', count: 6 },
//   ...
// ]
```

### Countries Data Derivation

```typescript
// Input: Auctions array
const auctions: Auction[] = [
  {
    id: '1',
    vehicle: { make: 'BMW', originCountry: 'DE', ... },
    status: 'active',
    ...
  },
  {
    id: '2',
    vehicle: { make: 'Renault', originCountry: 'FR', ... },
    status: 'active',
    ...
  },
  // ... more
];

// Process: Extract, count, sort, map names + emojis
const countriesMap = new Map<string, number>();
auctions.forEach(auction => {
  if (auction.status === 'active' && auction.vehicle.originCountry) {
    const code = auction.vehicle.originCountry;
    countriesMap.set(code, (countriesMap.get(code) || 0) + 1);
  }
});

const countriesData = Array.from(countriesMap)
  .map(([code, count]) => ({
    code,
    name: countryNameMap[code] || code,
    emoji: countryEmojiMap[code] || '🌍',
    count,
  }))
  .sort((a, b) => b.count - a.count) // Sort descending by count
  .slice(0, 8); // Take top 8

// Output: CountryCard[] ready for carousel
console.log(countriesData);
// [
//   { code: 'DE', name: 'Alemanha', emoji: '🇩🇪', count: 15 },
//   { code: 'FR', name: 'França', emoji: '🇫🇷', count: 10 },
//   { code: 'IT', name: 'Itália', emoji: '🇮🇹', count: 8 },
//   ...
// ]
```

### Recently Added Cars

```typescript
// Filter: active auctions, sort by creation date, take first 6
const recentCars = auctions
  .filter(a => a.status === 'active')
  .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  .slice(0, 6);

// Then map to VehicleCard component
{recentCars.map(auction => (
  <VehicleCard key={auction.id} auction={auction} vehicle={auction.vehicle} />
))}
```

---

## SEARCH BAR SETUP

```typescript
// Extract unique makes for search dropdown
const makes = useMemo(() => {
  const uniqueMakes = new Set<string>();
  auctions.forEach(a => {
    if (a.vehicle.make) uniqueMakes.add(a.vehicle.make);
  });
  return Array.from(uniqueMakes).sort();
}, [auctions]);

// Usage in SearchBar
<SearchBar makes={makes} />

// SearchBar internal state
const [formData, setFormData] = useState({
  make: '',
  model: '',
  maxPrice: undefined,
});

// Submit handler
const handleSearch = () => {
  // Option 1: Navigate with query params
  navigate(`/auctions?make=${formData.make}&model=${formData.model}&maxPrice=${formData.maxPrice}`);

  // Option 2: Delegate to onSearch callback (parent handles navigation)
  onSearch?.(formData);
};
```

---

## COMPONENT USAGE EXAMPLES

### BenefitCard

```jsx
import { Globe, DollarSign, Truck, TrendingUp, Award } from "lucide-react";

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
  {heroBenefits.map((benefit, i) => {
    const IconComponent = {
      Globe: Globe,
      DollarSign: DollarSign,
      Truck: Truck,
      TrendingUp: TrendingUp,
      Award: Award,
    }[benefit.icon];

    return (
      <BenefitCard
        key={i}
        icon={IconComponent}
        title={benefit.title}
        description={benefit.description}
      />
    );
  })}
</div>;
```

### BrandCarousel

```jsx
import { BrandCarousel } from "@/components/home/BrandCarousel";

<section className="mx-auto max-w-7xl px-6 py-16">
  <h2 className="text-3xl font-extrabold">Comprar os melhores carros por marca</h2>
  <BrandCarousel
    brands={brandsData}
    onBrandClick={(make) => {
      navigate(`/auctions?make=${make}`);
    }}
  />
</section>;
```

### CountryCarousel

```jsx
import { CountryCarousel } from "@/components/home/CountryCarousel";

<section className="mx-auto max-w-7xl px-6 py-16">
  <h2 className="text-3xl font-extrabold">Melhores leilões de carros por país</h2>
  <CountryCarousel
    countries={countriesData}
    onCountryClick={(code) => {
      navigate(`/auctions?originCountry=${code}`);
    }}
  />
</section>;
```

### TestimonialCard

```jsx
import { TestimonialCard } from "@/components/home/TestimonialCard";

<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {mockTestimonials.map((testimonial) => (
    <TestimonialCard key={testimonial.id} testimonial={testimonial} />
  ))}
</div>;
```

### VehicleGrid

```jsx
import { VehicleGrid } from "@/components/home/VehicleGrid";

<section className="mx-auto max-w-7xl px-6 py-16">
  <h2 className="text-3xl font-extrabold">Carros adicionados recentemente</h2>
  <VehicleGrid auctions={recentCars} limit={6} />
</section>;
```

---

## LANDING COMPONENT REFACTOR (Full Example)

```typescript
// src/routes/index.tsx (Refactored)

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Auction, listPublicAuctions } from "@/lib/market-data";

// New components
import { HeroSection } from "@/components/home/HeroSection";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { RecentlyAddedSection } from "@/components/home/RecentlyAddedSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { BrandCarouselSection } from "@/components/home/BrandCarouselSection";
import { CountryCarouselSection } from "@/components/home/CountryCarouselSection";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { FinalCTASection } from "@/components/home/FinalCTASection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReDrive — Leilão Automóvel B2B" },
      {
        name: "description",
        content: "Plataforma B2B de leilão e venda imediata de automóveis importados.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAuctions() {
      try {
        setIsLoading(true);
        const data = await listPublicAuctions();
        setAuctions(data);
      } catch (error) {
        console.error("Failed to load auctions", error);
      } finally {
        setIsLoading(false);
      }
    }
    void loadAuctions();
  }, []);

  // Derived data
  const brandsData = useMemo(() => {
    const map = new Map<string, number>();
    auctions.forEach(a => {
      if (a.vehicle.make) {
        map.set(a.vehicle.make, (map.get(a.vehicle.make) || 0) + 1);
      }
    });
    return Array.from(map)
      .map(([make, count]) => ({ make, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [auctions]);

  const countriesData = useMemo(() => {
    const map = new Map<string, number>();
    auctions.forEach(a => {
      if (a.vehicle.originCountry) {
        const cc = a.vehicle.originCountry;
        map.set(cc, (map.get(cc) || 0) + 1);
      }
    });
    return Array.from(map)
      .map(([code, count]) => ({
        code,
        name: countryNameMap[code] || code,
        emoji: countryEmojiMap[code] || '🌍',
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [auctions]);

  const recentCars = useMemo(() => {
    return auctions.filter(a => a.status === 'active').slice(0, 6);
  }, [auctions]);

  const makes = useMemo(() => {
    return [...new Set(auctions.map(a => a.vehicle.make))].sort();
  }, [auctions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">A carregar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <HeroSection makes={makes} />
      <BenefitsSection />
      <RecentlyAddedSection auctions={recentCars} />
      <WhyChooseSection />
      <BrandCarouselSection
        brands={brandsData}
        onBrandClick={(make) => navigate({ to: '/auctions', search: { make } })}
      />
      <CountryCarouselSection
        countries={countriesData}
        onCountryClick={(code) => navigate({ to: '/auctions', search: { originCountry: code } })}
      />
      <TestimonialSection />
      <FinalCTASection />

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} ReDrive — Todos os direitos reservados.</span>
          <span className="font-mono uppercase tracking-widest">B2B · Portugal</span>
        </div>
      </footer>
    </div>
  );
}

// Country mapping utilities (should move to lib)
const countryNameMap: Record<string, string> = {
  'DE': 'Alemanha',
  'FR': 'França',
  'IT': 'Itália',
  'BE': 'Bélgica',
  'NL': 'Países Baixos',
  'ES': 'Espanha',
  'AT': 'Áustria',
  'CH': 'Suíça',
};

const countryEmojiMap: Record<string, string> = {
  'DE': '🇩🇪',
  'FR': '🇫🇷',
  'IT': '🇮🇹',
  'BE': '🇧🇪',
  'NL': '🇳🇱',
  'ES': '🇪🇸',
  'AT': '🇦🇹',
  'CH': '🇨🇭',
};
```

---

## TAILWIND CLASS REFERENCE

### Grid Layouts

```jsx
{/* 3-col desktop, 2-col tablet, 1-col mobile */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

{/* 5-col desktop, 2-3 tablet, 1 mobile */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">

{/* Hero 2-col desktop, 1-col mobile */}
<div className="grid items-end gap-8 lg:grid-cols-12">
  <div className="lg:col-span-7">...</div>
  <div className="lg:col-span-5">...</div>
</div>
```

### Carousel Container (Embla)

```jsx
<div ref={emblaRef} className="overflow-hidden">
  <div className="flex gap-4">{/* Cards go here */}</div>
</div>
```

### Section Padding

```jsx
{
  /* Standard section */
}
<section className="py-16 md:py-12 sm:py-8">
  <div className="mx-auto max-w-7xl px-6">{/* Content */}</div>
</section>;
```

---

**Reference prepared by:** Uma (@ux-design-expert)
**Date:** 2026-06-04
**Status:** Ready for @dev implementation
