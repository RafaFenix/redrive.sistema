import { Zap, Shield, Truck, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const BENEFITS = [
  {
    icon: Zap,
    title: "Preço justo",
    description: "Sem intermediários — pague direto ao vendedor",
  },
  {
    icon: Shield,
    title: "COC + Documentação",
    description: "Certificado de conformidade e papéis legais inclusos",
  },
  {
    icon: Truck,
    title: "Importação tratada",
    description: "Entrega e legalização geridas pela ReDrive",
  },
  {
    icon: Clock,
    title: "Tempo real",
    description: "Leilões ao vivo com anti-sniping (últimos 2 min)",
  },
  {
    icon: CheckCircle,
    title: "Segurança",
    description: "KYC completo — apenas empresas verificadas",
  },
  {
    icon: MessageSquare,
    title: "Negocie",
    description: "Se não vender em leilão, abre negociação privada",
  },
];

export function WhyChooseSection() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 py-12">
      <h2 className="mb-12 text-center text-4xl font-bold">Porquê escolher a ReDrive?</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.title}
              className="rounded-lg border border-border bg-card p-6 transition hover:shadow-md"
            >
              <Icon className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">{benefit.title}</h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          );
        })}
      </div>

      <div className="pt-8 text-center">
        <Button
          onClick={() => navigate({ to: "/register" })}
          className="bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90 text-lg"
        >
          Comece já!
        </Button>
      </div>
    </div>
  );
}
