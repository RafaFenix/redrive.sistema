# ReDrive Home Redesign — Copy Assets & Visual Reference

**Designer:** Uma (@ux-design-expert)
**Date:** 2026-06-04

---

## COMPLETE COPY DOCUMENT

### 1. HERO SECTION

**Tagline (above headline):**

```
PLATAFORMA B2B · APENAS EMPRESAS APROVADAS
```

**Main Headline:**

```
Leilão de automóveis importados.
Em tempo real. Sem intermediários.
```

**Subheading:**

```
A ReDrive é o pregão digital onde concessionárias, retalhistas e importadores
acedem mensalmente a centenas de viaturas vindas do estrangeiro.
Licite, compre já ou negoceie.
```

**CTA Buttons:**

- Primary: `VER LEILÕES ATIVOS` (with arrow icon →)
- Secondary: `REGISTAR A MINHA EMPRESA`

**Stats Grid (2x2):**

```
┌─────────────────┬──────────────────┐
│ Lotes / mês     │ Compradores      │
│ ~60             │ 240+             │
├─────────────────┼──────────────────┤
│ Países de origem│ Taxa de adjudicação│
│ DE · FR · IT    │ 92%              │
└─────────────────┴──────────────────┘
```

---

### 2. BENEFITS SECTION

**Section tagline:**

```
POR QUE REDRIVE
```

**Section title:**

```
Confiança, Transparência e Eficiência
```

**Benefit 1: Suporte 24/7**

```
Icon: Globe

Title: Suporte multilíngue 24/7
Description: Equipa pronta para ajudar em português, inglês e alemão.
Dúvidas? Respondemos em minutos.
```

**Benefit 2: Taxas transparentes**

```
Icon: DollarSign

Title: Taxas transparentes e baixas
Description: Comissões justas, sem custos ocultos. Saiba exatamente
quanto vai pagar antes de licitar.
```

**Benefit 3: Entrega à porta**

```
Icon: Truck

Title: Entrega e legalização inclusos
Description: Transporte, documentação, COC — tudo tratado.
A viatura chega pronta para circular.
```

**Benefit 4: Preços inteligentes**

```
Icon: TrendingUp

Title: Preços justos, sem intermediários
Description: Algoritmo de pricing que reflete custos reais.
Nem sobrecarga, nem risco para o comprador.
```

**Benefit 5: Qualidade garantida**

```
Icon: Award

Title: Qualidade verificada e documentada
Description: Todas as viaturas passam por inspeção rigorosa.
Damage report, service history e COC disponíveis.
```

---

### 3. RECENTLY ADDED SECTION

**Section tagline:**

```
NOVIDADES
```

**Section title:**

```
Carros adicionados recentemente ao nosso stock
```

**Section subtitle:**

```
Novos lotes cada semana de Alemanha, França e Itália
```

**Empty state (if no auctions):**

```
Ainda não há leilões ativos. Volte em breve.
```

**View all CTA:**

```
Ver todos os leilões →
```

(Links to `/auctions`)

---

### 4. WHY CHOOSE REDRIVE SECTION

**Section tagline:**

```
VANTAGENS COMPETITIVAS
```

**Section title:**

```
Por que somos diferentes
```

**Card 1: Preço Competitivo**

```
Icon: TrendingUp (or custom)
Title: Preço competitivo
Description: Custos logísticos distribuídos entre vários compradores.
Mais quantidade = melhor preço.
```

**Card 2: COC Garantido**

```
Icon: ShieldCheck
Title: COC garantido em todas as viaturas
Description: Importação simplificada. Documentação 100% legal,
pronta para matriculação em Portugal.
```

**Card 3: Importação Simplificada**

```
Icon: Truck (or custom border)
Title: Importação e legalização por conta da ReDrive
Description: Documentação aduaneira, testes técnicos, seguros —
tudo gerido pela nossa equipa.
```

**Card 4: Tempo Real**

```
Icon: Zap (or Clock)
Title: Lances em tempo real, contadores ao segundo
Description: Leil˜ões com Realtime WebSocket. Anti-sniping automático
nos últimos 2 minutos. Transparência total.
```

**Card 5: Segurança RLS**

```
Icon: Lock (or ShieldCheck)
Title: Segurança com Row Level Security
Description: RLS automático no Supabase. Nenhuma mistura de dados.
Cada empresa só vê seus dados e leilões públicos.
```

**Card 6: Negocie depois**

