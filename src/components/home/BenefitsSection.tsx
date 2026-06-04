import { Globe, DollarSign, Truck, TrendingUp, Award } from "lucide-react";
import { BenefitCard } from "./BenefitCard";

const BENEFITS = [
  {
    icon: Globe,
    title: "Suporte multilíngue",
    description: "Equipa pronta para ajudar em 24/7",
  },
  {
    icon: DollarSign,
    title: "Taxas transparentes",
    description: "Comissões justas, sem custos ocultos",
  },
  {
    icon: Truck,
    title: "Entrega à porta",
    description: "Transporte e legalização inclusos",
  },
  {
    icon: TrendingUp,
    title: "Preços inteligentes",
    description: "Algoritmo justo, sem intermediários",
  },
  {
    icon: Award,
    title: "Alta qualidade garantida",
    description: "Apenas viaturas verificadas e documentadas",
  },
];

export function BenefitsSection() {
  return (
    <div className="grid grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-5">
      {BENEFITS.map((benefit) => (
        <BenefitCard key={benefit.title} {...benefit} />
      ))}
    </div>
  );
}
