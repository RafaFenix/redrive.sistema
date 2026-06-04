# ReDrive Home Redesign — Documentation Index

**Project:** ReDrive Homepage Redesign
**Designer:** Uma (@ux-design-expert)
**Date:** 2026-06-04
**Status:** Design Specification Complete ✓ Ready for Implementation
**Target:** @architect, @dev, @qa, @devops

---

## DOCUMENTATION MAP

### 1. QUICK START (Start here)

**File:** `REDESIGN-QUICK-START.md` (9 KB, 5-min read)

**Best for:** Getting the gist quickly

- TL;DR of all 9 sections
- 9 new components list
- Data-driven logic overview
- Copy cheat sheet
- Phase timeline (4-5 days, 15-20 hours)

**Who reads it:** Everyone (architects, devs, PMs)

---

### 2. COMPLETE SPECIFICATION

**File:** `UX-REDESIGN-HOME.md` (27 KB, 30-min read)

**Best for:** Comprehensive understanding

- 13 detailed sections with acceptance criteria (AC)
- Section-by-section layout, specs, and data flow
- Responsive design matrix (3 breakpoints)
- Copy & tone guidelines
- Component architecture
- Styling strategy
- Performance notes
- Success metrics & KPIs
- Handoff to @architect & @dev

**Who reads it:** @architect (validation), @dev (implementation), @pm (metrics)

---

### 3. COMPONENT GUIDE

**File:** `COMPONENT-IMPLEMENTATION-GUIDE.md` (18 KB, 20-min read)

**Best for:** Implementation details

- Component tree diagram
- 9 component specifications (props, features, code examples)
- Refactoring checklist (existing sections)
- Data preparation (useMemo patterns)
- Migration path (phased approach)
- Testing strategy (unit + E2E)
- File structure (after implementation)
- Accessibility checklist

**Who reads it:** @dev (primary), @qa (testing strategy)

---

### 4. COPY & ASSETS

**File:** `REDESIGN-ASSETS.md` (28 KB, 25-min read)

**Best for:** Copy, wireframes, visual reference

- Complete copy document (9 sections, word-for-word)
- Detailed ASCII wireframes (desktop + mobile samples)
- Color palette & icons (Lucide React)
- Typography scale
- Spacing scale
- Hover states
- Accessibility notes
- Performance targets

**Who reads it:** @dev (copy + styling), @qa (visual validation), @pm (brand voice)

---

### 5. EXECUTIVE SUMMARY

**File:** `REDESIGN-EXECUTIVE-SUMMARY.md` (12 KB, 10-min read)

**Best for:** Stakeholders & decision-makers

- Overview (eCarsTrade reference, ReDrive differentiation)
- What's changing (new sections, refactored sections, removed sections)
- Business impact (conversion goals, SEO benefits, UX improvements)
- Technical details (components, data sources, styling)
- Timeline & effort (4-5 days, 9 components)
- Design checklist
- Success criteria
- Differences from eCarsTrade

**Who reads it:** PMs, stakeholders, @devops (planning)

---

### 6. MOCK DATA & EXAMPLES

**File:** `MOCK-DATA-REFERENCE.md` (17 KB, 15-min read)

**Best for:** Development reference

- Mock testimonials (3-4 hardcoded)
- Country mapping (code → Portuguese name + emoji)
- Mock brands data (top 10 brands with counts)
- Mock countries data (top 8 countries with counts)
- Benefits data (5 hero + 6 why choose)
- Data derivation examples (JavaScript)
- Component usage examples (JSX)
- Full Landing component refactor example
- Tailwind class reference
- Search bar setup

**Who reads it:** @dev (copy-paste friendly examples)

---

### 7. IMPLEMENTATION CHECKLIST

**File:** `IMPLEMENTATION-CHECKLIST.md` (15 KB, phase-by-phase)

**Best for:** Day-by-day execution

