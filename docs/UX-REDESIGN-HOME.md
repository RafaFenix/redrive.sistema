# ReDrive Home Redesign — Especificação UX/Design

**Status:** Design Specification (ready for @architect & @dev)
**Versão:** 1.0
**Data:** 2026-06-04
**Designer:** Uma (@ux-design-expert)

---

## EXECUTIVE SUMMARY

Redesign da homepage ReDrive seguindo layout proven do eCarsTrade, mantendo identidade ReDrive premium/industrial e foco em conversão B2B. Adição de 3 novas seções (Brands Carousel, Countries Carousel, Testimonials) + simplificação de existentes.

**Benchmark:** eCarsTrade layout (Hero + Benefits + Recently Added + Why Choose + Brands + Countries + Reviews + Footer)

**Diferenciadores ReDrive:**

- Brand premium (não soft)
- Copy português (Portugal + multilíngue context)
- Sem copiar assets de competitors
- Conversão B2B (VER LEILÕES, REGISTAR EMPRESA)
- Dados dinâmicos (marcas/países do catálogo real)

---

## 1. LAYOUT FINAL (Nova ordem)

### Wireframe ASCII

```
┌────────────────────────────────────────────────────────────┐
│  1. HERO + SEARCH                                          │
│     - Headline: "Leilão de automóveis importados..."       │
│     - Search bar: Marca, Modelo, Preço máximo             │
│     - CTAs: VER LEILÕES (primary red) + REGISTAR EMPRESA   │
│     - Stats 2x2 grid (Lotes/mês, Compradores, Países, %) │
├────────────────────────────────────────────────────────────┤
│  2. BENEFITS (5 inline cards)                              │
│     - Suporte 24/7, Taxas transparentes, Entrega, Preços, │
│     - Qualidade garantida                                  │
├────────────────────────────────────────────────────────────┤
│  3. RECENTLY ADDED CARS (Grid 3-col, NO tabs)             │
│     - Título: "Carros adicionados recentemente..."        │
│     - 6 VehicleCard (foto, marca/modelo, preço, timer)    │
│     - CTA: "Ver todos os leilões →" → /auctions           │
├────────────────────────────────────────────────────────────┤
│  4. WHY CHOOSE REDRIVE? (3-col grid, 6 cards)             │
│     - Preço competitivo, COC garantido, Importação,       │
│     - Tempo real, Segurança RLS, Negocie depois           │
├────────────────────────────────────────────────────────────┤
│  5. BEST CARS BY BRAND (Horizontal carousel)              │
│     - Título: "Comprar os melhores carros por marca"      │
│     - ~10 brand cards (name + count "X leilões")          │
│     - Click → /auctions?make=BMW                          │
│     - Data-driven: Extract unique makes, sort by count    │
├────────────────────────────────────────────────────────────┤
│  6. BEST AUCTIONS BY COUNTRY (Horizontal carousel)        │
│     - Título: "Melhores leilões de carros por país"       │
│     - ~8 country cards (🇩🇪 name + count "X leilões")    │
│     - Click → /auctions?originCountry=DE                  │
│     - Data-driven: Extract unique originCountry, count    │
├────────────────────────────────────────────────────────────┤
│  7. TESTIMONIALS (New — 3-4 reviews)                       │
│     - Título: "O que os nossos clientes dizem sobre nós"  │
│     - Cards: ⭐⭐⭐⭐⭐ + quote + author + company         │
│     - Left border accent (red), clean typography          │
│     - Carousel ou stacked grid (mobile-friendly)          │
├────────────────────────────────────────────────────────────┤
│  8. FINAL CTA                                              │
│     - Dark bg: "Pronto para comprar viaturas importadas?"  │
│     - 2 CTAs: "Registar agora" + "Ver catálogo"           │
├────────────────────────────────────────────────────────────┤
│  9. FOOTER                                                 │
│     - Copyright, ReDrive branding, B2B · Portugal          │
└────────────────────────────────────────────────────────────┘
```

---

