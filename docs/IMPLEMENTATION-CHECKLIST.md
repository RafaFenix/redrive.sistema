# ReDrive Home Redesign — Implementation Checklist

**Target Audience:** @dev, @qa, @devops
**Date:** 2026-06-04
**Reference Docs:** UX-REDESIGN-HOME.md, COMPONENT-IMPLEMENTATION-GUIDE.md

---

## PHASE 1: COMPONENT CREATION (Days 1-2)

### SearchBar Component

- [ ] Create `src/components/home/SearchBar.tsx`
- [ ] Props: makes array, onSearch callback
- [ ] 3 inputs: Make (Select), Model (Input), Max Price (Input/Slider)
- [ ] Submit button "BUSCAR"
- [ ] Responsive: 4-col desktop, stacked mobile
- [ ] Unit test: renders all inputs, submit triggers callback

### BenefitCard Component

- [ ] Create `src/components/home/BenefitCard.tsx`
- [ ] Props: icon, title, description
- [ ] Styling: bg-card, border-border, p-6, hover:border-primary
- [ ] Reusable for 5 Hero benefits + 6 Why Choose benefits
- [ ] Unit test: renders icon, title, description

### VehicleGrid Component

- [ ] Create `src/components/home/VehicleGrid.tsx`
- [ ] Props: auctions array, limit, responsive columns
- [ ] Grid: 1-col (mobile), 2-col (tablet), 3-col (desktop)
- [ ] Reuses existing VehicleCard
- [ ] Unit test: renders correct number of cards, responsive

### BrandCarousel Component

- [ ] Create `src/components/home/BrandCarousel.tsx`
- [ ] Uses Embla Carousel library (already in package.json)
- [ ] Props: brands array, onBrandClick callback
- [ ] Responsive: 5+ visible (desktop), 2-3 (mobile)
- [ ] Arrow navigation prev/next
- [ ] Touch/swipe support
- [ ] Unit test: carousel navigation works, click triggers callback

### BrandCard Component

- [ ] Create `src/components/home/BrandCard.tsx`
- [ ] Props: brand (make + count), onClick
- [ ] Layout: Brand name (bold), count (muted)
- [ ] Styling: min-w-[200px], border, hover:border-primary
- [ ] Unit test: renders brand name + count, click works

### CountryCarousel Component

- [ ] Create `src/components/home/CountryCarousel.tsx`
- [ ] Same as BrandCarousel (reuse pattern)
- [ ] Props: countries array, onCountryClick callback
- [ ] Unit test: carousel navigation, click triggers callback

### CountryCard Component

- [ ] Create `src/components/home/CountryCard.tsx`
- [ ] Props: country (code, name, emoji, count), onClick
- [ ] Layout: Flag emoji (3xl), name, count
- [ ] Styling: centered, min-w-[200px], hover:border-primary
- [ ] Unit test: renders flag + name + count, click works

### TestimonialCard Component

- [ ] Create `src/components/home/TestimonialCard.tsx`
- [ ] Props: testimonial (rating, quote, author, company)
- [ ] Layout: 5-star rating, blockquote, footer with author+company
- [ ] Styling: border-l-4 border-primary, bg-card, p-6
- [ ] Unit test: renders all testimonial data correctly

### TestimonialCarousel/Grid Component

- [ ] Create `src/components/home/TestimonialCarousel.tsx` OR `TestimonialGrid.tsx`
- [ ] Recommendation: Grid (simpler, 3 visible on desktop)
- [ ] Props: testimonials array
- [ ] Responsive: 1-col (mobile), 2-col (tablet), 3-col (desktop)
- [ ] Unit test: renders all testimonials

### FinalCTA Component

- [ ] Create `src/components/home/FinalCTA.tsx`
- [ ] Props: headlineText, subtextText (optional, with defaults)
- [ ] Layout: Dark background, centered, 2 CTAs
- [ ] Styling: bg-foreground, text-white, py-20
- [ ] Unit test: renders headline, both CTA buttons

### Section Wrapper Components (optional)

- [ ] Create section wrappers for cleaner code (HeroSection, BenefitsSection, etc.)
- [ ] OR keep sections inline in Landing component (simpler)

---

## PHASE 2: DATA INTEGRATION (Days 1-2, parallel)

### Add Types to market-data.ts

- [ ] Add `BrandCard` interface: `{ make: string; count: number }`
- [ ] Add `CountryCard` interface: `{ code: string; name: string; emoji: string; count: number }`
- [ ] Add `Testimonial` interface: `{ id: string; rating: number; quote: string; author: string; company: string }`

### Add Country Mappings

