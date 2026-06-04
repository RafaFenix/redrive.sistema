import type { Vehicle } from "@/lib/market-data";
import { euroToCents, parseInteger, parsePhotoUrls } from "@/lib/market-data";

export type VehicleFormPayload = {
  status: string;
  make: string;
  model: string;
  variant: string | null;
  year: number | null;
  vin: string | null;
  origin_plate: string | null;
  mileage: number;
  fuel_type: string | null;
  transmission: string | null;
  power_cv: number | null;
  color: string | null;
  doors: number | null;
  condition: string | null;
  description: string | null;
  photos: string[];
  legalization_cost: number;
  market_price_ref: number | null;
  lead_time_days: number | null;
  damage_report_path: string | null;
  appraisal_path: string | null;
  service_history_path: string | null;
  coc_path: string | null;
};

type Props = {
  vehicle?: Vehicle | null;
  submitLabel: string;
  onSubmit: (payload: VehicleFormPayload) => Promise<void>;
};

export function VehicleForm({ vehicle, submitLabel, onSubmit }: Props) {
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onSubmit(buildVehiclePayload(formData));
  }

  return (
    <form onSubmit={submit} className="mt-8 max-w-3xl space-y-6 border border-border bg-card p-6">
      <Section title="Identificação">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Marca" name="make" defaultValue={vehicle?.make} required />
          <Field label="Modelo" name="model" defaultValue={vehicle?.model} required />
          <Field label="Versão" name="variant" defaultValue={vehicle?.variant} />
          <Field label="Ano" name="year" type="number" defaultValue={vehicle?.year} required />
          <Field label="VIN (chassi)" name="vin" defaultValue={vehicle?.vin} required />
          <Field
            label="Matrícula de origem"
            name="origin_plate"
            defaultValue={vehicle?.originPlate}
          />
        </div>
      </Section>

      <Section title="Especificações">
        <div className="grid gap-4 md:grid-cols-3">
          <Field
            label="Quilometragem"
            name="mileage"
            type="number"
            defaultValue={vehicle?.mileage}
            required
          />
          <Field
            label="Combustível"
            name="fuel_type"
            defaultValue={cleanPlaceholder(vehicle?.fuelType)}
          />
          <Field
            label="Transmissão"
            name="transmission"
            defaultValue={cleanPlaceholder(vehicle?.transmission)}
          />
          <Field
            label="Potência (cv)"
            name="power_cv"
            type="number"
            defaultValue={vehicle?.powerCv}
          />
          <Field label="Cor" name="color" defaultValue={cleanPlaceholder(vehicle?.color)} />
          <Field label="Portas" name="doors" type="number" defaultValue={vehicle?.doors} />
          <Field
            label="Estado geral"
            name="condition"
            defaultValue={cleanPlaceholder(vehicle?.condition)}
          />
          <Field
            label="Legalização (€)"
            name="legalization_cost"
            type="number"
            defaultValue={centsToEuros(vehicle?.legalizationCost)}
          />
          <Field
            label="Preço mercado ref. (€)"
            name="market_price_ref"
            type="number"
            defaultValue={centsToEuros(vehicle?.marketPriceRef)}
          />
          <Field
            label="Prazo entrega (dias)"
            name="lead_time_days"
            type="number"
            defaultValue={vehicle?.leadTimeDays}
          />
          <label className="block">
            <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Estado
            </span>
            <select
              name="status"
              defaultValue={vehicle?.status ?? "draft"}
              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="draft">Rascunho</option>
              <option value="active">Ativa</option>
              <option value="sold">Vendida</option>
              <option value="archived">Arquivada</option>
            </select>
          </label>
        </div>
      </Section>

      <Section title="Descrição">
        <textarea
          name="description"
          rows={4}
          defaultValue={vehicle?.description}
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
            defaultValue={vehicle?.photos
              .filter((photo) => photo !== "/placeholder.svg")
              .join("\n")}
            className="w-full border border-border bg-background p-3 text-sm focus:border-primary focus:outline-none"
            placeholder="Uma URL por linha ou separadas por vírgula"
          />
        </label>
      </Section>

      <Section title="Documentos (caminhos no bucket vehicle-documents)">
        <p className="mb-3 text-xs text-muted-foreground">
          Faça upload dos PDFs para o bucket privado <code>vehicle-documents</code> e cole o caminho
          relativo. Apenas compradores aprovados conseguem aceder.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Relatório de danos"
            name="damage_report_path"
            defaultValue={vehicle?.damageReportPath}
          />
          <Field label="Avaliação" name="appraisal_path" defaultValue={vehicle?.appraisalPath} />
          <Field
            label="Histórico de manutenção"
            name="service_history_path"
            defaultValue={vehicle?.serviceHistoryPath}
          />
          <Field
            label="COC (certificado conformidade)"
            name="coc_path"
            defaultValue={vehicle?.cocPath}
          />
        </div>
      </Section>

      <button
        type="submit"
        className="bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function buildVehiclePayload(formData: FormData): VehicleFormPayload {
  return {
    status: String(formData.get("status") ?? "draft"),
    make: String(formData.get("make") ?? "").trim(),
    model: String(formData.get("model") ?? "").trim(),
    variant: optionalText(formData.get("variant")),
    year: parseInteger(formData.get("year")),
    vin: optionalText(formData.get("vin")),
    origin_plate: optionalText(formData.get("origin_plate")),
    mileage: parseInteger(formData.get("mileage")) ?? 0,
    fuel_type: optionalText(formData.get("fuel_type")),
    transmission: optionalText(formData.get("transmission")),
    power_cv: parseInteger(formData.get("power_cv")),
    color: optionalText(formData.get("color")),
    doors: parseInteger(formData.get("doors")),
    condition: optionalText(formData.get("condition")),
    description: optionalText(formData.get("description")),
    photos: parsePhotoUrls(formData.get("photos")),
    legalization_cost: euroToCents(formData.get("legalization_cost")) ?? 0,
    market_price_ref: euroToCents(formData.get("market_price_ref")),
    lead_time_days: parseInteger(formData.get("lead_time_days")),
    damage_report_path: optionalText(formData.get("damage_report_path")),
    appraisal_path: optionalText(formData.get("appraisal_path")),
    service_history_path: optionalText(formData.get("service_history_path")),
    coc_path: optionalText(formData.get("coc_path")),
  };
}

function optionalText(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text || null;
}

function centsToEuros(value?: number | null) {
  if (!value) return undefined;
  return String(value / 100);
}

function cleanPlaceholder(value?: string | null) {
  return value && value !== "—" ? value : undefined;
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
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string | number | null;
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
        defaultValue={defaultValue ?? undefined}
        className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}