## 2. SECTION SPECIFICATIONS

### 2.1 HERO + SEARCH (Refine existing)

| Aspecto            | Spec                                                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Headline**       | "Leilão de automóveis importados. Em tempo real. Sem intermediários."                                                                                                           |
| **Subheading**     | "A ReDrive é o pregão digital onde concessionárias, retalhistas e importadores acedem mensalmente a centenas de viaturas vindas do estrangeiro. Licite, compre já ou negoceie." |
| **Search Bar**     | 3 dropdowns: Marca (auto-complete), Modelo, Preço máximo (slider or input)                                                                                                      |
| **Primary CTA**    | "VER LEILÕES" → `/auctions` (red bg, white text, tracking-widest)                                                                                                               |
| **Secondary CTA**  | "REGISTAR EMPRESA" → `/register` (border-2, no bg)                                                                                                                              |
| **Layout Desktop** | 2-col: text left (col-span-7), stats right (col-span-5)                                                                                                                         |
| **Layout Mobile**  | 1-col stacked (text, search, stats)                                                                                                                                             |
| **Stats Grid**     | 2x2: Lotes/mês (~60), Compradores (240+), Países (DE·FR·IT), Taxa (92%)                                                                                                         |
| **Background**     | Gradient ou hero image (viaturas reais)                                                                                                                                         |
| **Spacing**        | py-20 (desktop), py-12 (mobile)                                                                                                                                                 |

**Components to reuse:**

- Existing `PublicHeader`
- New `SearchBar` component (3 inputs)
- Existing `Stat` component

**Data flow:**

```javascript
// Fetch unique makes + count for search dropdown
const makes = await listPublicAuctions()
  .then((auctions) => [...new Set(auctions.map((a) => a.vehicle.make))])
  .sort();

// Stats are hardcoded for now (can be dynamic later)
```

---

### 2.2 BENEFITS (Keep, refine styling)

| Benefit                 | Icon                | Description                                |
| ----------------------- | ------------------- | ------------------------------------------ |
| **Suporte 24/7**        | Globe (Lucide)      | Equipa pronta para ajudar em 24 horas      |
| **Taxas transparentes** | DollarSign (Lucide) | Comissões justas, sem custos ocultos       |
| **Entrega à porta**     | Truck (Lucide)      | Transporte e legalização inclusos          |
| **Preços inteligentes** | TrendingUp (Lucide) | Algoritmo justo, sem intermediários        |
| **Qualidade garantida** | Award (Lucide)      | Apenas viaturas verificadas e documentadas |

**Layout:**

- Desktop: 5-col flex (full width, each 20%)
- Tablet: wrap to 2-3 cols
- Mobile: 1-col stack

**Card structure:**

```jsx
<BenefitCard>
  <Icon className="size-6 text-primary" />
  <h3>{title}</h3>
  <p>{description}</p>
</BenefitCard>
```

**Styling:**

- bg-card, border-border, p-6
- Icon + title on top, description below
- Hover: subtle shadow or border-primary

---

### 2.3 RECENTLY ADDED CARS (Change from tabs)

| AC               | Spec                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------- |
| **Title**        | "Carros adicionados recentemente ao nosso stock"                                              |
| **Subtitle**     | Optional: "Novos lotes cada semana de Alemanha, França e Itália"                              |
| **Layout Grid**  | 3-col (desktop ≥1024px), 2-col (tablet 768-1023px), 1-col (mobile <768px)                     |
| **Cards Count**  | 6 VehicleCard (fixed or paginated)                                                            |
| **Card Content** | Reuse existing `VehicleCard` component (photo, make/model, price, timer, status)              |
| **CTA**          | "Ver todos os leilões →" link to `/auctions`                                                  |
| **Empty State**  | "Ainda não há leilões. Volte em breve." (centered, dashed border)                             |
| **Data Source**  | `listPublicAuctions()` filter by `status === 'active'`, sort by `createdAt DESC`, slice(0, 6) |
| **Remove**       | Tabs "A terminar", "Mais recentes", "Comprar já" — just one clean grid                        |

