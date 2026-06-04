# ReDrive Home Redesign — Component Implementation Guide

**Target:** Developers (@dev)
**Reference:** `UX-REDESIGN-HOME.md`

---

## COMPONENT TREE

```
Landing (src/routes/index.tsx)
├── PublicHeader (existing reuse)
├── HeroSection
│   ├── SearchBar
│   │   ├── MakeSelect (auto-complete)
│   │   ├── ModelSelect
│   │   └── MaxPriceInput
│   ├── CTAButtons (primary + secondary)
│   └── StatsGrid
│       └── StatCard (4x reuse existing)
├── BenefitsSection
│   └── BenefitCard (5x)
│       ├── Icon (Lucide)
│       ├── Title
│       └── Description
├── RecentlyAddedSection
│   ├── VehicleGrid (new responsive wrapper)
│   │   └── VehicleCard (6x, existing reuse)
│   └── ViewAllCTA
├── WhyChooseSection
│   └── BenefitCard (6x, reuse component)
├── BrandCarouselSection
│   ├── BrandCarousel (Embla Carousel wrapper)
│   │   └── BrandCard (10x dynamic)
│   │       ├── Brand name
│   │       └── Count badge
│   └── CarouselNav (arrows, optional)
├── CountryCarouselSection
│   ├── CountryCarousel (Embla Carousel wrapper)
│   │   └── CountryCard (8x dynamic)
│   │       ├── Flag emoji
│   │       ├── Country name
│   │       └── Count badge
│   └── CarouselNav (arrows, optional)
├── TestimonialSection
│   ├── TestimonialCarousel (or grid)
│   │   └── TestimonialCard (3-4)
│   │       ├── StarRating
│   │       ├── Quote
│   │       ├── Author name
│   │       └── Company
│   └── CarouselNav (optional)
├── FinalCTASection
│   ├── Headline
│   ├── Subtext
│   └── CTAButtons (2x)
└── Footer (existing reuse)
```

---

## COMPONENT SPECIFICATIONS

### 1. SearchBar.tsx

**Props:**

```typescript
interface SearchBarProps {
  onSearch?: (filters: { make?: string; model?: string; maxPrice?: number }) => void;
  makes: string[]; // auto-complete options
}
```

**Features:**

- Make dropdown (auto-complete from active auctions)
- Model input (text)
- Max price input (number or slider)
- Submit button "Buscar"

**Responsive:**

- Desktop: 3 inputs in a row + button
- Mobile: Stacked, full-width inputs

**Example JSX:**

```jsx
export function SearchBar({ makes, onSearch }: SearchBarProps) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    maxPrice: undefined,
  });

  const handleSubmit = () => {
    onSearch?.(formData);
    // OR navigate with query params
    navigate(`/auctions?make=${formData.make}&model=${formData.model}`);
  };

  return (
    <div className="grid gap-3 grid-cols-1 md:grid-cols-4">
      <Select value={formData.make} onValueChange={(v) => setFormData({...formData, make: v})}>
        <SelectTrigger placeholder="Marca" />
        {makes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
      </Select>
      <Input placeholder="Modelo" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} />
      <Input type="number" placeholder="Preço máximo" onChange={(e) => setFormData({...formData, maxPrice: Number(e.target.value)})} />
      <Button onClick={handleSubmit} className="bg-primary">BUSCAR</Button>
    </div>
  );
}
```

---

### 2. BenefitCard.tsx (Reusable)

**Props:**

```typescript
interface BenefitCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}
```

**Usage:**

```jsx
<BenefitCard
  icon={Globe}
  title="Suporte 24/7"
  description="Equipa pronta para ajudar em 24 horas"
/>
```

**Styling:**

- bg-card, border border-border
- p-6, rounded
- Icon: text-primary, size-6
- Title: font-bold, text-lg
- Description: text-muted-foreground, text-sm

---

### 3. VehicleGrid.tsx (New responsive wrapper)

**Props:**

```typescript
interface VehicleGridProps {
  auctions: Auction[];
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  limit?: number;
}
```

**Default:** 1 col (mobile), 2 cols (tablet), 3 cols (desktop)

**Example:**

```jsx
<VehicleGrid auctions={auctions} limit={6} />
```

**Implementation:**

```jsx
export function VehicleGrid({ auctions, columns = { sm: 1, md: 2, lg: 3 }, limit = 6 }: VehicleGridProps) {
  const displayed = auctions.slice(0, limit);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {displayed.map(auction => (
        <VehicleCard key={auction.id} auction={auction} vehicle={auction.vehicle} />
      ))}
    </div>
  );
}
```

