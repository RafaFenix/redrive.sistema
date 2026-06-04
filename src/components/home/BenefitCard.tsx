import type { LucideIcon } from "lucide-react";

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function BenefitCard({ icon: Icon, title, description }: BenefitCardProps) {
  return (
    <div className="flex flex-col items-center space-y-3 p-6 text-center">
      <Icon className="h-8 w-8 text-primary" />
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