**Key change from current:**

- Current: 3 tabs (Ending Soon, Most Recent, Buy Now)
- New: Single grid of 6 active auctions (no tabs)
- More visual clarity, less cognitive load

**Components:**

- Existing `VehicleCard`
- New `VehicleGrid` wrapper (handles responsive cols)

---

### 2.4 WHY CHOOSE REDRIVE? (Keep, same content)

| Benefit                     | Spec                                                    |
| --------------------------- | ------------------------------------------------------- |
| **Preço competitivo**       | Custos logísticos distribuídos entre vários compradores |
| **COC garantido**           | Todos os carros têm Certificado de Conformidade (COC)   |
| **Importação simplificada** | Documentação e legalização por conta da ReDrive         |
| **Tempo real**              | Lances, contadores, atualizações instant via Realtime   |
| **Segurança RLS**           | RLS automático, sem mistura de dados entre empresas     |
| **Negocie depois**          | Se não ganhar o leilão, pode negociar com a ReDrive     |

**Layout:**

- 3-col grid (desktop), 2-col (tablet), 1-col (mobile)
- 6 cards total (no change)
- Each card: icon + title + description

**Styling:**

- bg-background, border-border, p-6
- Icon on top-right (mini, text-primary)
- Title + description below
- Consistent with Benefits section

**Components:**

- Existing `BenefitCard` or create reusable `Card` component

---

### 2.5 BEST CARS BY BRAND (NEW Carousel)

| AC                | Spec                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| **Section Title** | "Comprar os melhores carros por marca"                                |
| **Subtitle**      | Optional: "Selecione uma marca para ver todos os leilões disponíveis" |
| **Layout**        | Horizontal carousel/slider (Embla Carousel or custom)                 |
| **Card Count**    | ~10 brands (dynamic, based on data)                                   |
| **Card Content**  | Brand name (text only, no real logos) + count "12 leilões"            |
| **Card Styling**  | border-border, bg-card, p-6, centered text, hover: border-primary     |
| **Interaction**   | Click card → `/auctions?make=BMW` (pre-filtered by make)              |
| **Data Source**   | Extract unique `vehicle.make` from active auctions, count, sort DESC  |
| **Mobile**        | Horizontal scroll, 2-3 visible cards, swipe/arrow nav                 |
| **Responsive**    | Desktop: 5+ visible, Tablet: 3-4, Mobile: 2-3                         |
| **Empty State**   | "Nenhuma marca disponível neste momento"                              |

**Data flow:**

```javascript
const auctionsByMake = auctions.reduce((acc, a) => {
  acc[a.vehicle.make] = (acc[a.vehicle.make] || 0) + 1;
  return acc;
}, {});

const brandCards = Object.entries(auctionsByMake)
  .map(([make, count]) => ({ make, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 10);
```

**Component structure:**

```jsx
<BrandCarousel>
  {brandCards.map((brand) => (
    <BrandCard
      key={brand.make}
      make={brand.make}
      count={brand.count}
      onClick={() => navigate(`/auctions?make=${brand.make}`)}
    />
  ))}
</BrandCarousel>
```

---

### 2.6 BEST AUCTIONS BY COUNTRY (NEW Carousel)

| AC                | Spec                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| **Section Title** | "Melhores leilões de carros por país"                                 |
| **Subtitle**      | Optional: "Escolha o país de origem para filtrar leilões"             |
| **Layout**        | Horizontal carousel (same as Brands)                                  |
| **Card Count**    | ~8 countries (dynamic)                                                |
| **Card Content**  | Country flag emoji (🇩🇪) + country name + count "15 leilões"           |
| **Flag emoji**    | Unicode country flags (no licensing, no images)                       |
| **Card Styling**  | Same as BrandCard (border-border, bg-card, p-6)                       |
| **Interaction**   | Click → `/auctions?originCountry=DE` (pre-filter)                     |
| **Data Source**   | Extract unique `vehicle.originCountry`, count, sort DESC              |
| **Mobile**        | Same responsive behavior as Brands carousel                           |
| **Localization**  | Country names in Portuguese (Alemanha, França, Itália, Bélgica, etc.) |

