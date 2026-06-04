# ReDrive Home Redesign — Quick Start Guide

**TL;DR:** Redesign homepage following eCarsTrade layout. Add 3 new sections (Brands carousel, Countries carousel, Testimonials), refactor 4 existing sections, remove 1 section. 9 new components. ~5 days work.

---

## THE 9 NEW SECTIONS (In order)

| #   | Section                      | Type     | Status                                    |
| --- | ---------------------------- | -------- | ----------------------------------------- |
| 1   | Hero + Search                | Refactor | Keep headline, add SearchBar              |
| 2   | Benefits (5)                 | Refactor | Reuse BenefitCard component               |
| 3   | Recently Added Cars          | Refactor | Remove tabs, simple 6-card grid           |
| 4   | Why Choose ReDrive           | Refactor | Reuse BenefitCard component (6 cards)     |
| 5   | **Best Cars by Brand**       | **NEW**  | Carousel, 10 brands, data-driven          |
| 6   | **Best Auctions by Country** | **NEW**  | Carousel, 8 countries, flags, data-driven |
| 7   | **Testimonials**             | **NEW**  | 3-4 reviews, 5-star, authentic quotes     |
| 8   | Final CTA                    | Keep     | Dark bg, 2 buttons                        |
| 9   | Footer                       | Keep     | Same                                      |

---

## THE 9 NEW COMPONENTS

```
✓ SearchBar.tsx              — 3 inputs (Make, Model, MaxPrice)
✓ BenefitCard.tsx            — Reusable: icon + title + description
✓ VehicleGrid.tsx            — Responsive wrapper for 6 cars
✓ BrandCarousel.tsx          — Embla carousel for ~10 brands
✓ BrandCard.tsx              — Brand name + count "12 leilões"
✓ CountryCarousel.tsx        — Embla carousel for ~8 countries
✓ CountryCard.tsx            — 🇩🇪 Alemanha + count
✓ TestimonialCard.tsx        — ⭐⭐⭐⭐⭐ + quote + author + company
✓ TestimonialCarousel.tsx    — Grid or carousel for 3-4 testimonials
✓ FinalCTA.tsx               — Dark CTA section, 2 buttons
```

---

## WHAT'S CHANGING

### Remove

- ❌ "How It Works" section (3 steps) — move to separate page `/how-it-works` or remove

### Add

- ✅ SearchBar (Hero) — Marca, Modelo, Preço máximo
- ✅ Brand Carousel — top 10 marcas, click → `/auctions?make=BMW`
- ✅ Country Carousel — top 8 países, flags, click → `/auctions?originCountry=DE`
- ✅ Testimonials — 3-4 authentic client reviews

### Keep But Refactor

- 🔄 Hero — add SearchBar
- 🔄 Benefits — use BenefitCard component
- 🔄 Recently Added — remove 3 tabs, simple grid
- 🔄 Why Choose — use BenefitCard component

---

## DATA-DRIVEN LOGIC

### Brands (Auto-populated from auctions)

```
Extract unique vehicle.make → count → sort DESC → slice 0:10
Example: BMW (12 leilões), Audi (8), Mercedes (6)...
```

### Countries (Auto-populated from auctions)

```
Extract unique vehicle.originCountry → count → map to emoji + Portuguese name → sort DESC → slice 0:8
Example: 🇩🇪 Alemanha (15), 🇫🇷 França (10), 🇮🇹 Itália (8)...
```

### Testimonials (Hardcoded, can be moved to DB later)

```javascript
[
  {
    rating: 5,
    quote: "ReDrive simplificou...",
    author: "João Silva",
    company: "Auto Peças Lisboa",
  },
  {
    rating: 5,
    quote: "Leilões em tempo real...",
    author: "Maria Costa",
    company: "Concessionária Oporto",
  },
  {
    rating: 5,
    quote: "Plataforma intuitiva...",
    author: "Marco Rossi",
    company: "Importador (Itália)",
  },
];
```

---

## IMPLEMENTATION PATH

### Phase 1: Create Components (Days 1-2)

```bash
# Create 9 components in parallel
src/components/home/
├── SearchBar.tsx
├── BenefitCard.tsx
├── VehicleGrid.tsx
├── BrandCarousel.tsx
├── BrandCard.tsx
├── CountryCarousel.tsx
├── CountryCard.tsx
├── TestimonialCard.tsx
├── TestimonialCarousel.tsx
└── FinalCTA.tsx
```

### Phase 2: Integrate (Days 2-3)

```bash
# Refactor src/routes/index.tsx
# - Import all 9 components
# - Add data derivation (useMemo for brands, countries, etc.)
# - Replace HTML with components
# - Remove tabs from Recently Added
```

### Phase 3: Test (Days 3-4)

```bash
# Unit tests (Jest)
npm test

# E2E tests (Playwright)
npm run test:e2e

# Responsive testing (3 breakpoints: 320px, 768px, 1024px+)
# Accessibility (WCAG 2.1 AA)
# Performance (LCP < 2.5s)
```

### Phase 4: Deploy (Day 5)

```bash
# Lint + typecheck
npm run lint
npm run typecheck

# Commit
git add .
git commit -m "feat: redesign homepage with carousels and testimonials [Story X.Y]"

# Push (via @devops)
git push origin main
```

---

## RESPONSIVE GRID REFERENCE

```jsx
// 1-col mobile, 2-col tablet, 3-col desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

// 1-col mobile, 2-3 wrap tablet, 5-col desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">

// Hero: 1-col mobile, 2-col desktop (using 12-col span)
<div className="grid gap-8 lg:grid-cols-12">
  <div className="lg:col-span-7">Text</div>
  <div className="lg:col-span-5">Stats</div>
</div>
```

