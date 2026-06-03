import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { euroToCents, listAdminVehicles, parseBidIncrements, Vehicle } from "@/lib/market-data";
import { getSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/auctions/new")({
  head: () => ({ meta: [{ title: "Novo leilão — Admin" }] }),
  component: NewAuction,
});

function NewAuction() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadVehicles() {
      try {
        const data = await listAdminVehicles();
        setVehicles(
          data.filter((vehicle) => vehicle.status === "active" || vehicle.status === "draft"),
        );
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível carregar viaturas.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadVehicles();
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const startingPrice = euroToCents(formData.get("starting_price"));
    const reservePrice = euroToCents(formData.get("reserve_price"));
    const startsAt = String(formData.get("starts_at") ?? "");
    const endsAt = String(formData.get("ends_at") ?? "");

    if (!startingPrice || !reservePrice || !startsAt || !endsAt) {
      toast.error("Preencha os campos obrigatórios do leilão.");
      return;
    }

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("auctions").insert({
        lot_number:
          String(formData.get("lot_number") ?? "").trim() ||
          `RD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        vehicle_id: String(formData.get("vehicle_id") ?? ""),
        status: String(formData.get("status") ?? "scheduled"),
        mode: String(formData.get("mode") ?? "standard"),
        starting_price: startingPrice,
        reserve_price: reservePrice,
        buy_now_price: euroToCents(formData.get("buy_now_price")),
        current_price: startingPrice,
        bid_increments: parseBidIncrements(formData.get("bid_increments")),
        starts_at: new Date(startsAt).toISOString(),
        ends_at: new Date(endsAt).toISOString(),
      });

      if (error) throw error;

      toast.success("Leilão criado.");
      await navigate({ to: "/admin/auctions" });
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível criar o leilão.");
    }
  }
  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Novo leilão</h1>
      <form onSubmit={submit} className="mt-8 max-w-2xl space-y-6 border border-border bg-card p-6">
        <label className="block">
          <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Viatura
          </span>
          <select
            name="vehicle_id"
            required
            disabled={isLoading || vehicles.length === 0}
            className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">{isLoading ? "A carregar..." : "Selecione uma viatura"}</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.year} {v.make} {v.model} — {v.variant}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Lote" name="lot_number" hint="Auto se vazio" />
          <Field label="Preço inicial (€)" name="starting_price" type="number" required />
          <Field
            label="Preço de reserva (€)"
            name="reserve_price"
            type="number"
            required
            hint="Oculto ao público"
          />
          <Field label="Comprar Já (€)" name="buy_now_price" type="number" hint="Opcional" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Início" name="starts_at" type="datetime-local" required />
          <Field label="Fim" name="ends_at" type="datetime-local" required />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Estado
            </span>
            <select
              name="status"
              defaultValue="scheduled"
              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="scheduled">Agendado</option>
              <option value="active">Ativo</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Modo
            </span>
            <select
              name="mode"
              defaultValue="standard"
              className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
            >
              <option value="standard">Standard</option>
              <option value="blind">Blind</option>
            </select>
          </label>
        </div>

        <Field
          label="Incrementos (cêntimos, separados por vírgula)"
          name="bid_increments"
          defaultValue="10000, 20000, 50000"
        />

        <button
          type="submit"
          className="bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
        >
          Publicar leilão
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  hint,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  hint?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-baseline justify-between gap-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {hint && <span className="font-mono text-[9px] text-muted-foreground">{hint}</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}