- Phase 1: Component creation (9 components, detailed spec for each)
- Phase 2: Data integration (types, mappings, testimonials, Landing refactor)
- Phase 3: Refactoring existing sections (Hero, Benefits, Cars, Why)
- Phase 4: Carousel implementation (Embla setup, navigation, mobile UX)
- Phase 5: Search bar integration (functionality, filtering)
- Phase 6: Testing (unit, E2E, responsive, accessibility, performance)
- Phase 7: Code quality (linting, type checking, documentation)
- Phase 8: Commit & push (git workflow, PR, merge)
- Phase 9: Post-launch monitoring (metrics, feedback, bugs)
- Dependencies checklist
- Final checklist (before handoff)

**Who reads it:** @dev (daily guide), @qa (testing phase)

---

## DOCUMENT RELATIONSHIPS

```
REDESIGN-QUICK-START.md
    ↓ (Need more detail?)
    ├→ UX-REDESIGN-HOME.md (spec details)
    ├→ COMPONENT-IMPLEMENTATION-GUIDE.md (code details)
    ├→ REDESIGN-ASSETS.md (copy & visual)
    ├→ MOCK-DATA-REFERENCE.md (examples)
    └→ IMPLEMENTATION-CHECKLIST.md (daily plan)

REDESIGN-EXECUTIVE-SUMMARY.md
    ↓ (For stakeholders/PMs)
    → Links to all above docs
```

---

## QUICK NAVIGATION

| Role               | Start with                             | Then read                            | Reference                        |
| ------------------ | -------------------------------------- | ------------------------------------ | -------------------------------- |
| **PM/Stakeholder** | QUICK-START + EXECUTIVE-SUMMARY        | UX-REDESIGN-HOME (metrics)           | REDESIGN-ASSETS (copy tone)      |
| **@architect**     | UX-REDESIGN-HOME                       | COMPONENT-GUIDE (architecture)       | MOCK-DATA (data flow)            |
| **@dev**           | QUICK-START + COMPONENT-GUIDE          | UX-REDESIGN-HOME + MOCK-DATA         | IMPLEMENTATION-CHECKLIST (daily) |
| **@qa**            | QUICK-START + IMPLEMENTATION-CHECKLIST | COMPONENT-GUIDE (testing)            | REDESIGN-ASSETS (visual)         |
| **@devops**        | EXECUTIVE-SUMMARY                      | IMPLEMENTATION-CHECKLIST (phase 8-9) | QUICK-START (overview)           |

---

## KEY INFORMATION AT A GLANCE

### What's Being Built

- **9 new components** (SearchBar, BenefitCard, VehicleGrid, BrandCarousel, BrandCard, CountryCarousel, CountryCard, TestimonialCard, TestimonialCarousel)
- **3 new sections** (Brand Carousel, Country Carousel, Testimonials)
- **4 refactored sections** (Hero, Benefits, Recently Added, Why Choose)
- **1 removed section** (How It Works — optional)

### Implementation Timeline

- **Phase 1:** Components (1-2 days)
- **Phase 2:** Integration (1-2 days)
- **Phase 3:** Testing (1 day)
- **Phase 4:** Deploy (0.5 days)
- **Total:** 4-5 days, ~15-20 dev hours

### Key Technologies

- **Carousel:** Embla Carousel (already in package.json)
- **Styling:** Tailwind CSS v4 + OKLCH (existing)
- **Icons:** Lucide React (existing)
- **Data:** `listPublicAuctions()` (existing API)
- **No new dependencies needed**

### Success Metrics

- **Conversion:** +25% registrations (vs. current)
- **Engagement:** >30% users interact with carousels
- **Performance:** LCP < 2.5s, CLS < 0.1, FID < 100ms
- **Trust:** +10% trust score via testimonials

---

## FREQUENTLY ASKED QUESTIONS

### Q: Do I need to read all documents?

**A:** No. Read QUICK-START first, then jump to your role's doc:

- PM: EXECUTIVE-SUMMARY
- @architect: UX-REDESIGN-HOME
- @dev: COMPONENT-GUIDE + IMPLEMENTATION-CHECKLIST
- @qa: IMPLEMENTATION-CHECKLIST (testing phase)

