
# ReDrive — Plano para versão funcional (PRD v1.1)

## 1. O que já está feito (visual / mock)

Frontend completo em **TanStack Start** (não Next.js — adaptado) com dados mock:
- Design system "Terminal precision" (`src/styles.css`)
- Componentes: `AuctionTimer`, `BidPanel`, `BidHistory`, `ReserveIndicator`, `VehicleCard`, `VehicleGallery`
- Layouts e navegação: público, buyer, admin
- Rotas públicas: `/`, `/auctions`, `/auctions/$id`, `/how-it-works`, `/login`, `/register`, `/pending-approval`
- Rotas buyer: `dashboard`, `bids`, `won`, `negotiations`
- Rotas admin: `dashboard`, `vehicles`, `auctions`, `users`, `negotiations`
- Mock data com tipos `Auction`, `Vehicle`, `Bid`, `Negotiation`

**Falta visualmente do PRD v1.1:** Watchlist, NotificationBell, MarketPriceHint, DocumentsList, filtros completos no catálogo, timeline de entrega em `/buyer/won/$id`, campos novos no form admin (COC, lead_time, market_price_ref, appraisal, service_history).

## 2. Estratégia: 3 fases

Para ter algo **funcional rapidamente**, divido em fases. A Fase A é o mínimo para testar o ciclo crítico (registo → aprovação → licitar → ganhar). Fases B e C ficam para depois.

---

### Fase A — MVP funcional mínimo (FAZER AGORA)

Objetivo: ciclo completo de leilão funcional em localhost via Lovable Cloud.

**A.1 — Backend base**
- Ativar Lovable Cloud (Supabase gerido)
- Migration com schema PRD v1.1 mas reduzido:
  - `profiles`, `user_roles` (separado, padrão Lovable), `vehicles`, `auctions`, `bids`, `orders`, `negotiations`, `negotiation_rounds`, `notifications`, `watchlist`
  - Enums todos (incluindo `delivery_status`, `notification_type`, `auction_mode`)
  - Colunas Fase 2 já criadas mas inativas: `auctions.mode`, `bids.max_autobid_amount`, `bids.is_autobid`
- RLS em todas as tabelas + GRANTs corretos
- Função `has_role()` security definer
- Views públicas: `public_vehicles`, `public_auctions` (sem `vin`, `origin_plate`, `purchase_price`, `reserve_price`)

**A.2 — Auth**
- Email + password (sem Google nesta fase, simplificar)
- Trigger auto-criar `profile` com `status='pending'` no signup
- Rota `_authenticated/` (integração-managed) + verificação de role/status nos layouts buyer/admin
- Rota `/reset-password`

**A.3 — Server functions críticas (createServerFn)**
- `placeBid` — com toda a lógica do PRD §6.1 (validação, outbid, extensão 2min, criar notification, broadcast)
- `buyNow` — encerra leilão imediato
- `closeAuction` (chamada por cron)
- `approveUser` / `rejectUser` / `suspendUser`
- `createVehicle` / `updateVehicle` (admin)
- `createAuction` / `cancelAuction` (admin)
- `addToWatchlist` / `removeFromWatchlist`
- `markNotificationRead`
- `submitCounterOffer` / `acceptOffer` / `rejectOffer` (negociações, máx 5 rondas)

**A.4 — Realtime**
- Canal `auction:{id}` — broadcast em cada `placeBid`
- Canal `user:{id}` — notificações in-app
- Hooks `useAuctionRealtime()` e `useNotifications()` para subscrever

**A.5 — Storage**
- Bucket `vehicle-photos` (público)
- Bucket `vehicle-documents` (privado, signed URLs para damage/appraisal/service)
- Bucket `trade-registry` (privado, só admin acede)

**A.6 — Cron (pg_cron)**
- `close-auctions` (cada minuto) → chama `/api/public/close-auctions` com secret
- `activate-auctions` (cada minuto) → UPDATE direto SQL
- `notify-watchlist-1h` (cada 5 min) → endpoint público
- `expire-negotiations` (diário) → UPDATE direto SQL
- Rota `src/routes/api/public/close-auctions.ts` com verificação por header secret

**A.7 — Ligar frontend ao backend**
- Substituir `mock-data.ts` por queries reais via TanStack Query + server functions
- `BidPanel` chama `placeBid` real, mostra erros do servidor
- Listagem com filtros funcionais
- Admin forms inserem na DB
- NotificationBell + WatchlistButton + MarketPriceHint + DocumentsList implementados
- Página `/buyer/won/$id` com timeline `delivery_status`

**A.8 — Critérios de aceitação Fase A**
- Admin cria viatura + leilão
- Buyer regista, admin aprova, buyer licita
- Realtime: outro browser vê o lance aparecer
- Timer estende nos últimos 2min
- Cron fecha leilão e cria order ou negotiation
- Notificações aparecem em tempo real

---

### Fase B — Pagamentos e emails (FAZER DEPOIS)

- Stripe SetupIntent (cartão antes de licitar)
- Stripe PaymentIntent (depósito de garantia ao vencedor)
- Webhooks Stripe em `/api/public/webhooks/stripe`
- Emails transacionais via Resend (bid_outbid, auction_won, account_approved, etc.)
- Templates React Email

### Fase C — Polimento e Fase 2 do PRD

- SMS via Twilio (opcional)
- Blind auction (lógica)
- Autobid (lógica)
- Analytics de preços históricos
- Account manager (UI)
- Lotes/bundles

---

## 3. Detalhes técnicos importantes

**Stack adaptada:** PRD diz Next.js + Edge Functions Supabase. Vamos usar **TanStack Start + createServerFn** (já é o template). Toda a lógica de "Edge Function" do PRD vira `createServerFn` com `requireSupabaseAuth`. Apenas o endpoint chamado por `pg_cron` é uma rota pública em `/api/public/*` com verificação de secret.

**Localhost:** Lovable Cloud funciona automaticamente em dev — o preview já é "localhost" para o utilizador. Quando estiver pronto, basta publicar.

**Ordem de execução dentro da Fase A:**
1. Schema + RLS + views
2. Auth + trigger profile
3. CRUD admin (vehicles, auctions) ligado
4. placeBid + realtime
5. Watchlist + notifications + componentes em falta
6. Cron + close-auction
7. Negociações
8. Timeline de entrega

## 4. Decisão necessária

Para começar a Fase A preciso de:
1. **Ativar Lovable Cloud** — vou pedir-te para ativar nas configurações (necessário para qualquer backend).
2. **Confirmar campos do `profiles`** que listo em A.1 (company_name, vat_number, contact_name, contact_phone, address/city/country, delivery_address/city/country, trade_registry URL). Está OK?
3. **Idioma das mensagens de erro do servidor:** português (consistente com UI), certo?

Depois disto, implemento a Fase A inteira. Aviso ao longo do caminho quando algo precisar da tua atenção (ex: aprovar primeiro buyer manualmente para testar).
