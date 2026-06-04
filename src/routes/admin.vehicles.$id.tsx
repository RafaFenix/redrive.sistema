import { VehicleForm, type VehicleFormPayload } from "@/components/admin/VehicleForm";
import { getAdminVehicle, getAdminVehicleAuctionLink, type Vehicle } from "@/lib/market-data";
import { getSupabaseClient } from "@/lib/supabase/client";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/vehicles/$id")({
  head: () => ({ meta: [{ title: "Editar viatura — Admin" }] }),
  loader: async ({ params }) => {
    const vehicle = await getAdminVehicle(params.id);
    if (!vehicle) throw notFound();
    const auction = await getAdminVehicleAuctionLink(params.id);
    return { vehicle, auction };
  },
  component: EditVehicle,
});

function EditVehicle() {
  const initialData = Route.useLoaderData();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle>(initialData.vehicle);
  const [auction, setAuction] = useState(initialData.auction);

  useEffect(() => {
    setVehicle(initialData.vehicle);
    setAuction(initialData.auction);
  }, [initialData]);

  async function submit(payload: VehicleFormPayload) {
    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("vehicles")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", vehicle.id);

      if (error) throw error;

      toast.success("Viatura atualizada.");
      await navigate({ to: "/admin/vehicles/$id", params: { id: vehicle.id } });
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar a viatura.");
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Editar viatura
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {vehicle.variant || "Sem versão"} · VIN {vehicle.vin ?? "—"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/vehicles"
            className="border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-muted"
          >
            Voltar
          </Link>
          {auction ? (
            <Link
              to="/auctions/$id"
              params={{ id: auction.id }}
              target="_blank"
              className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
            >
              <ExternalLink className="size-3.5" />
              Ver como comprador
            </Link>
          ) : (
            <Link
              to="/admin/auctions/new"
              search={{ vehicleId: vehicle.id }}
              className="bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
            >
              Criar leilão
            </Link>
          )}
        </div>
      </div>

      {auction && (
        <div className="max-w-3xl border border-border bg-muted/30 p-4 text-sm">
          Link público do lote{" "}
          <Link
            to="/auctions/$id"
            params={{ id: auction.id }}
            target="_blank"
            className="font-semibold underline-offset-4 hover:underline"
          >
            {auction.lotNumber}
          </Link>{" "}
          — abre em nova aba para visualizar exatamente como o utilizador final vê.
        </div>
      )}

      <VehicleForm vehicle={vehicle} submitLabel="Guardar alterações" onSubmit={submit} />
    </div>
  );
}
