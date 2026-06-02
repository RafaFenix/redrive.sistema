
# Plano — ReDrive MVP (Fase visual com dados mock)

Objetivo: ter todas as ecrãs principais navegáveis com dados fictícios, design coeso, pronto para iterar. Sem base de dados, sem auth, sem Stripe, sem realtime — tudo isso entra numa segunda fase quando ativarmos Lovable Cloud.

## Adaptação de stack

| PRD (Next.js)                    | Implementação Lovable                              |
| -------------------------------- | -------------------------------------------------- |
| Next.js App Router + middleware  | TanStack Start (file-based routes em `src/routes`) |
| Supabase Auth Helpers            | Lovable Cloud (Supabase) — fase 2                  |
| Edge Functions (`place-bid`...)  | `createServerFn` em TanStack — fase 2              |
| Tailwind + shadcn/ui             | Mantém-se igual                                    |

Funcionalmente é equivalente; só muda a forma de escrever rotas/server functions.

## Design direction

Para um leilão B2B automóvel quero uma estética próxima de **Copart / BCA / Auto1** mas mais limpa e premium: dark mode com acentos quentes (laranja/âmbar para urgência de leilão), tipografia técnica, muita densidade de informação sem parecer caótica. Vou propor 3 direções visuais via `design--create_directions` antes de construir, para escolheres.

## Páginas a construir (todas com dados mock em `src/lib/mock-data.ts`)

### Públicas
1. `/` — Landing: hero, "leilões a terminar em breve", "destaques", como funciona, CTA registo empresa.
2. `/auctions` — Grelha de leilões ativos com filtros (marca, combustível, ano, km).
3. `/auctions/$id` — Ficha completa: galeria, specs, painel de licitação, timer animado, indicador de reserva, histórico anónimo de lances, relatório de danos, serviços adicionais.
4. `/login` e `/register` — Forms visuais (sem backend).
5. `/pending-approval` — Estado de espera.

### Buyer (sem gate real ainda, navegável diretamente)
6. `/buyer/dashboard` — KPIs (lances ativos, ganhos, em negociação).
7. `/buyer/bids` — Histórico de lances.
8. `/buyer/won` — Leilões ganhos.
9. `/buyer/negotiations` — Lista + detalhe de rondas de contraoferta.

### Admin (sem gate real ainda)
10. `/admin/dashboard` — Contadores + tabela de leilões ativos.
11. `/admin/vehicles` + `/admin/vehicles/new` — Lista e formulário (visual).
12. `/admin/auctions` + `/admin/auctions/new` + `/admin/auctions/$id` — Lista, criação, detalhe com todos os lances (admin vê identidade).
13. `/admin/users` — Tabs Pendentes/Aprovados/Rejeitados/Suspensos.
14. `/admin/negotiations` — Formulário de contraoferta.

## Componentes-chave reutilizáveis

- `AuctionTimer` — countdown DD:HH:MM:SS, fica vermelho < 5min, banner < 2min. (anima com `setInterval` local na fase visual.)
- `ReserveIndicator` — badge verde/vermelho.
- `BidPanel` — botões de incremento rápido + lance personalizado + "Comprar Já".
- `BidHistory` — lista anónima ("VW***") para buyer, identificada para admin.
- `VehicleCard` — card de listagem.
- `VehicleGallery` — carousel de fotos com thumbnails.
- `DamageReportBadge` — link/botão para PDF.
- `AdminLayout` / `BuyerLayout` — sidebars e top bars distintas.

## Dados mock

Um único `src/lib/mock-data.ts` com ~12 viaturas (marcas comuns: VW, BMW, Mercedes, Renault, Peugeot), leilões em diferentes estados (a começar, ativo com 30min, ativo com 2 dias, terminado, em negociação), lances simulados, utilizadores (admin + 3 buyers em estados diferentes), negociações com 2-3 rondas. Imagens via Unsplash ou placeholders consistentes.

## Idioma

Toda a UI em **português**, código em **inglês** (conforme PRD §0.6).

## O que NÃO entra nesta fase

- Lovable Cloud / Supabase
- Auth real, RLS, middleware de proteção
- Stripe / Resend / Twilio
- Edge functions / pg_cron
- Realtime (o timer simula localmente)
- Upload real de ficheiros (inputs visuais apenas)

## Próximos passos depois de aprovares

1. Chamo `design--create_directions` com 3 direções visuais para escolheres.
2. Constrói-se tudo na direção escolhida.
3. Iteramos visualmente.
4. Quando estiveres satisfeito, ativas Lovable Cloud e ligamos backend real (auth → schema → RLS → realtime → server functions → Stripe).

Sobre "fazer via localhost": o preview do Lovable já é equivalente — vês mudanças ao vivo aqui. Quando estiver pronto, publica-se com um clique.
