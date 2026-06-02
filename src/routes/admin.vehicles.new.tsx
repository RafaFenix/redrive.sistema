import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/vehicles/new")({
  head: () => ({ meta: [{ title: "Nova viatura — Admin" }] }),
  component: NewVehicle,
});

function NewVehicle() {
  const navigate = useNavigate();
  function submit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Viatura criada (demo).");
    setTimeout(() => navigate({ to: "/admin/vehicles" }), 600);
  }
  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Nova viatura</h1>
      <form onSubmit={submit} className="mt-8 max-w-3xl space-y-6 border border-border bg-card p-6">
        <Section title="Identificação">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Marca" required />
            <Field label="Modelo" required />
            <Field label="Versão" />
            <Field label="Ano" type="number" required />
            <Field label="VIN (chassi)" required />
            <Field label="Matrícula de origem" />
          </div>
        </Section>

        <Section title="Especificações">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Quilometragem" type="number" required />
            <Field label="Combustível" />
            <Field label="Transmissão" />
            <Field label="Potência (cv)" type="number" />
            <Field label="Cor" />
            <Field label="Portas" type="number" />
          </div>
        </Section>

        <Section title="Descrição">
          <textarea rows={4} className="w-full border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none" placeholder="Descrição pública da viatura..." />
        </Section>

        <Section title="Ficheiros">
          <div className="space-y-3">
            <label className="block">
              <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fotos (múltiplas)</span>
              <input type="file" multiple accept="image/*" className="block w-full border border-dashed border-border bg-background p-4 text-xs file:mr-3 file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:text-background" />
            </label>
            <label className="block">
              <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Relatório de danos (PDF)</span>
              <input type="file" accept="application/pdf" className="block w-full border border-dashed border-border bg-background p-4 text-xs file:mr-3 file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:text-background" />
            </label>
          </div>
        </Section>

        <button type="submit" className="bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90">
          Guardar como rascunho
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, type = "text", required }: { label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input type={type} required={required} className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none" />
    </label>
  );
}