- [ ] Create `src/lib/country-map.ts` OR add to existing utils
- [ ] Export `countryNameMap` (code → Portuguese name)
- [ ] Export `countryEmojiMap` (code → flag emoji)
- [ ] Test: All 8 countries (DE, FR, IT, BE, NL, ES, AT, CH) mapped

### Add Testimonials Data

- [ ] Create `src/lib/testimonials.ts` OR hardcode in component
- [ ] Export 3-4 mock testimonials
- [ ] Test: All testimonials have rating, quote, author, company

### Refactor Landing Component

- [ ] Import all 9 new components
- [ ] Remove old "How It Works" section (if keeping, move to separate page)
- [ ] Update state: auctions, isLoading, error
- [ ] Add derived data: brandsData, countriesData, recentCars, makes (useMemo)
- [ ] Replace HTML sections with new components
- [ ] Pass props: auctions, brandsData, countriesData, etc.
- [ ] Pass callbacks: onBrandClick, onCountryClick, onSearch
- [ ] Test: All sections render with correct data

---

## PHASE 3: REFACTORING EXISTING SECTIONS (Days 2-3)

### Hero Section

- [ ] Add SearchBar component
- [ ] Keep existing stats grid (or refactor with StatsCard component)
- [ ] Adjust layout: text left (col-span-7), stats right (col-span-5)
- [ ] Test: Responsive on mobile (1-col stacked)

### Benefits Section

- [ ] Create BenefitCard component
- [ ] Map heroBenefits array through component
- [ ] Grid: 5-col (desktop), 2-3 wrap (tablet), 1-col (mobile)
- [ ] Test: All 5 benefits render, responsive

### Recently Added Section

- [ ] Remove 3 tabs ("A terminar", "Mais recentes", "Comprar já")
- [ ] Use VehicleGrid component
- [ ] Filter: `auctions.filter(a => a.status === 'active').slice(0, 6)`
- [ ] Test: Grid shows exactly 6 cards, responsive, no tabs

### Why Choose Section

- [ ] Create BenefitCard component (reuse from Hero)
- [ ] Map whyChooseBenefits array through component
- [ ] Grid: 3-col (desktop), 2-col (tablet), 1-col (mobile)
- [ ] Test: All 6 cards render, responsive

---

## PHASE 4: CAROUSEL IMPLEMENTATION (Days 2-3)

### Embla Carousel Setup

- [ ] Verify `embla-carousel` in package.json (should exist)
- [ ] Import `useEmblaCarousel` in BrandCarousel/CountryCarousel
- [ ] Initialize with config: `{ align: 'start', skipSnaps: false, dragFree: true }`
- [ ] Test: Drag/swipe works on touch, smooth scrolling

### Brand Carousel Navigation

- [ ] Add prev/next arrow buttons
- [ ] Connect to Embla API: `emblaApi.scrollPrev()`, `emblaApi.scrollNext()`
- [ ] Disable arrows at boundaries (optional)
- [ ] Test: Arrow buttons work, carousel scrolls, click cards navigate to /auctions?make=X

### Country Carousel Navigation

- [ ] Same as Brand carousel
- [ ] Test: Arrow buttons work, carousel scrolls, click cards navigate to /auctions?originCountry=XX

### Mobile Carousel UX

- [ ] Ensure 2-3 cards visible on mobile (not 1)
- [ ] Touch swipe works smoothly
- [ ] No overflow issues
- [ ] Test: on device (iPhone 12, Android phone)

---

## PHASE 5: SEARCH BAR INTEGRATION (Days 2-3)

### SearchBar Functionality

- [ ] Extract unique makes from auctions
- [ ] Pass makes array to SearchBar as options
- [ ] Handle submit: navigate to `/auctions?make=X&model=Y&maxPrice=Z`
- [ ] Test: All 3 inputs work, submit navigates correctly

### Search Filtering

- [ ] Optional: Link to /auctions page and apply filters there
- [ ] Verify /auctions page handles query params: ?make, ?model, ?maxPrice
- [ ] Test: Pre-filtered results appear on /auctions

---

## PHASE 6: TESTING (Days 3-4)

### Unit Tests (Jest)

**SearchBar.test.tsx**

- [ ] Renders Make, Model, MaxPrice inputs
- [ ] Renders submit button
- [ ] Calls onSearch callback with correct data

**BenefitCard.test.tsx**

- [ ] Renders icon, title, description
- [ ] Applies correct styling classes

**VehicleGrid.test.tsx**

- [ ] Renders correct number of VehicleCard children
- [ ] Applies responsive grid classes

**BrandCarousel.test.tsx**