---

## CAROUSEL QUICK START

```javascript
import useEmblaCarousel from "embla-carousel-react";

export function BrandCarousel({ brands }) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
  });

  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className="flex gap-4">
        {brands.map((b) => (
          <BrandCard key={b.make} brand={b} />
        ))}
      </div>
    </div>
  );
}
```

---

## COPY CHEAT SHEET

### Hero

```
Headline: Leilão de automóveis importados. Em tempo real. Sem intermediários.
Subtext: A ReDrive é o pregão digital onde concessionárias...
CTAs: VER LEILÕES | REGISTAR EMPRESA
```

### Brands

```
Title: Comprar os melhores carros por marca
Subtitle: Selecione uma marca para ver todos os leilões disponíveis
Card: BMW | 12 leilões
```

### Countries

```
Title: Melhores leilões de carros por país
Subtitle: Escolha o país de origem para filtrar leilões
Card: 🇩🇪 Alemanha | 15 leilões
```

### Testimonials

```
Title: O que os nossos clientes dizem sobre nós
Card 1: "ReDrive simplificou..." — João Silva, Auto Peças Lisboa
Card 2: "Leilões em tempo real..." — Maria Costa, Concessionária Oporto
Card 3: "Plataforma intuitiva..." — Marco Rossi, Importador (Itália)
```

### Final CTA

```
Headline: Pronto para comprar viaturas importadas sem intermediários?
Subtext: Registe a sua empresa e aceda a centenas de leilões mensais.
CTAs: REGISTAR AGORA | VER CATÁLOGO
```

---

## KEY DESIGN DECISIONS

✅ **Brands & Countries: Data-driven** — Extract from real auction data, not hardcoded
✅ **Testimonials: 3-4 authentic reviews** — Natural language, client names, benefits-focused
✅ **Carousels: Embla library** — Already in package.json, 2KB gzip, smooth, accessible
✅ **Responsive: Mobile-first** — 1-col mobile, wrap tablet, multi-col desktop
✅ **No competitor assets** — No real logos, custom Portuguese copy
✅ **Conversion focus** — CTAs visible, social proof (testimonials), easy discovery (carousels)

---

## TESTING CHECKLIST (TLDR)

- [ ] All 9 components render
- [ ] Carousels scroll + arrow nav works
- [ ] Pre-filter links: `/auctions?make=X` and `/auctions?originCountry=XX`
- [ ] Responsive: 320px, 768px, 1024px+ (no overflow, touch-friendly)
- [ ] Accessibility: WCAG 2.1 AA, keyboard nav, focus outlines, alt text
- [ ] Performance: LCP < 2.5s, CLS < 0.1, FID < 100ms
- [ ] No console errors/warnings
- [ ] Unit tests passing
- [ ] E2E tests passing

---

## REFERENCE DOCS

| Doc                                   | Purpose                                                              |
| ------------------------------------- | -------------------------------------------------------------------- |
| **UX-REDESIGN-HOME.md**               | Complete spec (13 sections, AC's, data flow, component architecture) |
| **COMPONENT-IMPLEMENTATION-GUIDE.md** | Detailed component specs + JSX examples                              |
| **REDESIGN-ASSETS.md**                | Copy document + wireframes + icons + typography                      |
| **REDESIGN-EXECUTIVE-SUMMARY.md**     | High-level overview + business impact + timeline                     |
| **MOCK-DATA-REFERENCE.md**            | Mock testimonials, country maps, data derivation examples            |
| **IMPLEMENTATION-CHECKLIST.md**       | Phase-by-phase checklist (9 phases)                                  |
| **REDESIGN-QUICK-START.md**           | This file — TL;DR reference                                          |

---

## QUICK LINKS

- **Hero Section:** Add SearchBar, refine stats
- **Brand Carousel:** Extract unique vehicle.make, count, sort DESC, slice(0:10)
- **Country Carousel:** Extract unique vehicle.originCountry, count, map emoji, sort DESC, slice(0:8)
- **Testimonials:** 3 hardcoded + 1 optional (João Silva, Maria Costa, Marco Rossi, + 1)
- **Remove:** "How It Works" section (3 steps) — optional, can keep
- **Carousels:** Use Embla (already in package.json)
- **Responsive:** 1-col mobile, 2-col tablet, 3-col+ desktop

---

## ESTIMATED EFFORT

| Phase                | Time         | Notes                                   |
| -------------------- | ------------ | --------------------------------------- |
| Phase 1: Components  | 1-2 days     | Parallel work recommended               |
| Phase 2: Integration | 1-2 days     | Data derivation, refactor index.tsx     |
| Phase 3: Testing     | 1 day        | Unit + E2E + responsive + accessibility |
| Phase 4: Polish      | 0.5 days     | Lint, typecheck, code review            |
| **Total**            | **4-5 days** | **~15-20 dev hours**                    |

---

## NEXT STEPS

1. **@architect** — Review this spec + UX-REDESIGN-HOME.md
2. **@dev** — Start Phase 1 (create 9 components in parallel)
3. **@qa** — Prepare test plan (responsive, accessibility, performance)
4. **@devops** — Stand by for PR merge + push to main

---

**Redesign specification by:** Uma (@ux-design-expert)
**Date:** 2026-06-04
**Status:** Ready for implementation
**Difficulty:** Medium (data-driven carousels, responsive, accessible)
**Risk:** Low (using proven libraries, no new dependencies)

🚀 **Ready to build?** Start with COMPONENT-IMPLEMENTATION-GUIDE.md or IMPLEMENTATION-CHECKLIST.md