---

### 4. BrandCarousel.tsx

**Props:**

```typescript
interface BrandCarouselProps {
  brands: BrandCard[];
  onBrandClick?: (make: string) => void;
}
```

**Features:**

- Embla Carousel with drag/swipe
- Arrow navigation (prev/next)
- Responsive: 5+ visible (desktop), 3-4 (tablet), 2 (mobile)

**Example:**

```jsx
import useEmblaCarousel from 'embla-carousel-react';

export function BrandCarousel({ brands, onBrandClick }: BrandCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    skipSnaps: false,
    dragFree: true,
  });

  return (
    <section className="overflow-hidden">
      <div ref={emblaRef}>
        <div className="flex gap-4">
          {brands.map(brand => (
            <BrandCard
              key={brand.make}
              brand={brand}
              onClick={() => {
                onBrandClick?.(brand.make);
                navigate(`/auctions?make=${brand.make}`);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### 5. BrandCard.tsx

**Props:**

```typescript
interface BrandCardProps {
  brand: BrandCard;
  onClick?: () => void;
}
```

**Styling:**

- bg-card, border-border, p-6
- Centered text
- Hover: border-primary, cursor-pointer
- Brand name: font-bold, text-lg
- Count: text-muted-foreground, text-sm

**Example:**

```jsx
export function BrandCard({ brand, onClick }: BrandCardProps) {
  return (
    <div
      onClick={onClick}
      className="min-w-[200px] border border-border bg-card p-6 rounded cursor-pointer hover:border-primary transition"
    >
      <h3 className="font-bold text-lg">{brand.make}</h3>
      <p className="text-sm text-muted-foreground mt-2">{brand.count} leilões</p>
    </div>
  );
}
```

---

### 6. CountryCarousel.tsx + CountryCard.tsx

**Same pattern as BrandCarousel, but with flag emoji**

**CountryCard example:**

```jsx
export function CountryCard({ country, onClick }: CountryCardProps) {
  return (
    <div
      onClick={onClick}
      className="min-w-[200px] border border-border bg-card p-6 rounded cursor-pointer hover:border-primary transition text-center"
    >
      <span className="text-3xl">{country.emoji}</span>
      <h3 className="font-bold text-lg mt-2">{country.name}</h3>
      <p className="text-sm text-muted-foreground">{country.count} leilões</p>
    </div>
  );
}
```

**onClick action:**

```typescript
navigate(`/auctions?originCountry=${country.code}`);
```

---

### 7. TestimonialCard.tsx

**Props:**

```typescript
interface TestimonialCardProps {
  testimonial: Testimonial;
}
```

**Structure:**

- 5-star rating (⭐⭐⭐⭐⭐)
- Quote (italic, blockquote)
- Author name (strong)
- Company (muted)

**Example:**

```jsx
export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="border-l-4 border-primary bg-card p-6 rounded">
      <div className="flex gap-0.5 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <span key={i}>⭐</span>
        ))}
      </div>
      <blockquote className="italic text-base mb-6 text-foreground">
        "{testimonial.quote}"
      </blockquote>
      <footer>
        <strong className="block">{testimonial.author}</strong>
        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
      </footer>
    </div>
  );
}
```

---

### 8. TestimonialCarousel.tsx / TestimonialGrid.tsx

**Option A: Carousel (like brands)**

```jsx
export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    skipSnaps: false,
    dragFree: true,
  });

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex gap-4">
        {testimonials.map(t => (
          <div key={t.id} className="min-w-[300px]">
            <TestimonialCard testimonial={t} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Option B: Grid (simpler, might be better for 3-4 testimonials)**

```jsx
export function TestimonialGrid({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map(t => (
        <TestimonialCard key={t.id} testimonial={t} />
      ))}
    </div>
  );
}
```

**Recommendation:** Grid for simplicity (fewer moving parts)

---

### 9. FinalCTA.tsx

**Props:**

```typescript
interface FinalCTAProps {
  headlineText?: string;
  subtextText?: string;
}
```

**Example:**

```jsx
export function FinalCTA({
  headlineText = "Pronto para comprar viaturas importadas sem intermediários?",
  subtextText = "Registe a sua empresa e aceda a centenas de leilões mensais.",
}: FinalCTAProps) {
  return (
    <section className="bg-foreground text-white py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold">{headlineText}</h2>
        <p className="mt-4 text-white/70">{subtextText}</p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-white font-bold uppercase tracking-widest hover:bg-primary/90"
          >
            REGISTAR AGORA
          </Link>
          <Link
            to="/auctions"
            className="inline-flex items-center gap-2 border-2 border-white px-6 py-3 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-foreground"
          >
            VER CATÁLOGO
          </Link>
        </div>
      </div>
    </section>
  );
}
```

---

## REFACTORING CHECKLIST

### Existing Sections to Refactor

1. **Hero section**
   - [ ] Add SearchBar component
   - [ ] Refactor stats to use new StatsGrid (or keep existing)
   - [ ] Adjust layout (confirm 2-col desktop, 1-col mobile)

2. **Benefits section**
   - [ ] Create BenefitCard component (reusable)
   - [ ] Convert hardcoded HTML to mapped component array
   - [ ] Adjust grid: 5-col (desktop), 2-3 (tablet), 1 (mobile)

3. **Recently Added section**
   - [ ] Remove tabs ("A terminar", "Mais recentes", "Comprar já")
   - [ ] Create VehicleGrid wrapper
   - [ ] Keep VehicleCard as-is
   - [ ] Filter: `auctions.filter(a => a.status === 'active').slice(0, 6)`

4. **Why Choose section**
   - [ ] Reuse BenefitCard component
   - [ ] Convert to mapped array
   - [ ] Adjust grid: 3-col (desktop), 2-col (tablet), 1-col (mobile)

5. **How It Works section**
   - [ ] **OPTION 1:** Remove from homepage, link in footer "Como funciona" → new page `/how-it-works`
   - [ ] **OPTION 2:** Keep as-is (if already implemented)
   - **Recommendation:** Remove (simplify homepage, focus on conversion)

---

## DATA PREPARATION (in Landing component)

```typescript
// At top of Landing function
const [auctions, setAuctions] = useState<Auction[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function loadAuctions() {
    try {
      setIsLoading(true);
      const data = await listPublicAuctions();
      setAuctions(data);
    } catch (err) {
      console.error("Failed to load auctions", err);
      setError("Falha ao carregar leilões");
    } finally {
      setIsLoading(false);
    }
  }
  void loadAuctions();
}, []);

// Derived data
const brandsData = useMemo(() => {
  const map = new Map<string, number>();
  auctions.forEach((a) => {
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
  auctions.forEach((a) => {
    if (a.vehicle.originCountry) {
      const cc = a.vehicle.originCountry;
      map.set(cc, (map.get(cc) || 0) + 1);
    }
  });
  return Array.from(map)
    .map(([code, count]) => ({
      code,
      name: countryNameMap[code] || code,
      emoji: countryEmojiMap[code] || "🌍",
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}, [auctions]);

const recentCars = useMemo(() => {
  return auctions.filter((a) => a.status === "active").slice(0, 6);
}, [auctions]);

const makes = useMemo(() => {
  return [...new Set(auctions.map((a) => a.vehicle.make))].sort();
}, [auctions]);

// Hardcoded testimonials (can move to DB later)
const testimonials: Testimonial[] = [
  {
    id: "1",
    rating: 5,
    quote:
      "ReDrive simplificou todo o processo. Antes esperávamos semanas, agora compramos 5 viaturas em 2 semanas.",
    author: "João Silva",
    company: "Auto Peças Lisboa",
  },
  {
    id: "2",
    rating: 5,
    quote:
      "Leilões em tempo real, documentação perfeita. Recomendo 100% para quem quer comprar viaturas de qualidade.",
    author: "Maria Costa",
    company: "Concessionária Oporto",
  },
  {
    id: "3",
    rating: 5,
    quote: "Plataforma intuitiva, sem surpresas nas taxas. Suporte multilíngue foi crucial.",
    author: "Marco Rossi",
    company: "Importador (Itália)",
  },
];
```

---

## MIGRATION PATH (Phased)

### Phase 1: Components only (No breaking changes)

- Create all new components in `src/components/home/`
- Import existing components (VehicleCard, PublicHeader, etc.)
- Don't touch `index.tsx` yet

### Phase 2: Refactor in `index.tsx`

- Replace section HTML with new components
- Remove tabs from "Recently Added"
- Add carousels (Brands, Countries, Testimonials)
- Keep same functionality, better structure

### Phase 3: Testing & QA

- Test responsive layout
- Test carousel interactions
- Test data-driven population
- Performance audit

### Phase 4: Deploy

- Push to main via @devops
- Monitor performance & conversions
- A/B test if needed

---

## TESTING STRATEGY

### Unit tests (Jest)

```typescript
describe('BrandCarousel', () => {
  it('renders all brand cards', () => {
    const brands = [{ make: 'BMW', count: 5 }];
    render(<BrandCarousel brands={brands} />);
    expect(screen.getByText('BMW')).toBeInTheDocument();
  });

  it('calls onBrandClick when card clicked', () => {
    const handleClick = jest.fn();
    const brands = [{ make: 'Audi', count: 3 }];
    render(<BrandCarousel brands={brands} onBrandClick={handleClick} />);
    screen.getByText('Audi').closest('div').click();
    expect(handleClick).toHaveBeenCalledWith('Audi');
  });
});
```

### E2E tests (Playwright)

```typescript
test("Homepage renders all sections", async ({ page }) => {
  await page.goto("/");

  // Check hero
  await expect(page.locator("h1")).toContainText("Leilão de automóveis");

  // Check benefits
  await expect(page.locator("text=Suporte 24/7")).toBeVisible();

  // Check carousels loaded
  await expect(page.locator('[data-carousel="brands"]')).toBeVisible();
  await expect(page.locator('[data-carousel="countries"]')).toBeVisible();

  // Check testimonials
  await expect(page.locator("blockquote")).toHaveCount(3);
});

test("Brand carousel navigation works", async ({ page }) => {
  await page.goto("/");
  const brandCard = page.locator('[data-carousel="brands"] button').first();
  await brandCard.click();
  // Should navigate to /auctions?make=...
});
```

---

## PERFORMANCE TIPS

1. **Image optimization:** VehicleCard photos are likely heavy — ensure lazy loading
2. **Carousel library:** Embla is ~2KB gzip, very efficient
3. **Data fetching:** Current `listPublicAuctions()` is client-side; consider moving to RSC if needed
4. **Memo hooks:** Use `useMemo` for brands/countries derivation (already shown above)

---

## ACCESSIBILITY CHECKLIST

- [ ] Semantic HTML: `<section>`, `<article>`, `<h2>`, `<h3>`, etc.
- [ ] Color contrast: All text meets WCAG AA (4.5:1 for body)
- [ ] Focus states: Visible outline on all interactive elements
- [ ] Alt text: All images have descriptive alt text
- [ ] Keyboard nav: Tab through all buttons, links, inputs
- [ ] Screen reader: Test with NVDA or JAWS
- [ ] Carousels: Arrow keys or Next/Prev buttons for nav
- [ ] Testimonials: Not auto-rotating (if carousel used)

---

## FILE STRUCTURE (After implementation)

```
src/
├── routes/
│   └── index.tsx (refactored Landing)
├── components/
│   ├── layout/
│   │   └── PublicHeader.tsx (existing)
│   ├── vehicle/
│   │   └── VehicleCard.tsx (existing)
│   ├── home/
│   │   ├── SearchBar.tsx (NEW)
│   │   ├── BenefitCard.tsx (NEW)
│   │   ├── VehicleGrid.tsx (NEW)
│   │   ├── BrandCarousel.tsx (NEW)
│   │   ├── BrandCard.tsx (NEW)
│   │   ├── CountryCarousel.tsx (NEW)
│   │   ├── CountryCard.tsx (NEW)
│   │   ├── TestimonialCard.tsx (NEW)
│   │   ├── TestimonialCarousel.tsx (NEW) — or TestimonialGrid.tsx
│   │   └── FinalCTA.tsx (NEW)
│   └── ui/ (existing shadcn components)
├── lib/
│   ├── market-data.ts (add BrandCard, CountryCard, Testimonial types)
│   └── ...
└── docs/
    ├── UX-REDESIGN-HOME.md (spec)
    └── COMPONENT-IMPLEMENTATION-GUIDE.md (this file)
```

---

## NEXT STEPS

1. **@architect** reviews this spec + UX-REDESIGN-HOME.md
2. **@dev** creates components in parallel
3. **@dev** refactors `index.tsx` with new components
4. **@qa** tests responsive layout, carousels, accessibility
5. **@devops** pushes to main + monitors perf

---

**Prepared by:** Uma (@ux-design-expert)
**Date:** 2026-06-04
**Status:** Ready for implementation
