import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { listPublicAuctions } from "@/lib/market-data";
import { ArrowRight, ShieldCheck, Gavel, Truck } from "lucide-react";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await listPublicAuctions();
    } catch (error) {
      console.error("Failed to load public auctions for landing page", error);
      return [];
    }
  },
  head: () => ({
    meta: [
      { title: "ReDrive — Leilão Automóvel B2B" },
      {
        name: "description",
        content:
          "Plataforma B2B de leilão e venda imediata de automóveis importados para profissionais do setor.",
      },
      { property: "og:title", content: "ReDrive — Leilão Automóvel B2B" },
      {
        property: "og:description",
        content: "Plataforma B2B de leilão de viaturas importadas.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const auctions = Route.useLoaderData();
  const featured = auctions.filter((a) => a.status === "active").slice(0, 6);
  const endingSoon = [...featured]
    .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                Plataforma B2B · Apenas empresas aprovadas
              </span>
              <h1 className="mt-3 text-5xl font-extrabold leading-[1.05] tracking-tighter text-balance md:text-6xl">
                Leilão de automóveis importados.
                <br />
                <span className="text-primary">Em tempo real.</span> Sem intermediários.
              </h1>
              <p className="mt-6 max-w-prose text-base text-muted-foreground">
                A ReDrive é o pregão digital onde concessionárias, retalhistas e importadores acedem
                mensalmente a centenas de viaturas vindas do estrangeiro. Licite, compre já ou
                negoceie.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/auctions"
                  className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Ver leilões ativos <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 border-2 border-foreground px-5 py-3 text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background"
                >
                  Registar a minha empresa
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                <Stat label="Lotes / mês" value="~60" />
                <Stat label="Compradores aprovados" value="240+" />
                <Stat label="Países de origem" value="DE · FR · IT" />
                <Stat label="Taxa de adjudicação" value="92%" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ending soon */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                Termina em breve
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Lances ao rubro</h2>
            </div>
            <Link
              to="/auctions"
              className="hidden text-sm font-semibold underline-offset-4 hover:underline md:inline"
            >
              Ver todos →
            </Link>
          </div>
          {endingSoon.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {endingSoon.map((a) => (
                <VehicleCard key={a.id} auction={a} vehicle={a.vehicle} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
              Ainda não há leilões ativos. Volte em breve.
            </div>
          )}
        </div>
      </section>

      {/* How */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            Como funciona
          </span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Três passos. Sem fricção.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Step
              n="01"
              icon={ShieldCheck}
              title="Registo da empresa"
              body="Submeta certidão comercial e NIF. Aprovação em 48h."
            />
            <Step
              n="02"
              icon={Gavel}
              title="Licite em tempo real"
              body="Lances rápidos, timer estendido nos últimos 2 minutos, opção Comprar Já."
            />
            <Step
              n="03"
              icon={Truck}
              title="Legalização e entrega"
              body="Tratamos da legalização, garantia e transporte para a sua concessão."
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} ReDrive — Todos os direitos reservados.</span>
          <span className="font-mono uppercase tracking-widest">B2B · Portugal</span>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-card p-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-extrabold tracking-tight">{value}</div>
    </div>
  );
}

function Step({
  n,
  icon: Icon,
  title,
  body,
}: {
  n: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="border border-border bg-background p-6">
      <div className="flex items-center justify-between">
        <Icon className="size-6 text-primary" />
        <span className="font-mono text-xs font-bold text-muted-foreground">{n}</span>
      </div>
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
