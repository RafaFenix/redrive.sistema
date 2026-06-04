import { Zap, Shield, Truck, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

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

export function WhyReDrive() {
  const navigate = useNavigate();

  return (
    <div className="py-12 space-y-8">
      <h2 className="text-4xl font-bold text-center mb-12">Porquê escolher a ReDrive?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BENEFITS.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.title}
              className="border border-border rounded-sm p-6 bg-card hover:shadow-md transition"
            >
              <Icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{benefit.description}</p>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-8">
        <button
          onClick={() => navigate({ to: "/register" })}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3 text-lg rounded-sm transition-colors"
        >
          Comece já!
        </button>
      </div>
    </div>
  );
}
