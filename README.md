# ReDrive — Plataforma de Leilão Automóvel B2B

> Pregão digital para concessionárias, retalhistas e importadores acederem a viaturas importadas (Alemanha, França, Itália) em tempo real. Licite, compre já ou negoceie.

---

## 🖥️ Stack Tecnológica

| Camada | Tecnologia | Notas |
|--------|-----------|-------|
| **Framework** | [TanStack Start](https://tanstack.com/start) v1 | Full-stack React 19 com SSR/SSG e `createServerFn` |
| **Build** | Vite 7 | Via `@lovable.dev/vite-tanstack-config` |
| **Runtime** | Cloudflare Workers (edge) | Serverless — sem Node.js nativo |
| **Estilos** | Tailwind CSS v4 + OKLCH | Design system "Terminal precision" |
| **UI** | shadcn/ui + Radix UI | 40+ componentes primitivos |
| **Estado** | TanStack Query v5 | Data fetching, caching, SSR hydration |
| **Router** | TanStack Router v1 | File-based routing, type-safe |
| **Backend** | Supabase (via Lovable Cloud) | PostgreSQL + Auth + Realtime + Storage |
| **Forms** | React Hook Form + Zod | Validação tipada |
| **Gráficos** | Recharts | Analytics e dashboards |
| **Carrossel** | Embla Carousel | Galeria de viaturas |
| **Data** | date-fns | Manipulação de datas |
| **Ícones** | Lucide React | Ícones consistentes |
| **Toast** | Sonner | Notificações in-app |

---

## ⚠️ Estado Atual do Projeto

> **Fase: Frontend Visual Completo (Mock Data)**
>
> O frontend está 100% funcional visualmente, mas opera com dados mock (`src/lib/mock-data.ts`).
> O backend (Supabase/Lovable Cloud) **está configurado mas não ativo** — a base de dados, auth, realtime, storage e server functions ainda não foram ligados.
>
> Ver secção [Checklist do MVP](#-checklist-do-mvp) abaixo para o estado detalhado de cada funcionalidade.

---

## 📋 Requisitos

### Sistema

- **Node.js** ≥ 20 (recomendado 20.x LTS ou 22.x LTS)
- **Bun** ≥ 1.2 (gerenciador de pacotes e runtime — o projeto usa `bunfig.toml`)
- **Git**
- **Navegador moderno** com suporte a ES2022+

### Opcional (para desenvolvimento full-stack)

- **Supabase CLI** ≥ 2.0 (para migrações locais e `pg_cron`)
- **Docker** (se quiser rodar Supabase localmente via CLI)

---

## 🚀 Executar em Localhost

### 1. Clonar o repositório

```bash
git clone <url-do-repositório>
cd redrive
```

### 2. Instalar dependências

```bash
bun install
```

> O projeto usa `bun` como runtime e package manager. Não use `npm` ou `yarn` — o `bunfig.toml` configura o registry e comportamentos específicos do Bun.

### 3. Configurar variáveis de ambiente

Copie o modelo e preencha:

```bash
cp .env.example .env.local
```

Edite `.env.local` com os valores da sua instância Supabase/Lovable Cloud (quando ativado):

```env
# Supabase (cliente browser — público, seguro em bundle)
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbG...

# Supabase (servidor — NUNCA exponha no cliente)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...       # ⚠️ Apenas server-side

# Segredos da app
APP_SECRET=changeme-min-32-chars-long   # Para cookies/sessão
CRON_SECRET=changeme-cron-32-chars      # Para endpoints /api/public/*

# Opcional (Fase B)
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# RESEND_API_KEY=re_...
```

> **⚠️ CRÍTICO:** `SUPABASE_SERVICE_ROLE_KEY` e `STRIPE_SECRET_KEY` são **apenas server-side**. O Vite nunca as inclui no bundle do cliente porque são lidas via `process.env` dentro de `createServerFn` handlers, não em `import.meta.env`.

### 4. Iniciar o servidor de desenvolvimento

```bash
bun dev
```

A aplicação estará disponível em **http://localhost:3000** (ou a porta que o Vite indicar).

### Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `bun dev` | Servidor de desenvolvimento com HMR |
| `bun run build` | Build de produção (SSR + cliente) |
| `bun run build:dev` | Build em modo development |
| `bun run preview` | Preview do build de produção localmente |
| `bun run lint` | ESLint em todo o projeto |
| `bun run format` | Prettier — formatação automática |

### 5. (Opcional) Supabase local

Se quiser testar o backend localmente antes de ativar Lovable Cloud:

```bash
# Iniciar stack local (requer Docker)
supabase start

# Aplicar migrações
supabase migration up

# Popular com dados de seed
supabase db reset
```

Acesse o Studio local em http://localhost:55323.

---

## 🗂️ Estrutura do Projeto

```
redrive/
├── .lovable/
│   └── plan.md                    # Plano técnico detalhado (Fases A, B, C)
│
├── src/
│   ├── components/
│   │   ├── auction/               # AuctionTimer, BidPanel, BidHistory, ReserveIndicator
│   │   ├── layout/                # PublicHeader, BuyerSidebar, AdminSidebar
│   │   ├── ui/                    # shadcn/ui (40+ componentes)
│   │   └── vehicle/               # VehicleCard, VehicleGallery
│   │
│   ├── lib/
│   │   ├── market-data.ts         # Queries/RPCs Supabase para leilões, lances e negociações
│   │   ├── auth-client.ts         # Sessão, profile/status e roles
│   │   ├── supabase/client.ts     # Cliente browser Supabase
│   │   ├── utils.ts               # cn() e helpers
│   │   ├── error-capture.ts       # Captura de erros SSR
│   │   ├── error-page.ts          # Página de erro genérica
│   │   ├── api/
│   │   │   └── example.functions.ts # Exemplo de createServerFn
│   │   └── config.server.ts      # Configuração server-only
│   │
│   ├── routes/                    # File-based routing (TanStack Router)
│   │   ├── __root.tsx             # Root layout (HTML shell)
│   │   ├── index.tsx              # Landing page
│   │   ├── login.tsx              # Login
│   │   ├── register.tsx           # Registo de empresa
│   │   ├── pending-approval.tsx   # Ecrã pós-registo
│   │   ├── how-it-works.tsx       # Como funciona
│   │   ├── auctions.index.tsx     # Catálogo de leilões
│   │   ├── auctions.$id.tsx       # Detalhe do leilão
│   │   ├── buyer.tsx              # Layout buyer (com sidebar)
│   │   ├── buyer.dashboard.tsx    # Dashboard do comprador
│   │   ├── buyer.bids.tsx         # Meus lances
│   │   ├── buyer.won.tsx          # Leilões ganhos
│   │   ├── buyer.negotiations.tsx # Negociações
│   │   ├── admin.tsx              # Layout admin (com sidebar)
│   │   ├── admin.dashboard.tsx    # Dashboard admin
│   │   ├── admin.vehicles.index.tsx  # Lista de viaturas
│   │   ├── admin.vehicles.new.tsx    # Nova viatura
│   │   ├── admin.auctions.index.tsx  # Lista de leilões
│   │   ├── admin.auctions.new.tsx    # Novo leilão
│   │   ├── admin.auctions.$id.tsx    # Detalhe/editar leilão
│   │   ├── admin.users.tsx        # Gestão de utilizadores
│   │   └── admin.negotiations.tsx   # Gestão de negociações
│   │
│   ├── router.tsx                 # Configuração do TanStack Router
│   ├── server.ts                  # Entry point SSR (Cloudflare Worker)
│   └── start.ts                   # Configuração do TanStack Start
│
├── supabase/
│   ├── config.toml                # Configuração local do Supabase
│   └── seed.sql                   # Dados iniciais (não usado ainda)
│
├── .env.example                   # Template de variáveis de ambiente
├── .env.local                     # Variáveis locais (não commitar!)
├── .prettierrc                    # Configuração do Prettier
├── bunfig.toml                    # Configuração do Bun
├── components.json                # Configuração do shadcn/ui
├── eslint.config.js               # ESLint flat config
├── package.json                   # Dependências e scripts
├── tsconfig.json                  # TypeScript strict
├── vite.config.ts                 # Configuração do Vite + TanStack Start
└── README.md                      # Este ficheiro
```

---

## 🎨 Design System

**Direção visual:** *Terminal precision* — inspirado em terminais de leilão físicos, com precisão tipográfica e densidade controlada.

- **Tipografia:** Inter (sans-serif, body), JetBrains Mono (monospace, labels e dados)
- **Paleta:** Base monocromática com acento queimado (terracota/cobre). OKLCH para precisão perceptual.
- **Filosofia:** Zero gradientes, zero sombras difusas, espaçamento em grid de 4px, bordas finas (`1px`), alto contraste.
- **Tokens CSS:** Todos os componentes usam variáveis semânticas (`--background`, `--primary`, `--muted`, etc.) definidas em `src/styles.css`.

---

## 🔐 Variáveis de Ambiente

### Cliente (Browser) — prefixo `VITE_`

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `VITE_SUPABASE_URL` | Sim (Fase A+) | URL do projeto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Sim (Fase A+) | Chave pública anon/role do Supabase |

> Acessíveis via `import.meta.env.VITE_*` em qualquer ficheiro. São injetadas no bundle pelo Vite em build-time.

### Servidor (Server Functions / SSR) — sem prefixo

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `SUPABASE_URL` | Sim (Fase A+) | URL do projeto Supabase |
| `SUPABASE_PUBLISHABLE_KEY` | Sim (Fase A+) | Chave pública (para auth middleware) |
| `SUPABASE_SERVICE_ROLE_KEY` | Sim (Fase A+) | Chave de serviço — **bypass RLS**, apenas operações trusted |
| `APP_SECRET` | Sim (Fase A+) | Segredo para cookies/sessão (min 32 chars) |
| `CRON_SECRET` | Sim (Fase A+) | Header secret para endpoints `/api/public/*` chamados por `pg_cron` |
| `STRIPE_SECRET_KEY` | Fase B | Chave secreta Stripe |
| `STRIPE_WEBHOOK_SECRET` | Fase B | Secret para verificar webhooks Stripe |
| `RESEND_API_KEY` | Fase B | API key Resend para emails transacionais |

> Acessíveis apenas dentro de `createServerFn` handlers e server routes via `process.env.*`. Nunca são expostas ao cliente.

---

## 📊 Checklist do MVP

### ✅ Feito — UI e Fluxos Principais

- [x] Landing page com hero, estatísticas, leilões em destaque
- [x] Catálogo de leilões (`/auctions`) com cards de viaturas
- [x] Página de detalhe do leilão (`/auctions/$id`) com:
  - [x] Galeria de fotos (Embla Carousel)
  - [x] Timer de contagem decrescente
  - [x] Painel de lances (BidPanel) com incrementos configuráveis
  - [x] Histórico de lances (BidHistory) com anonymização
  - [x] Indicador de reserva atingida (ReserveIndicator)
  - [x] Preço atual, lance mínimo, "Comprar Já"
- [x] Ecrã "Como funciona" (`/how-it-works`)
- [x] Login (`/login`)
- [x] Registo de empresa (`/register`)
- [x] Ecrã pós-registo à espera de aprovação (`/pending-approval`)
- [x] Layout Buyer com sidebar (`/buyer/*`):
  - [x] Dashboard do comprador
  - [x] Meus lances
  - [x] Leilões ganhos
  - [x] Negociações
- [x] Layout Admin com sidebar (`/admin/*`):
  - [x] Dashboard administrativo
  - [x] Gestão de viaturas (listar, criar)
  - [x] Gestão de leilões (listar, criar, detalhe)
  - [x] Gestão de utilizadores
  - [x] Gestão de negociações
- [x] Design system "Terminal precision" completo
- [x] 40+ componentes shadcn/ui configurados
- [x] Rotas com meta tags (SEO) e type-safe routing
- [x] Totalmente responsivo (mobile → desktop)

---

### ✅ Fase A — Backend funcional ligado

- [x] **A.1 — Schema + RLS**
  - [x] Migration SQL com tabelas: `profiles`, `user_roles`, `vehicles`, `auctions`, `bids`, `orders`, `negotiations`, `negotiation_rounds`, `notifications`, `watchlist`
  - [x] Enums de roles, estados, leilões, lances, negociações, entregas e notificações
  - [x] Row Level Security (RLS), GRANTs e funções privadas de role/status
  - [x] Views públicas: `public_vehicles`, `public_auctions` sem campos sensíveis
  - [x] Trigger para criar `profile` + role buyer no signup

- [x] **A.2 — Auth**
  - [x] Signup/login/reset password com Supabase Auth
  - [x] Verificação de role/status nos layouts buyer/admin
  - [x] Redirecionamento para `/pending-approval`
  - [x] Bootstrap seguro do primeiro admin em `/setup-admin`

- [x] **A.3 — Ações transacionais**
  - [x] `place_bid` com validação de comprador aprovado, leilão ativo, buy now e outbid
  - [x] `approve_user` / `reject_user` / `suspend_user`
  - [x] Criação de viaturas e leilões pelo admin
  - [x] Cancelamento de leilão pelo admin
  - [x] `open_negotiation`, `submit_negotiation_round`, `accept_negotiation_offer`
  - [x] Aceitação de negociação cria `order`

- [x] **A.7 — Ligar Frontend ao Backend**
  - [x] Substituir `mock-data.ts` por queries reais nas rotas funcionais
  - [x] `BidPanel` chama `place_bid` real
  - [x] Listagem com filtros funcionais no catálogo
  - [x] Admin forms inserem na DB
  - [x] Admin gere utilizadores, viaturas, leilões e negociações
  - [x] Buyer vê dashboard, lances, ganhos e negociações reais

### 🔲 Ainda por fazer

- [ ] **A.4 — Realtime**
  - [ ] Canal `auction:{id}` — broadcast em cada lance
  - [ ] Canal `user:{id}` — notificações in-app
  - [ ] Hook `useAuctionRealtime()`
  - [ ] Hook `useNotifications()`

- [ ] **A.5 — Storage**
  - [ ] Upload real para bucket `vehicle-photos`
  - [ ] Signed URLs para `vehicle-documents`
  - [ ] Gestão completa do bucket `trade-registry`

- [ ] **A.6 — Cron**
  - [ ] `close-auctions` / `activate-auctions`
  - [ ] `notify-watchlist-1h`
  - [ ] `expire-negotiations`

- [ ] **A.8 — Melhorias de produto**
  - [ ] `NotificationBell` componente (dropdown de notificações)
  - [ ] `WatchlistButton` (estrela nos cards)
  - [ ] `MarketPriceHint` (comparação com preço de mercado)
  - [ ] `DocumentsList` (relatórios de danos, peritagens)
  - [ ] Página `/buyer/won/$id` com timeline de `delivery_status`
  - [ ] Filtros completos no catálogo: marca, modelo, preço, ano, quilometragem, origem, estado, transmissão, combustível
  - [ ] Timer estende nos últimos 2 min
  - [ ] Cron fecha leilão e cria `order` ou `negotiation`
  - [ ] Notificações aparecem em tempo real

---

### 🔲 Por fazer — Fase B: Pagamentos e Emails

- [ ] Stripe SetupIntent (registo de cartão antes de licitar)
- [ ] Stripe PaymentIntent (depósito de garantia ao vencedor)
- [ ] Webhook Stripe em `/api/public/webhooks/stripe`
- [ ] Emails transacionais via Resend:
  - [ ] `bid_outbid` — foste ultrapassado
  - [ ] `auction_won` — ganhaste o leilão
  - [ ] `account_approved` — conta aprovada
  - [ ] `account_rejected` — conta rejeitada
  - [ ] `auction_ending_1h` — leilão termina em 1h
  - [ ] `negotiation_new_round` — nova contra-proposta
- [ ] Templates React Email

---

### 🔲 Por fazer — Fase C: Polimento e Fase 2

- [ ] SMS via Twilio (opcional)
- [ ] Blind auction (lance único, não vês lances dos outros)
- [ ] Autobid (lance automático até valor máximo)
- [ ] Analytics de preços históricos (gráficos de tendência)
- [ ] Account manager (UI dedicada para gestão de conta)
- [ ] Lotes/bundles (leilão de múltiplas viaturas)
- [ ] Notificações push (Web Push API)
- [ ] Export PDF de relatórios (viatura, peritagem)
- [ ] Multi-idioma (i18n — PT, EN, ES)

---

## 🧪 Testar o Ciclo Crítico (quando Fase A estiver pronta)

1. **Registo:** Novo buyer acede a `/register`, preenche dados da empresa → recebe e-mail de confirmação.
2. **Aprovação:** Admin vai a `/admin/users`, vê o novo registo em "Pendente", clica "Aprovar".
3. **Login:** Buyer faz login → redirecionado para `/buyer/dashboard`.
4. **Licitar:** Buyer entra num leilão ativo, clica no incremento → lance registado, aparece no histórico.
5. **Realtime:** Abre o mesmo leilão noutro browser (incógnito) → vê o lance aparecer em tempo real.
6. **Extensão:** Lance nos últimos 2 minutos → timer estende automaticamente.
7. **Ganhar:** Espera o leilão terminar (ou simula via cron) → buyer vê em `/buyer/won`.
8. **Negociar:** Se reserva não atingida, buyer recebe notificação para negociar em `/buyer/negotiations`.

---

## 🐛 Debugging

### Erros comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `createServerFn is not a function` | Import errado | Usar `@tanstack/react-start`, NÃO `@tanstack/start` |
| `window is not defined` | Client-only em SSR | Mover import para dentro de função client-only ou renomear para `*.client.ts` |
| `Unauthorized` durante build | `requireSupabaseAuth` em loader de rota pública | Mover chamada para componente com `useServerFn` + `useQuery`, ou usar rota `_authenticated/` |
| `process.env.X is undefined` | Leitura fora de handler | Sempre ler `process.env` **dentro** do `.handler()` de `createServerFn` |
| `[unenv] X is not implemented` | Pacote Node-only em server function | Substituir por alternativa edge-compatible |

### Ferramentas de debug

- **Console do browser:** `code--read_console_logs`
- **Network requests:** `code--read_network_requests`
- **Session replay:** `code--read_session_replay` (ver interações exatas do utilizador)
- **Runtime errors:** `code--read_runtime_errors`

---

## 📚 Documentação de Referência

- [TanStack Start](https://tanstack.com/start/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)
- [Lovable Docs](https://docs.lovable.dev)

---

## 🤝 Contribuir

1. Crie uma branch: `git checkout -b feature/nome-da-feature`
2. Commit com mensagens descritivas em português ou inglês
3. Push e abra Pull Request
4. Garanta que `bun run lint` e `bun run build` passam sem erros

---

## 📄 Licença

Proprietário — ReDrive. Todos os direitos reservados.

---

> **Última atualização:** 2026-06-03
> **Versão do frontend:** 1.0 (mock)
> **Plano técnico:** ver `.lovable/plan.md`