```
Icon: MessageCircle (or Gavel)
Title: Não ganhou? Negocie com a ReDrive
Description: Se o leilão fecha sem vitória, abrimos negociação
direta com o vendedor.
```

---

### 5. BEST CARS BY BRAND SECTION

**Section tagline:**

```
COMPRA POR MARCA
```

**Section title:**

```
Comprar os melhores carros por marca
```

**Section subtitle:**

```
Selecione uma marca para ver todos os leilões disponíveis
```

**Brand card example:**

```
┌───────────────┐
│   BMW         │
│  12 leilões   │
└───────────────┘
```

**Click action:** Navigate to `/auctions?make=BMW`

**Empty state:**

```
Nenhuma marca disponível neste momento. Volte em breve.
```

**Example brands (if data-driven, these are auto-populated):**

- BMW (12 leilões)
- Audi (8 leilões)
- Mercedes-Benz (6 leilões)
- Volkswagen (10 leilões)
- Renault (5 leilões)
- Ford (4 leilões)
- Fiat (3 leilões)
- Peugeot (5 leilões)
- Opel (3 leilões)
- Citroën (4 leilões)

---

### 6. BEST AUCTIONS BY COUNTRY SECTION

**Section tagline:**

```
LEILÕES POR PAÍS
```

**Section title:**

```
Melhores leilões de carros por país
```

**Section subtitle:**

```
Escolha o país de origem para filtrar leilões
```

**Country card example:**

```
┌──────────────────┐
│   🇩🇪             │
│  Alemanha        │
│  15 leilões      │
└──────────────────┘
```

**Click action:** Navigate to `/auctions?originCountry=DE`

**Country list (Portuguese names):**

- 🇩🇪 Alemanha (15 leilões)
- 🇫🇷 França (10 leilões)
- 🇮🇹 Itália (8 leilões)
- 🇧🇪 Bélgica (5 leilões)
- 🇳🇱 Países Baixos (4 leilões)
- 🇪🇸 Espanha (6 leilões)
- 🇦🇹 Áustria (3 leilões)
- 🇨🇭 Suíça (2 leilões)

---

### 7. TESTIMONIALS SECTION

**Section tagline:**

```
DEPOIMENTOS
```

**Section title:**

```
O que os nossos clientes dizem sobre nós
```

**Section subtitle:**

```
Histórias reais de empresas que já usam a ReDrive
```

---

#### **Testimonial 1**

**Rating:** ⭐⭐⭐⭐⭐

**Quote:**

```
"ReDrive simplificou todo o processo. Antes esperávamos semanas
por uma boa oportunidade. Agora compramos 5 viaturas em 2 semanas
e dormimos tranquilos com a qualidade."
```

**Author:** João Silva

**Company:** Auto Peças Lisboa

---

#### **Testimonial 2**

**Rating:** ⭐⭐⭐⭐⭐

**Quote:**

```
"Leilões em tempo real, documentação perfeita, suporte atento
em português. Recomendo 100% para quem quer comprar viaturas
de qualidade sem surpresas."
```

**Author:** Maria Costa

**Company:** Concessionária Oporto

---

#### **Testimonial 3**

**Rating:** ⭐⭐⭐⭐⭐

**Quote:**

```
"Plataforma intuitiva, interface limpa, sem surpresas nas taxas.
Suporte multilíngue foi crucial para negociar com confiança
com vendedores europeus."
```

**Author:** Marco Rossi

**Company:** Importador (Itália)

---

#### **Testimonial 4 (Optional)**

**Rating:** ⭐⭐⭐⭐⭐

**Quote:**

```
"Transparência total, processo claro do início ao fim.
Nenhuma taxa oculta, nenhuma complicação. Voltaremos com certeza
para compras futuras."
```

**Author:** [Anonymous]

**Company:** Concessionária

---

### 8. FINAL CTA SECTION

**Headline:**

```
Pronto para comprar viaturas importadas sem intermediários?
```

**Subtext:**

```
Registe a sua empresa e aceda a centenas de leilões mensais.
Aprovação em 48 horas.
```

**Primary CTA:** `REGISTAR AGORA` → `/register`

**Secondary CTA:** `VER CATÁLOGO` → `/auctions`

---

### 9. FOOTER

**Copyright:**

```
© 2026 ReDrive — Todos os direitos reservados.
```

**Branding:**

```
B2B · Portugal
```

---

