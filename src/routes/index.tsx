import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { HeroSearch } from "@/components/home/HeroSearch";
import { SocialProof } from "@/components/home/SocialProof";
import { WhyReDrive } from "@/components/home/WhyReDrive";
import { Auction, listPublicAuctions } from "@/lib/market-data";

export const Route = createFileRoute("/")({
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
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAuctions() {
      try {
        const data = await listPublicAuctions();
        setAuctions(data);
      } catch (error) {
        console.error("Failed to load public auctions for landing page", error);
      } finally {
        setLoading(false);
      }
    }

    void loadAuctions();
  }, []);

  const endingSoon = auctions
    .filter((a) => a.status === "active")
    .sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime())
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <main className="mx-auto max-w-7xl px-6 py-16 space-y-20">
        {/* SECTION 1: Hero + Search */}
        <section className="pt-8">
          <HeroSearch auctions={auctions} />
        </section>

        {/* SECTION 2: Social Proof */}
        {!loading && auctions.length > 0 && (
          <section>
            <SocialProof auctionCount={auctions.length} />
          </section>
        )}

        {/* SECTION 3: Lances ao Rubro */}
        {!loading && endingSoon.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
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

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {endingSoon.map((a) => (
                <VehicleCard key={a.id} auction={a} vehicle={a.vehicle} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: Porquê ReDrive */}
        <section>
          <WhyReDrive />
        </section>

        {/* SECTION 5: How It Works */}
        <section className="bg-card border border-border rounded-sm p-8 space-y-8">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
              Como funciona
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
              Três passos. Sem fricção.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Step
              n="01"
              title="Registo da empresa"
              body="Submeta certidão comercial e NIF. Aprovação em 48h."
            />
            <Step
              n="02"
              title="Licite em tempo real"
              body="Lances rápidos, timer estendido nos últimos 2 minutos, opção Comprar Já."
            />
            <Step
              n="03"
              title="Legalização e entrega"
              body="Tratamos da legalização, garantia e transporte para a sua concessão."
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-foreground text-background rounded-sm p-12 text-center space-y-6">
          <h2 className="text-3xl font-bold">
            Pronto para comprar viaturas importadas sem intermediários?
          </h2>
          <p className="text-lg text-background/80 max-w-2xl mx-auto">
            Junte-se a centenas de concessionários e retalhistas que confiam na ReDrive para os seus
            leilões semanais.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 rounded-sm"
            >
              Registar agora
            </Link>
            <Link
              to="/auctions"
              className="border-2 border-background text-background hover:bg-background hover:text-foreground font-bold px-8 py-3 rounded-sm"
            >
              Ver catálogo
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted py-12 mt-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">ReDrive</h4>
              <p className="text-sm text-muted-foreground">
                Leilões de automóveis importados. Em tempo real. Sem intermediários.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/auctions" className="hover:text-foreground">
                    Leilões
                  </Link>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-foreground">
                    Como funciona
                  </a>
                </li>
                <li>
                  <Link to="/register" className="hover:text-foreground">
                    Registar empresa
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Conta</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/login" className="hover:text-foreground">
                    Entrar
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-foreground">
                    Criar conta
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="mailto:suporte@redrive.pt" className="hover:text-foreground">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-foreground">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ReDrive — Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="bg-background border border-border rounded-sm p-6">
      <div className="text-5xl font-bold text-primary mb-4">{n}</div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
