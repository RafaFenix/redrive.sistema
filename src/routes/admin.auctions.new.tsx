import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { vehicles } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/auctions/new")({
  head: () => ({ meta: [{ title: "Novo leilão — Admin" }] }),
  component: NewAuction,
});

function NewAuction() {
  const navigate = useNavigate();
  function submit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Leilão publicado (demo).");
    setTimeout(() => navigate({ to: "/admin/auctions" }), 600);
  }
  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Novo leilão</h1>
      <form onSubmit={submit} className="mt-8 max-w-2xl space-y-6 border border-border bg-card p-6">
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Viatura</span>
          <select className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none">
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} — {v.variant}</option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Preço inicial (€)" type="number" required />
          <Field label="Preço de reserva (€)" type="number" required hint="Oculto ao público" />
          <Field label="Comprar Já (€)" type="number" hint="Opcional" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Início" type="datetime-local" required />
          <Field label="Fim" type="datetime-local" required />
        </div>

        <Field label="Incrementos (cêntimos, separados por vírgula)" defaultValue="10000, 20000, 50000" />

        <button type="submit" className="bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
          Publicar leilão
        </button>
      </form>
    </div>
  );
}

function Field({ label, type = "text", required, hint, defaultValue }: { label: string; type?: string; required?: boolean; hint?: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        {hint && <span className="font-mono text-[9px] text-muted-foreground">{hint}</span>}
      </span>
      <input type={type} required={required} defaultValue={defaultValue} className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
    </label>
  );
}