## WIREFRAME ASCII (Detailed)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ HEADER                                                     ┃
┃ Logo                                     [Sign In] [Register]
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 1. HERO                                                    ┃
┃                                                            ┃
┃ PLATAFORMA B2B · APENAS EMPRESAS APROVADAS               ┃
┃                                                            ┃
┃ Leilão de automóveis importados.                          ┃
┃ Em tempo real. Sem intermediários.                        ┃
┃                                                            ┃
┃ A ReDrive é o pregão digital onde...                     ┃
┃                                                            ┃
┃ [VER LEILÕES →] [REGISTAR EMPRESA]                       ┃
┃                                                            ┃
┃                    │ Lotes/mês │ Compradores  │           ┃
┃                    │    ~60    │    240+      │           ┃
┃                    ├───────────┼──────────────┤           ┃
┃                    │  Países   │ Taxa Adjud.  │           ┃
┃                    │ DE·FR·IT  │     92%      │           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 2. BENEFITS                                                ┃
┃                                                            ┃
┃ POR QUE REDRIVE                                           ┃
┃ Confiança, Transparência e Eficiência                    ┃
┃                                                            ┃
┃ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──┐
┃ │ 🌍       │ │ 💵       │ │ 🚚       │ │ 📈       │ │✓│
┃ │ Suporte  │ │ Taxas    │ │ Entrega  │ │ Preços   │ │ │
┃ │ 24/7     │ │Trans.    │ │ Juridica │ │ Intelig. │ │Q│
┃ │          │ │          │ │          │ │          │ │u│
┃ │ Descrição│ │Descrição │ │Descrição │ │Descrição │ │a│
┃ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │l│
┃                                                       │ │
┃                                                       │ │
┃                                                       │ │
┃                                                       │ │
┃                                                       │ │
┃                                                       └──┘
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 3. RECENTLY ADDED                                          ┃
┃                                                            ┃
┃ NOVIDADES                                                  ┃
┃ Carros adicionados recentemente ao nosso stock            ┃
┃                                                            ┃
┃ Novos lotes cada semana de Alemanha, França e Itália     ┃
┃                                                            ┃
┃ ┌──────────┐ ┌──────────┐ ┌──────────┐                   ┃
┃ │ [Photo]  │ │ [Photo]  │ │ [Photo]  │                   ┃
┃ │ BMW 3    │ │ Audi A4  │ │ Mercedes │                   ┃
┃ │ €15.200  │ │ €12.900  │ │ €18.500  │                   ┃
┃ │ 2d 3h    │ │ 1d 5h    │ │ 5d 2h    │                   ┃
┃ └──────────┘ └──────────┘ └──────────┘                   ┃
┃                                                            ┃
┃ ┌──────────┐ ┌──────────┐ ┌──────────┐                   ┃
┃ │ [Photo]  │ │ [Photo]  │ │ [Photo]  │                   ┃
┃ │ VW Golf  │ │ Renault  │ │ Ford     │                   ┃
┃ │ €10.500  │ │ €8.900   │ │ €11.200  │                   ┃
┃ │ 4d 1h    │ │ 2d 7h    │ │ 3d 4h    │                   ┃
┃ └──────────┘ └──────────┘ └──────────┘                   ┃
┃                                                            ┃
┃                        Ver todos os leilões →             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 4. WHY CHOOSE REDRIVE                                      ┃
┃                                                            ┃
┃ VANTAGENS COMPETITIVAS                                   ┃
┃ Por que somos diferentes                                  ┃
┃                                                            ┃
┃ ┌──────────┐ ┌──────────┐ ┌──────────┐                   ┃
┃ │ Preço    │ │ COC      │ │ Importação│                  ┃
┃ │ Compet.  │ │ Garantido│ │ Simplif. │                  ┃
┃ │ Custos   │ │ Importação│ │ Documentação│               ┃
┃ │ distrib. │ │ simplificada│ │ aduaneira │               ┃
┃ └──────────┘ └──────────┘ └──────────┘                   ┃
┃                                                            ┃
┃ ┌──────────┐ ┌──────────┐ ┌──────────┐                   ┃
┃ │ Tempo    │ │ Segurança│ │ Negocie  │                   ┃
┃ │ Real     │ │ RLS      │ │ Depois   │                   ┃
┃ │ Lances   │ │ Automático│ │ Se não ganhar│              ┃
┃ │ ao segundo│ │ Sem mistura│ │ negocie...│               ┃
┃ └──────────┘ └──────────┘ └──────────┘                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 5. BRAND CAROUSEL                                          ┃
┃                                                            ┃
┃ COMPRA POR MARCA                                          ┃
┃ Comprar os melhores carros por marca                     ┃
┃                                                            ┃
┃ ←  [BMW 12] [Audi 8] [Mercedes 6] [VW 10] [Renault 5] → ┃
┃    [Ford 4]  [Fiat 3] [Peugeot 5] [Opel 3] [Citroën 4]  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 6. COUNTRY CAROUSEL                                        ┃
┃                                                            ┃
┃ LEILÕES POR PAÍS                                          ┃
┃ Melhores leilões de carros por país                      ┃
┃                                                            ┃
┃ ← [🇩🇪 Alemanha 15] [🇫🇷 França 10] [🇮🇹 Itália 8] → ┃
┃   [🇧🇪 Bélgica 5]  [🇳🇱 Países Baixos 4]                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 7. TESTIMONIALS                                            ┃
┃                                                            ┃
┃ DEPOIMENTOS                                               ┃
┃ O que os nossos clientes dizem sobre nós                 ┃
┃                                                            ┃
┃ ┌────────────────────┐ ┌────────────────────┐            ┃
┃ │ ⭐⭐⭐⭐⭐       │ │ ⭐⭐⭐⭐⭐       │            ┃
┃ │                    │ │                    │            ┃
┃ │ "ReDrive           │ │ "Leilões em tempo  │            ┃
┃ │  simplificou..."   │ │  real, documentação│            ┃
┃ │                    │ │  perfeita..."      │            ┃
┃ │ João Silva         │ │ Maria Costa        │            ┃
┃ │ Auto Peças Lisboa  │ │ Concessionária     │            ┃
┃ └────────────────────┘ │ Oporto             │            ┃
┃                        └────────────────────┘            ┃
┃                                                            ┃
┃ ┌────────────────────┐                                    ┃
┃ │ ⭐⭐⭐⭐⭐       │                                    ┃
┃ │                    │                                    ┃
┃ │ "Plataforma        │                                    ┃
┃ │  intuitiva, suporte│                                    ┃
┃ │  multilíngue..."   │                                    ┃
┃ │                    │                                    ┃
┃ │ Marco Rossi        │                                    ┃
┃ │ Importador (Itália)│                                    ┃
┃ └────────────────────┘                                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 8. FINAL CTA                                               ┃
┃                                                            ┃
┃    Pronto para comprar viaturas importadas sem            ┃
┃                   intermediários?                          ┃
┃                                                            ┃
┃    Registe a sua empresa e aceda a centenas de           ┃
┃          leilões mensais. Aprovação em 48 horas.         ┃
┃                                                            ┃
┃            [REGISTAR AGORA]  [VER CATÁLOGO]              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ FOOTER                                                     ┃
┃ © 2026 ReDrive — Todos os direitos reservados.           ┃
┃                                          B2B · Portugal    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## MOBILE WIREFRAME (Sample - Hero + Benefits)

