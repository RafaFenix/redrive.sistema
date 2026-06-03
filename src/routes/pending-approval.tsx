import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/pending-approval")({
  head: () => ({ meta: [{ title: "Aguarda aprovação — ReDrive" }] }),
  component: PendingPage,
});

function PendingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto grid max-w-lg place-items-center px-6 py-24 text-center">
        <div className="grid size-16 place-items-center rounded-full border-2 border-foreground">
          <Clock className="size-8" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Pedido em análise</h1>
        <p className="mt-3 max-w-prose text-sm text-muted-foreground">
          A nossa equipa está a verificar a documentação da sua empresa. Receberá um email assim que
          o seu acesso for aprovado — normalmente em menos de 48h úteis.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/auctions"
            className="border-2 border-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background"
          >
            Ver leilões públicos
          </Link>
          <Link
            to="/setup-admin"
            className="border-2 border-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Configurar primeiro admin
          </Link>
          <Link
            to="/"
            className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
    </div>
  );
}