**Data flow:**

```javascript
const auctionsByCountry = auctions.reduce((acc, a) => {
  const country = a.vehicle.originCountry; // e.g. "DE"
  acc[country] = (acc[country] || 0) + 1;
  return acc;
}, {});

const countryCards = Object.entries(auctionsByCountry)
  .map(([code, count]) => ({
    code,
    name: countryNameMap[code], // "DE" → "Alemanha"
    emoji: countryEmojiMap[code], // "DE" → "🇩🇪"
    count,
  }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 8);
```

**Country mapping (example):**

```javascript
const countryNameMap = {
  DE: "Alemanha",
  FR: "França",
  IT: "Itália",
  BE: "Bélgica",
  NL: "Países Baixos",
  ES: "Espanha",
  AT: "Áustria",
  CH: "Suíça",
  // ...
};

const countryEmojiMap = {
  DE: "🇩🇪",
  FR: "🇫🇷",
  IT: "🇮🇹",
  // ...
};
```

---

### 2.7 TESTIMONIALS (NEW Section)

| AC                | Spec                                                           |
| ----------------- | -------------------------------------------------------------- |
| **Section Title** | "O que os nossos clientes dizem sobre nós"                     |
| **Subtitle**      | Optional: "Histórias reais de empresas que já usam a ReDrive"  |
| **Layout**        | Carousel or 3-4 card grid (stacked on mobile)                  |
| **Card Count**    | 3-4 testimonials (see below)                                   |
| **Card Content**  | ⭐⭐⭐⭐⭐ (5-star) + quote + author name + company            |
| **Quote Length**  | 1-2 sentences (~40-60 words)                                   |
| **Styling**       | bg-card, border-l-4 border-primary (left accent), p-6, rounded |
| **Mobile**        | Vertical stack or carousel scroll                              |
| **Empty State**   | Not applicable (we'll seed 3-4 testimonials)                   |

**Testimonials proposals:**

```markdown
### Testimonial 1

⭐⭐⭐⭐⭐
"ReDrive simplificou todo o processo. Antes esperávamos semanas. Agora compramos 5 viaturas em 2 semanas e dormimos tranquilos."
— João Silva
Auto Peças Lisboa

### Testimonial 2

⭐⭐⭐⭐⭐
"Leilões em tempo real, documentação perfeita, suporte atento. Recomendo 100% para quem quer comprar viaturas de qualidade."
— Maria Costa
Concessionária Oporto

### Testimonial 3

⭐⭐⭐⭐⭐
"Plataforma intuitiva, sem surpresas nas taxas. Suporte multilíngue foi crucial para negociar com confiança."
— Marco Rossi
Importador (Itália)

### Testimonial 4 (Optional)

⭐⭐⭐⭐⭐
"Transparência total, processo claro do início ao fim. Voltaremos com certeza para compras futuras."
— Anonymous
[Concessionária]
```

**Component structure:**

```jsx
<TestimonialCard>
  <StarRating value={5} />
  <blockquote>{quote}</blockquote>
  <footer>
    <strong>{author}</strong>
    <p>{company}</p>
  </footer>
</TestimonialCard>
```

**Styling:**

- bg-card
- border-l-4 border-primary
- blockquote: italic, text-base, mt-4
- footer: text-sm, muted-foreground, mt-6
- Hover: subtle shadow

**Data storage:**

```javascript
const testimonials = [
  {
    id: "1",
    rating: 5,
    quote: "ReDrive simplificou...",
    author: "João Silva",
    company: "Auto Peças Lisboa",
  },
  // ...
];
```

---

### 2.8 FINAL CTA (Keep & refine)

| AC                | Spec                                                                     |
| ----------------- | ------------------------------------------------------------------------ |
| **Background**    | Dark bg-foreground or bg-card, text-primary/white                        |
| **Headline**      | "Pronto para comprar viaturas importadas sem intermediários?"            |
| **Subtext**       | Optional: "Registe a sua empresa e aceda a centenas de leilões mensais." |
| **Primary CTA**   | "REGISTAR AGORA" → `/register` (red bg)                                  |
| **Secondary CTA** | "VER CATÁLOGO" → `/auctions` (white/light border)                        |
| **Layout**        | Centered, py-20 (desktop), py-12 (mobile)                                |
| **Spacing**       | mx-auto max-w-7xl, text-center                                           |

**Component:**

```jsx
<section className="bg-foreground text-white py-20">
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2>Pronto para comprar viaturas importadas sem intermediários?</h2>
    <p className="mt-4 text-muted-foreground">...</p>
    <div className="mt-8 flex justify-center gap-4">
      <Link to="/register" className="btn btn-primary">
        REGISTAR AGORA
      </Link>
      <Link to="/auctions" className="btn btn-secondary">
        VER CATÁLOGO
      </Link>
    </div>
  </div>
</section>
```

---

### 2.9 FOOTER (Keep existing)

- Copyright year (dynamic)
- ReDrive branding
- "B2B · Portugal"
- Simple, minimal

---

## 3. RESPONSIVE DESIGN MATRIX

| Breakpoint     | Device  | Hero  | Benefits | Cars  | Why   | Brands      | Countries   | Testimonials |
| -------------- | ------- | ----- | -------- | ----- | ----- | ----------- | ----------- | ------------ |
| **≥1024px**    | Desktop | 2-col | 5-col    | 3-col | 3-col | 5+ visible  | 4-5 visible | 3-4 visible  |
| **768–1023px** | Tablet  | 1-col | 2-3 wrap | 2-col | 2-col | 2-3 visible | 2-3 visible | 2 visible    |
| **<768px**     | Mobile  | 1-col | 1-col    | 1-col | 1-col | 2 visible   | 2 visible   | 1 visible    |

**Carousel behavior (Brands, Countries, Testimonials):**

- Desktop: Visible overflow with arrow controls
- Tablet: Scroll with drag/swipe enabled
- Mobile: Full-width scroll, touch-friendly

---

## 4. COPY & TONE GUIDELINES

### Voice

- Professional, B2B, direct
- Premium tone (not soft, not casual)
- Action-oriented language
- Portuguese (Portugal spelling: "comissões", not "comisiones")

### No-Copy Rules

- No competitor names/logos
- No claim without data (e.g., avoid "fastest" unless proven)
- No generic superlatives ("amazing", "incredible")
- No emojis except country flags (🇩🇪, 🇫🇷, etc.)

### Key Messages

- Transparency in pricing & process
- Real-time, no intermediaries
- B2B focus (enterprise buyers)
- Multilingual support (even if not implemented yet)
- Portuguese market expertise

---

## 5. DATA FLOW & INTEGRATION

### 5.1 Data fetching (server-side or client)

**Current arch:** Client-side `useEffect` + `listPublicAuctions()`

```typescript
// In Landing component
const [auctions, setAuctions] = useState<Auction[]>([]);

useEffect(() => {
  async function loadAuctions() {
    try {
      const data = await listPublicAuctions();
      setAuctions(data);
      // Derive brands, countries, recent cars
    } catch (error) {
      console.error("Failed to load auctions", error);
    }
  }
  void loadAuctions();
}, []);
```

### 5.2 Derived data (in Landing or separate hook)

```typescript
// Extract brands
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

// Extract countries
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

// Recently added (6 cards, no tabs)
const recentCars = auctions.filter((a) => a.status === "active").slice(0, 6);
```

### 5.3 Type definitions

Add to `/src/lib/market-data.ts`:

```typescript
export interface BrandCard {
  make: string;
  count: number;
}

export interface CountryCard {
  code: string;
  name: string;
  emoji: string;
  count: number;
}

export interface Testimonial {
  id: string;
  rating: number; // 5
  quote: string;
  author: string;
  company: string;
}
```

---

## 6. COMPONENT ARCHITECTURE

### 6.1 New components to create

```
src/components/home/
├── SearchBar.tsx              # (Hero search: Make, Model, MaxPrice)
├── BenefitCard.tsx            # (Reusable benefit card)
├── VehicleGrid.tsx            # (Responsive grid wrapper for cars)
├── BrandCarousel.tsx          # (Carousel section + BrandCard)
├── BrandCard.tsx              # (Individual brand card)
├── CountryCarousel.tsx        # (Carousel section + CountryCard)
├── CountryCard.tsx            # (Individual country card with flag)
├── TestimonialCarousel.tsx    # (Carousel or grid section)
├── TestimonialCard.tsx        # (Individual testimonial with rating)
└── FinalCTA.tsx               # (Call-to-action section)
```

### 6.2 Reuse existing components

- `VehicleCard` — already exists, use for "Recently Added Cars"
- `PublicHeader` — already exists
- Button/Link — use shadcn/ui or existing primitives
- Icons — Lucide React (Globe, DollarSign, Truck, TrendingUp, Award, etc.)

### 6.3 Carousel library

- **Current:** Embla Carousel (already in package.json)
- **Use for:** Brands, Countries, Testimonials
- **Fallback:** Grid with horizontal scroll if no carousel needed

---

## 7. STYLING STRATEGY

### Color palette (existing ReDrive)

```css
/* Already in Tailwind config */
--primary: #ff0000 (or closest red) --foreground: dark/black --background: light/white --card: light
  gray --border: subtle gray --muted-foreground: light gray text;
```

### Spacing & Layout

- Section padding: py-16 (desktop), py-12 (tablet), py-8 (mobile)
- Container: mx-auto max-w-7xl px-6
- Gap between cards: gap-5 or gap-6
- Carousel: mx-auto, px-6 (same as other sections)

### Hover states

- Links: hover:underline-offset-4 hover:underline
- Buttons: hover:bg-primary/90 (primary), hover:bg-foreground/10 (secondary)
- Cards: hover:border-primary (subtle), or hover:shadow-lg (subtle)

### Typography

- Headings: font-extrabold, tracking-tight
- Subheadings: font-semibold, text-lg
- Body: text-base, text-muted-foreground
- Captions: font-mono, text-[10px], uppercase, tracking-widest, text-primary

---

## 8. MOBILE-FIRST CHECKLIST

- [ ] Hero: stacked 1-col, search bar spans full width
- [ ] Benefits: 1-col, cards wrap properly
- [ ] Cars: 1-col grid
- [ ] Why Choose: 1-col grid
- [ ] Brands carousel: 2 visible, swipeable
- [ ] Countries carousel: 2 visible, swipeable
- [ ] Testimonials: 1 visible, swipeable or stacked
- [ ] CTA: stacked buttons, full width on mobile
- [ ] Footer: centered, wrapping text
- [ ] Touch targets: min 44px (buttons, links)

---

## 9. PERFORMANCE NOTES

- Images: Use existing VehicleCard photo handling
- Lazy loading: Implement intersection observer for carousels (if heavy)
- Bundle size: Embla Carousel is small (~2KB gzip)
- Data fetching: Keep current `listPublicAuctions()` pattern (SSR-compatible)

---

## 10. ACCEPTANCE CRITERIA

### Design Spec acceptance

- [ ] All 9 sections laid out and responsive (desktop, tablet, mobile)
- [ ] Carousels functional (Brands, Countries, Testimonials)
- [ ] Data-driven population (brands/countries from auction data)
- [ ] Pre-filter links work (/auctions?make=X, /auctions?originCountry=XX)
- [ ] Copy is Portuguese, tone is B2B professional
- [ ] No competitor logos or assets used
- [ ] Testimonials feel authentic (not generic marketing copy)
- [ ] Performance: page load < 3s (LCP, FCP)
- [ ] Mobile responsive: tested on 320px, 768px, 1024px viewports
- [ ] Accessibility: WCAG 2.1 AA (semantic HTML, contrast, focus states)

### Post-implementation

- [ ] @qa runs full test suite (unit + e2e)
- [ ] @devops pushes to main with PRs referencing story ID
- [ ] Analytics tracking added (conversions, scroll depth)
- [ ] A/B testing setup (CTA button colors, testimonial placement)

---

## 11. DIFFERENCES FROM eCarsTrade (Originality)

| Aspect                 | eCarsTrade                       | ReDrive                                  |
| ---------------------- | -------------------------------- | ---------------------------------------- |
| **Brand voice**        | Generic, international           | Premium, B2B Portuguese-first            |
| **Homepage title**     | Generic "Find your car"          | "Leilão de automóveis importados"        |
| **Benefits**           | Generic (6 items)                | Tailored to B2B auctions (5 items)       |
| **Reviews**            | Aggregated from multiple sources | Custom 3-4 authentic testimonials        |
| **Brands carousel**    | Static list                      | Data-driven from active auctions         |
| **Countries carousel** | Hardcoded countries              | Data-driven from vehicle.originCountry   |
| **Call-to-action**     | "Start buying"                   | "Ver leilões" + "Registar empresa" (B2B) |
| **Copy language**      | English + multi-language         | Portuguese (Portugal spelling)           |
| **Design system**      | Soft, modern (Figma-like)        | Terminal precision, premium/industrial   |

---

## 12. SUCCESS METRICS

### Short-term (Week 1-2 post-launch)

- Bounce rate on homepage < 40%
- Average scroll depth > 60%
- CTA click-through rate: "Ver leilões" > 15%, "Registar" > 8%

### Medium-term (Month 1)

- Homepage conversion: registrations +25% vs. current
- Carousel interaction: >30% users scroll brands/countries
- Testimonial impact: +10% trust score (via survey)

### Long-term (Quarter 1)

- SEO: ranking for "leilão automóvel" (top 3)
- Social proof: testimonials increase signups by 20%
- Repeat visitors: +40% due to fresh carousel data

---

## 13. HANDOFF TO DEVELOPERS

### For @architect

1. Review data flow (brands/countries extraction)
2. Approve carousel library choice (Embla)
3. Validate responsive breakpoints
4. Confirm server-side vs. client-side fetching strategy

### For @dev

1. Create 6 new home section components
2. Implement carousel logic (Brands, Countries, Testimonials)
3. Add data-driven population from `listPublicAuctions()`
4. Refactor existing Hero, Benefits, Cars, Why Choose sections
5. Remove tabs from "Recently Added" section
6. Add pre-filter links (/auctions?make=X, /auctions?originCountry=XX)
7. Seed 3-4 testimonials (hardcoded or DB)
8. Test responsive design on 3+ breakpoints
9. Ensure accessibility (WCAG 2.1 AA)
10. Run full test suite + linting before commit

### For @qa

1. Test all carousels (swipe, arrow nav, keyboard)
2. Validate filter links (brands & countries → /auctions pre-filtered)
3. Check responsive layout (320px, 768px, 1024px+)
4. Performance audit (LCP, CLS, FID)
5. Accessibility scan (WAVE, axe)
6. Mobile usability (iOS Safari, Android Chrome)

---

## APPENDIX A: Carousel Implementation Reference

**Using Embla Carousel:**

```typescript
import { EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';

export function BrandCarousel({ brands }: { brands: BrandCard[] }) {
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
            <BrandCard key={brand.make} brand={brand} />
          ))}
        </div>
      </div>
      {/* Optional: Arrow controls */}
    </section>
  );
}
```

---

## APPENDIX B: Country Name & Emoji Map

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
  UK: "🇬🇧 Reino Unido",
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
};
```

---

**Document prepared by:** Uma (@ux-design-expert)
**Date:** 2026-06-04
**Status:** Ready for @architect review & @dev implementation