```
┌─────────────────────────────────┐
│ HEADER (Sticky)                 │
│ Logo          [Menu]            │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 1. HERO                         │
│                                 │
│ PLATAFORMA B2B                  │
│                                 │
│ Leilão de automóveis            │
│ importados. Em tempo            │
│ real. Sem intermediários.       │
│                                 │
│ A ReDrive é o pregão            │
│ digital onde...                 │
│                                 │
│ [VER LEILÕES →]                 │
│                                 │
│ [REGISTAR EMPRESA]              │
│                                 │
│ ┌──────────────────────┐        │
│ │ Lotes/mês    ~60     │        │
│ ├──────────────────────┤        │
│ │ Compradores  240+    │        │
│ ├──────────────────────┤        │
│ │ Países       DE·FR·IT│        │
│ ├──────────────────────┤        │
│ │ Taxa Adjud.  92%     │        │
│ └──────────────────────┘        │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 2. BENEFITS                     │
│                                 │
│ POR QUE REDRIVE                 │
│ Confiança, Transparência        │
│                                 │
│ ┌─────────────────────┐         │
│ │ 🌍                  │         │
│ │ Suporte 24/7        │         │
│ │ Equipa pronta para  │         │
│ │ ajudar em 24 horas  │         │
│ └─────────────────────┘         │
│                                 │
│ ┌─────────────────────┐         │
│ │ 💵                  │         │
│ │ Taxas transparentes │         │
│ │ Comissões justas,   │         │
│ │ sem custos ocultos  │         │
│ └─────────────────────┘         │
│                                 │
│ ┌─────────────────────┐         │
│ │ 🚚                  │         │
│ │ Entrega à porta     │         │
│ │ Transporte e        │         │
│ │ legalização inclusos│         │
│ └─────────────────────┘         │
│                                 │
│ ┌─────────────────────┐         │
│ │ 📈                  │         │
│ │ Preços inteligentes │         │
│ │ Algoritmo justo,    │         │
│ │ sem intermediários  │         │
│ └─────────────────────┘         │
│                                 │
│ ┌─────────────────────┐         │
│ │ ✓                   │         │
│ │ Qualidade garantida │         │
│ │ Viaturas verificadas│         │
│ │ e documentadas      │         │
│ └─────────────────────┘         │
└─────────────────────────────────┘

[... more sections scroll down ...]
```