### Q: What if I only have 5 minutes?

**A:** Read REDESIGN-QUICK-START.md. It's all you need.

### Q: Where's the Figma design?

**A:** No Figma yet. These docs are the spec. @dev will implement components. (Figma can be created post-implementation if needed.)

### Q: Can I copy-paste code examples?

**A:** Yes! MOCK-DATA-REFERENCE.md has JSX examples ready to adapt.

### Q: How do I handle the SearchBar?

**A:** See COMPONENT-GUIDE.md section 1, and MOCK-DATA-REFERENCE.md "Search Bar Setup".

### Q: What about the brands/countries data?

**A:** Auto-populated from `listPublicAuctions()`. See "Data Derivation Examples" in MOCK-DATA-REFERENCE.md.

### Q: Can I change the testimonials?

**A:** Yes, they're hardcoded in MOCK-DATA-REFERENCE.md. Update as needed (author, company, quote).

### Q: Do I need to update the database schema?

**A:** No. All data comes from existing tables (vehicles, auctions).

### Q: What about SEO/og:meta tags?

**A:** Update in Landing component's `head()` function if needed. See UX-REDESIGN-HOME.md section 10.

---

## DOCUMENT STATISTICS

| Doc               | File                              | Size        | Lines     | Read Time      |
| ----------------- | --------------------------------- | ----------- | --------- | -------------- |
| Quick Start       | REDESIGN-QUICK-START.md           | 9.2 KB      | 350       | 5 min          |
| UX Spec           | UX-REDESIGN-HOME.md               | 27 KB       | 800+      | 30 min         |
| Component Guide   | COMPONENT-IMPLEMENTATION-GUIDE.md | 18 KB       | 600       | 20 min         |
| Copy & Assets     | REDESIGN-ASSETS.md                | 28 KB       | 1000+     | 25 min         |
| Executive Summary | REDESIGN-EXECUTIVE-SUMMARY.md     | 12 KB       | 400       | 10 min         |
| Mock Data         | MOCK-DATA-REFERENCE.md            | 17 KB       | 700       | 15 min         |
| Implementation    | IMPLEMENTATION-CHECKLIST.md       | 15 KB       | 500       | phase-by-phase |
| **Total**         | **7 documents**                   | **~126 KB** | **~4350** | **~110 min**   |

---

## NEXT STEPS

1. **Everyone:** Read REDESIGN-QUICK-START.md (5 min)
2. **@architect:** Review UX-REDESIGN-HOME.md + COMPONENT-GUIDE.md, validate approach
3. **@dev:** Start IMPLEMENTATION-CHECKLIST.md Phase 1 (create components)
4. **@qa:** Prepare test plan from IMPLEMENTATION-CHECKLIST.md Phase 6
5. **@devops:** Stand by for PR merge + deployment (Phase 8-9)

---

## DOCUMENT CHECKLIST

- [x] UX-REDESIGN-HOME.md (complete spec)
- [x] COMPONENT-IMPLEMENTATION-GUIDE.md (code details)
- [x] REDESIGN-ASSETS.md (copy + wireframes)
- [x] REDESIGN-EXECUTIVE-SUMMARY.md (stakeholders)
- [x] MOCK-DATA-REFERENCE.md (examples)
- [x] IMPLEMENTATION-CHECKLIST.md (daily guide)
- [x] REDESIGN-QUICK-START.md (TL;DR)
- [x] REDESIGN-INDEX.md (this document)

**All documents ready for distribution.**

---

## APPROVAL SIGN-OFF

**Design Specification:** ✅ Complete
**Status:** Ready for @architect review → @dev implementation

**Questions?** See the relevant document above or contact Uma (@ux-design-expert)

---

**Prepared by:** Uma (@ux-design-expert)
**Date:** 2026-06-04
**Version:** 1.0
**License:** Internal use only (ReDrive project)
