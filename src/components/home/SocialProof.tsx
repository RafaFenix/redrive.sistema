import { BarChart3, Users, Globe, TrendingUp } from "lucide-react";

interface SocialProofProps {
  auctionCount?: number;
}

export function SocialProof({ auctionCount = 60 }: SocialProofProps) {
  const metrics = [
    {
      label: "Lotes/mês",
      value: `~${auctionCount}`,
      icon: BarChart3,
    },
    {
      label: "Compradores aprovados",
      value: "240+",
      icon: Users,
    },
    {
      label: "Países de origem",
      value: "DE · FR · IT",
      icon: Globe,
    },
    {
      label: "Taxa de adjudicação",
      value: "92%",
      icon: TrendingUp,
    },
  ];

  const benefits = [
    "✓ Taxas transparentes",
    "✓ COC e documentos",
    "✓ Entrega tratada",
    "✓ Leilões em tempo real",
    "✓ Empresas verificadas",
  ];

  return (
    <div className="space-y-8 py-12">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="border border-border rounded-sm p-6 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-6 h-6 text-primary" />
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </div>
              <p className="text-3xl font-bold text-foreground">{metric.value}</p>
            </div>
          );
        })}
      </div>

      {/* Benefits Bar */}
      <div className="bg-muted border border-border rounded-sm p-6">
        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
          {benefits.map((benefit) => (
            <span key={benefit} className="text-sm font-medium text-foreground">
              {benefit}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