---

## COLOR PALETTE & ICONS

### Primary Colors (Already in ReDrive)

- **Primary Red:** Used in CTAs, highlights (e.g., "VER LEILÕES")
- **Foreground:** Dark/black
- **Background:** Light/white
- **Card:** Light gray
- **Border:** Subtle gray
- **Muted foreground:** Light gray text

### Icon Set (Lucide React)

| Icon                   | Usage               |
| ---------------------- | ------------------- |
| Globe                  | Suporte 24/7        |
| DollarSign             | Taxas transparentes |
| Truck                  | Entrega             |
| TrendingUp             | Preços inteligentes |
| Award                  | Qualidade garantida |
| ShieldCheck            | Segurança, COC      |
| Zap                    | Tempo real          |
| MessageCircle          | Negociação          |
| ArrowRight             | CTAs (links)        |
| ArrowLeft / ArrowRight | Carousel nav        |

---

## TYPOGRAPHY

### Font Stack (Assuming Tailwind default or custom)

- **Headings:** font-extrabold, tracking-tight, text-3xl/4xl/5xl/6xl
- **Subheadings:** font-semibold, text-xl/lg
- **Body:** text-base, text-muted-foreground
- **Taglines:** font-mono, text-[10px], uppercase, tracking-widest, text-primary

---

## SPACING SCALE

| Use                  | Value                                          |
| -------------------- | ---------------------------------------------- |
| Section padding      | py-16 (desktop), py-12 (tablet), py-8 (mobile) |
| Container margin     | mx-auto, max-w-7xl                             |
| Container padding    | px-6                                           |
| Card gap             | gap-5 or gap-6                                 |
| Carousel gap         | gap-4                                          |
| Vertical section gap | mt-8 or mt-10                                  |

---

## HOVER STATES

- **Buttons:** `hover:bg-primary/90`
- **Links:** `hover:underline-offset-4 hover:underline`
- **Cards:** `hover:border-primary` (subtle) or `hover:shadow-lg`
- **Carousel cards:** `hover:border-primary transition`

---

## BREAKPOINTS (Tailwind)

| Class | Width  |
| ----- | ------ |
| `sm`  | 640px  |
| `md`  | 768px  |
| `lg`  | 1024px |
| `xl`  | 1280px |
| `2xl` | 1536px |

**Design breakpoints:**

- Mobile: < 768px (1-col everything)
- Tablet: 768px - 1023px (2-col grid, carousel 2-3 visible)
- Desktop: ≥ 1024px (3-col grid, carousel 5+ visible)

---

## ACCESSIBILITY NOTES

### Color contrast

- Primary text on white: 4.5:1 or higher (WCAG AA)
- Muted text: sufficient contrast (min 3:1)

### Touch targets

- Minimum 44px × 44px for buttons/links

### Semantic HTML

```html
<section>
  <h2>Section Title</h2>
  <article>Card content</article>
</section>
```

### Carousel accessibility

- Arrow keys to navigate
- Keyboard focusable (Tab)
- Screen reader announcements (ARIA)

---

## PERFORMANCE TARGETS

| Metric                         | Target  |
| ------------------------------ | ------- |
| LCP (Largest Contentful Paint) | < 2.5s  |
| FID (First Input Delay)        | < 100ms |
| CLS (Cumulative Layout Shift)  | < 0.1   |
| Page load (total)              | < 3s    |

---

## COPY TONE CHECKLIST

- [ ] Professional, B2B language
- [ ] Portuguese (Portugal spelling: "comissões", not "comisiones")
- [ ] No competitor names
- [ ] No generic superlatives
- [ ] Action-oriented verbs
- [ ] Transparent messaging
- [ ] No emojis except country flags
- [ ] Authentic testimonials (not generic)

---

**Document prepared by:** Uma (@ux-design-expert)
**Date:** 2026-06-04
**Status:** Ready for @dev reference
