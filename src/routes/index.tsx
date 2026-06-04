import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import type { Auction } from "@/lib/market-data";
import { listPublicAuctions } from "@/lib/market-data";
import {
  HeroSection,
  BenefitsSection,
  VehicleGridSection,
  WhyChooseSection,
  BrandCarousel,
  CountryCarousel,
  TestimonialCarousel,
  FinalCTA,
} from "@/components/home";

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

  useEffect(() => {
    async function loadAuctions() {
      try {
        const data = await listPublicAuctions();
        setAuctions(data);
      } catch (error) {
        console.error("Failed to load public auctions for landing page", error);
      }
    }

    void loadAuctions();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <main className="mx-auto max-w-7xl px-6 py-16 space-y-20">
        {/* Section 1: Hero + Search */}
        <section className="pt-8">
          <HeroSection auctions={auctions} />
        </section>

        {/* Section 2: Benefits */}
        <section>
          <BenefitsSection />
        </section>

        {/* Section 3: Recently Added */}
        <section>
          <VehicleGridSection auctions={auctions} />
        </section>

        {/* Section 4: Why Choose */}
        <section>
          <WhyChooseSection />
        </section>

        {/* Section 5: Brand Carousel */}
        <section>
          <BrandCarousel auctions={auctions} />
        </section>

        {/* Section 6: Country Carousel */}
        <section>
          <CountryCarousel />
        </section>

        {/* Section 7: Testimonials */}
        <section>
          <TestimonialCarousel />
        </section>

        {/* Section 8: Final CTA */}
        <section>
          <FinalCTA />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h4 className="mb-4 font-semibold">ReDrive</h4>
              <p className="text-sm text-muted-foreground">
                Leilões de automóveis importados. Em tempo real. Sem intermediários.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/auctions" className="hover:text-foreground">
                    Leilões
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-foreground">
                    Como funciona
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-foreground">
                    Registar empresa
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Conta</h4>
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
              <h4 className="mb-4 font-semibold">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#contact" className="hover:text-foreground">
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
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ReDrive — Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
