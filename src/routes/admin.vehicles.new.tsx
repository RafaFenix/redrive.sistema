import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getSupabaseClient } from "@/lib/supabase/client";
import { euroToCents, parseInteger, parsePhotoUrls } from "@/lib/market-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/vehicles/new")({
  head: () => ({ meta: [{ title: "Nova viatura — Admin" }] }),
  component: NewVehicle,
});

function NewVehicle() {
  const navigate = useNavigate();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("vehicles").insert({
        status: String(formData.get("status") ?? "draft"),
        make: String(formData.get("make") ?? "").trim(),
        model: String(formData.get("model") ?? "").trim(),
        variant: String(formData.get("variant") ?? "").trim() || null,
        year: parseInteger(formData.get("year")),
        vin: String(formData.get("vin") ?? "").trim() || null,
        origin_plate: String(formData.get("origin_plate") ?? "").trim() || null,
        mileage: parseInteger(formData.get("mileage")) ?? 0,
        fuel_type: String(formData.get("fuel_type") ?? "").trim() || null,
        transmission: String(formData.get("transmission") ?? "").trim() || null,
        power_cv: parseInteger(formData.get("power_cv")),
        color: String(formData.get("color") ?? "").trim() || null,
        doors: parseInteger(formData.get("doors")),
        condition: String(formData.get("condition") ?? "").trim() || null,
        description: String(formData.get("description") ?? "").trim() || null,
        photos: parsePhotoUrls(formData.get("photos")),
        legalization_cost: euroToCents(formData.get("legalization_cost")) ?? 0,
        market_price_ref: euroToCents(formData.get("market_price_ref")),
        lead_time_days: parseInteger(formData.get("lead_time_days")),
      });

      if (error) throw error;

      toast.success("Viatura criada.");
      await navigate({ to: "/admin/vehicles" });
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível criar a viatura.");
    }
  }
  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Nova viatura</h1>
      <form onSubmit={submit} className="mt-8 max-w-3xl space-y-6 border border-border bg-card p-6">
        <Section title="Identificação">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Marca" name="make" required />
            <Field label="Modelo" name="model" required />
            <Field label="Versão" name="variant" />
            <Field label="Ano" name="year" type="number" required />
            <Field label="VIN (chassi)" name="vin" required />
            <Field label="Matrícula de origem" name="origin_plate" />
          </div>
        </Section>

        <Section title="Especificações">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Quilometragem" name="mileage" type="number" required />
            <Field label="Combustível" name="fuel_type" />
            <Field label="Transmissão" name="transmission" />
            <Field label="Potência (cv)" name="power_cv" type="number" />
            <Field label="Cor" name="color" />
            <Field label="Portas" name="doors" type="number" />
            <Field label="Estado geral" name="condition" />
            <Field label="Legalização (€)" name="legalization_cost" type="number" />
            <Field label="Preço mercado ref. (€)" name="market_price_ref" type="number" />
            <Field label="Prazo entrega (dias)" name="lead_time_days" type="number" />
            <label className="block">
              <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Estado
              </span>
              <select
                name="status"
                defaultValue="draft"
                className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
              >
                <option value="draft">Rascunho</option>
                <option value="active">Ativa</option>
                <option value="archived">Arquivada</option>
              </select>
            </label>
          </div>
        </Section>

        <Section title="Descrição">
          <textarea
            name="description"
            rows={4}
            className="w-full border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none"
            placeholder="Descrição pública da viatura..."
          />
        </Section>

        <Section title="Fotos">
          <label className="block">
            <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              URLs das fotos
            </span>
            <textarea
              name="photos"
              rows={4}
              className="w-full border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none"
              placeholder="Uma URL por linha ou separadas por vírgula"
            />
          </label>
        </Section>

        <button
          type="submit"
          className="bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
        >
          Guardar como rascunho
        </button>
      </form>
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

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}
