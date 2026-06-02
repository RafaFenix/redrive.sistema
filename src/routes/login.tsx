import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — ReDrive" }] }),
  component: LoginPage,
});

function LoginPage() {
  function submit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Demo — autenticação ainda não está ligada.");
  }
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto grid max-w-md gap-6 px-6 py-16">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            Acesso restrito · B2B
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Entrar</h1>
        </div>
        <form onSubmit={submit} className="space-y-4 border border-border bg-card p-6">
          <Field label="Email empresarial" type="email" required />
          <Field label="Palavra-passe" type="password" required />
          <button type="submit" className="w-full bg-primary py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
            Entrar
          </button>
          <div className="flex justify-between pt-2 text-xs">
            <Link to="/register" className="text-muted-foreground hover:text-foreground">
              Não tem conta? Registar →
            </Link>
            <a href="#" className="text-muted-foreground hover:text-foreground">Recuperar palavra-passe</a>
          </div>
        </form>

        <div className="grid grid-cols-2 gap-2 border border-dashed border-border bg-card p-4 text-xs">
          <span className="col-span-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Atalhos demo</span>
          <Link to="/buyer/dashboard" className="border border-border bg-background px-3 py-2 text-center font-medium hover:border-foreground">
            Entrar como comprador
          </Link>
          <Link to="/admin/dashboard" className="border border-border bg-background px-3 py-2 text-center font-medium hover:border-foreground">
            Entrar como admin
          </Link>
        </div>
      </main>
    </div>
  );
}

function Field({ label, type = "text", required }: { label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        required={required}
        className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}
