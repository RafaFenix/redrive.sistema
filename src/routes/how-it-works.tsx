import { createFileRoute } from "@tanstack/react-router";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { ShieldCheck, Gavel, Truck, FileSignature } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "Como funciona — ReDrive" },
      {
        name: "description",
        content: "Processo de registo, leilão e entrega na ReDrive em 4 passos.",
      },
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
          Processo
        </span>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">Como funciona a ReDrive</h1>
        <p className="mt-3 max-w-prose text-muted-foreground">
          Plataforma B2B para concessionárias, retalhistas e importadores que pretendem acesso a
          viaturas importadas a um ritmo regular.
        </p>

        <div className="mt-10 space-y-4">
          <Step
            n="01"
            icon={FileSignature}
            title="Registo e validação"
            body="Submete documentação (NIF, certidão comercial). Aprovação em 48h."
          />
          <Step
            n="02"
            icon={Gavel}
            title="Licitação em tempo real"
            body="Liga-te a leilões ativos. Lances rápidos (+100€/+200€/+500€) ou valor personalizado. Indicador semáforo mostra se a reserva foi atingida — mas o valor da reserva nunca é revelado."
          />
          <Step
            n="03"
            icon={ShieldCheck}
            title="Adjudicação"
            body="Se ganhas e a reserva é atingida, o leilão é adjudicado automaticamente. Caso contrário, abre-se uma negociação privada de até 5 rondas."
          />
          <Step
            n="04"
            icon={Truck}
            title="Legalização & entrega"
            body="Tratamos da legalização nacional, opção de garantia e transporte para a tua concessão."
          />
        </div>
      </main>
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
    <div className="flex gap-5 border border-border bg-card p-6">
      <div className="grid size-12 shrink-0 place-items-center border border-foreground">
        <Icon className="size-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <span className="font-mono text-xs text-muted-foreground">{n}</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