- [ ] Renders all brands
- [ ] Click brand calls onBrandClick
- [ ] Arrow buttons toggle enabled/disabled state

**CountryCarousel.test.tsx**

- [ ] Renders all countries with emoji
- [ ] Click country calls onCountryClick

**TestimonialCard.test.tsx**

- [ ] Renders rating, quote, author, company
- [ ] Applies correct styling (border-l-4)

**Landing.test.tsx**

- [ ] Loads auctions from listPublicAuctions()
- [ ] Renders all sections (Hero, Benefits, Cars, Why, Brands, Countries, Testimonials, CTA)
- [ ] Handles loading + error states

### E2E Tests (Playwright)

**homepage.spec.ts**

- [ ] Navigate to `/`
- [ ] Hero renders with headline "Leilão de automóveis importados"
- [ ] SearchBar renders with Make, Model, MaxPrice inputs
- [ ] Benefits section renders 5 cards
- [ ] Recently added renders 6 VehicleCard elements
- [ ] Why choose renders 6 cards
- [ ] Brand carousel renders (swipe/arrow works)
- [ ] Country carousel renders (swipe/arrow works)
- [ ] Testimonials render 3+ cards
- [ ] Final CTA renders with 2 buttons
- [ ] Click "Ver leilões" → navigates to `/auctions`
- [ ] Click "Registar empresa" → navigates to `/register`
- [ ] Click brand card → navigates to `/auctions?make=BMW`
- [ ] Click country card → navigates to `/auctions?originCountry=DE`

### Responsive Testing

**Breakpoints to test: 320px (mobile), 768px (tablet), 1024px+ (desktop)**

- [ ] Mobile (320px):
  - Hero: 1-col stacked
  - Benefits: 1-col stack
  - Cars: 1-col grid
  - Carousels: 2 visible, swipeable
  - All buttons/inputs: full-width or touch-friendly
  - No horizontal overflow

- [ ] Tablet (768px):
  - Hero: 1-col or 2-col
  - Benefits: 2-3 wrap
  - Cars: 2-col grid
  - Carousels: 2-3 visible
  - Layout: comfortable spacing

- [ ] Desktop (1024px+):
  - Hero: 2-col (text left, stats right)
  - Benefits: 5-col
  - Cars: 3-col grid
  - Why: 3-col grid
  - Carousels: 5+ visible
  - Full-width sections, proper spacing

### Accessibility Testing (WCAG 2.1 AA)

- [ ] Color contrast: All text 4.5:1 or higher (use axe, WAVE)
- [ ] Keyboard navigation: Tab through all interactive elements
- [ ] Focus outline: Visible on all buttons/links
- [ ] Alt text: All images have descriptive alt (VehicleCard photos)
- [ ] Semantic HTML: Section, article, h2, h3, button, link elements
- [ ] Screen reader: Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] Carousels: Arrow keys work, ARIA labels present
- [ ] Form accessibility: Inputs have labels, error handling

**Tools:**

- Axe DevTools (Chrome extension)
- WAVE (WebAIM)
- Lighthouse (Chrome DevTools)

### Performance Testing

- [ ] LCP (Largest Contentful Paint): < 2.5s
- [ ] FID (First Input Delay): < 100ms
- [ ] CLS (Cumulative Layout Shift): < 0.1
- [ ] Bundle size: No unexpected growth
- [ ] Image optimization: VehicleCard photos lazy-loaded
- [ ] Carousel library: No jank, smooth scrolling

**Tools:**

- Chrome DevTools (Lighthouse)
- WebPageTest
- GTmetrix

---

## PHASE 7: CODE QUALITY (Day 4)

### Linting & Type Checking

- [ ] Run `npm run lint` — all files pass
- [ ] Run `npm run typecheck` — no TS errors
- [ ] Fix ESLint violations (spacing, naming, unused imports)

### Code Review

- [ ] Components follow naming conventions (PascalCase)
- [ ] Props are properly typed (TypeScript interfaces)
- [ ] No console.log() left behind
- [ ] Comments for complex logic
- [ ] DRY principle: no duplicated code

### Documentation

- [ ] Each component has JSDoc comments
- [ ] Complex functions explained
- [ ] Usage examples in README or component file

---

## PHASE 8: COMMIT & PUSH (Day 5)

### Git Workflow

- [ ] Create feature branch (if not already on main)
- [ ] Commit with conventional message: `feat: redesign homepage with carousels and testimonials`
- [ ] Include story reference: `[Story X.Y]` in commit message
- [ ] All tests passing before commit
- [ ] Run linting/typecheck before commit

### PR Preparation

