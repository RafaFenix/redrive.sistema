import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Registar empresa — ReDrive" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  function submit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Pedido submetido!", { description: "Aguarde aprovação (até 48h)." });
    setTimeout(() => navigate({ to: "/pending-approval" }), 800);
  }
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
          Acesso a leilões · Apenas empresas
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Registar a minha empresa</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O acesso à plataforma requer validação manual da equipa ReDrive.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-6 border border-border bg-card p-6">
          <Section title="Conta">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Email empresarial" type="email" required />
              <Field label="Palavra-passe" type="password" required />
            </div>
          </Section>

          <Section title="Dados da empresa">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nome da empresa" required />
              <Field label="NIF / NIPC" required />
              <Field label="Morada" required />
              <Field label="Cidade" required />
            </div>
          </Section>

          <Section title="Contacto">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nome do responsável" required />
              <Field label="Telemóvel" type="tel" required />
            </div>
          </Section>

          <Section title="Documentos">
            <label className="block">
              <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Certidão comercial (PDF, máx 5MB)
              </span>
              <input
                type="file"
                accept="application/pdf"
                required
                className="block w-full border border-dashed border-border bg-background p-4 text-xs text-muted-foreground file:mr-3 file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:text-background"
              />
            </label>
          </Section>

          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" required className="mt-0.5" />
            <span>Aceito os Termos & Condições e a Política de Privacidade da ReDrive.</span>
          </label>

          <button type="submit" className="w-full bg-primary py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
            Submeter pedido
          </button>
        </form>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, type = "text", required }: { label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input type={type} required={required} className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
    </label>
  );
}