- [ ] Create PR with clear description
- [ ] Link to design docs (UX-REDESIGN-HOME.md)
- [ ] List changes: new components, refactored sections, removed sections
- [ ] Include screenshots (desktop + mobile)
- [ ] Tag reviewers: @qa, @architect

### Code Review

- [ ] @qa reviews for functionality
- [ ] @architect reviews for architecture decisions
- [ ] Address feedback, push new commits

### Merge & Deploy

- [ ] @devops merges PR to main
- [ ] Trigger CI/CD pipeline
- [ ] Monitor performance metrics (LCP, CLS, FID)
- [ ] Monitor conversion metrics (registration CTR)

---

## PHASE 9: POST-LAUNCH MONITORING (Week 1)

### Performance Metrics

- [ ] LCP stable < 2.5s
- [ ] No CLS spikes > 0.1
- [ ] Hero section loads immediately
- [ ] Carousels scroll smoothly (no jank)

### Conversion Metrics

- [ ] "Ver leilões" CTR > 15%
- [ ] "Registar empresa" CTR > 8%
- [ ] Registration completion rate tracked
- [ ] Bounce rate < 40%
- [ ] Scroll depth > 60% (users see carousels/testimonials)

### User Feedback

- [ ] Monitor support tickets (issues with carousels, forms)
- [ ] Check analytics: which carousels get clicks?
- [ ] A/B test potential: CTA button colors, testimonial placement

### Bug Fixes

- [ ] If critical bugs found: hotfix → push immediately
- [ ] If minor: backlog for next sprint

---

## DEPENDENCIES CHECKLIST

### Already in package.json

- [x] React 19+
- [x] TanStack Router v1
- [x] TanStack Query v5
- [x] Tailwind CSS v4
- [x] shadcn/ui (Button, Link, Select, Input, etc.)
- [x] Lucide React (icons)
- [x] Embla Carousel (carousel library)
- [x] date-fns (date formatting, if needed)

### No new dependencies needed

- [ ] All required libraries already present
- [ ] No additional npm install required

---

## FILE STRUCTURE (After completion)

```
src/
├── routes/
│   └── index.tsx (refactored Landing — 100-150 lines)
├── components/
│   ├── home/
│   │   ├── SearchBar.tsx
│   │   ├── BenefitCard.tsx
│   │   ├── VehicleGrid.tsx
│   │   ├── BrandCarousel.tsx
│   │   ├── BrandCard.tsx
│   │   ├── CountryCarousel.tsx
│   │   ├── CountryCard.tsx
│   │   ├── TestimonialCard.tsx
│   │   ├── TestimonialCarousel.tsx (or TestimonialGrid.tsx)
│   │   └── FinalCTA.tsx
│   ├── layout/
│   │   └── PublicHeader.tsx (existing)
│   ├── vehicle/
│   │   └── VehicleCard.tsx (existing)
│   └── ui/ (existing shadcn components)
├── lib/
│   ├── market-data.ts (add BrandCard, CountryCard, Testimonial types)
│   ├── country-map.ts (NEW — country name + emoji mappings)
│   ├── testimonials.ts (NEW — testimonial data)
│   └── ...
└── docs/
    ├── UX-REDESIGN-HOME.md
    ├── COMPONENT-IMPLEMENTATION-GUIDE.md
    ├── REDESIGN-ASSETS.md
    ├── REDESIGN-EXECUTIVE-SUMMARY.md
    ├── MOCK-DATA-REFERENCE.md
    └── IMPLEMENTATION-CHECKLIST.md (this file)
```

---

## FINAL CHECKLIST (Before Handoff to @devops)

- [ ] All 9 components created + tested
- [ ] Landing component refactored
- [ ] All sections responsive (320px, 768px, 1024px)
- [ ] Carousels functional (swipe + arrow nav)
- [ ] Filter links working (/auctions?make=X, /auctions?originCountry=XX)
- [ ] Unit tests passing (Jest)
- [ ] E2E tests passing (Playwright)
- [ ] Linting passing (`npm run lint`)
- [ ] TypeScript passing (`npm run typecheck`)
- [ ] Accessibility compliant (WCAG 2.1 AA)
- [ ] Performance meets targets (LCP < 2.5s)
- [ ] No console errors/warnings
- [ ] Code reviewed + approved
- [ ] Commit message clear + story-referenced
- [ ] PR ready for merge
- [ ] Screenshots included (desktop + mobile)

---

**Prepared by:** Uma (@ux-design-expert)
**Reviewed by:** [pending @architect]
**Date:** 2026-06-04
**Status:** Ready for @dev to start Phase 1

**Questions?** Reference UX-REDESIGN-HOME.md or COMPONENT-IMPLEMENTATION-GUIDE.md
