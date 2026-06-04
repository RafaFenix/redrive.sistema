import { VehicleForm, type VehicleFormPayload } from "@/components/admin/VehicleForm";
import {
  getAdminVehicle,
  getAdminVehicleAuctionLink,
  type Vehicle,
  uploadVehicleDocument,
  uploadVehiclePhoto,
} from "@/lib/market-data";
import { getSupabaseClient } from "@/lib/supabase/client";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/vehicles/$id")({
  head: () => ({ meta: [{ title: "Editar viatura — Admin" }] }),
  component: EditVehicle,
});

function EditVehicle() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [auction, setAuction] =
    useState<Awaited<ReturnType<typeof getAdminVehicleAuctionLink>>>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadVehicle() {
      try {
        const [vehicleData, auctionData] = await Promise.all([
          getAdminVehicle(id),
          getAdminVehicleAuctionLink(id),
        ]);

        if (!isMounted) return;

        if (!vehicleData) {
          toast.error("Viatura não encontrada.");
          await navigate({ to: "/admin/vehicles" });
          return;
        }

        setVehicle(vehicleData);
        setAuction(auctionData);
      } catch (error) {
        console.error(error);
        if (!isMounted) return;
        toast.error("Não foi possível carregar a viatura.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadVehicle();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  async function submit(payload: VehicleFormPayload) {
    if (!vehicle) return;

    try {
      const { photoFiles, documentFiles, ...vehiclePayload } = payload;
      const uploadedPhotos = await Promise.all(
        photoFiles.map((file) => uploadVehiclePhoto(vehicle.id, file)),
      );
      const uploadedDocuments = await uploadDocuments(vehicle.id, documentFiles);
      const supabase = getSupabaseClient();
      const { error } = await supabase
        .from("vehicles")
        .update({
          ...vehiclePayload,
          photos: [...vehiclePayload.photos, ...uploadedPhotos],
          ...uploadedDocuments,
          updated_at: new Date().toISOString(),
        })
        .eq("id", vehicle.id);

      if (error) throw error;

      toast.success("Viatura atualizada.");
      await navigate({ to: "/admin/vehicles/$id", params: { id: vehicle.id } });
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar a viatura.");
    }
  }

  if (isLoading) {
    return <div className="p-8 text-sm text-muted-foreground">A carregar dados da viatura...</div>;
  }

  if (!vehicle) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Viatura não encontrada</h1>
        <Link
          to="/admin/vehicles"
          className="mt-4 inline-block text-sm font-semibold underline-offset-4 hover:underline"
        >
          Voltar às viaturas
        </Link>
      </div>
    );
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

async function uploadDocuments(vehicleId: string, files: VehicleFormPayload["documentFiles"]) {
  const entries = await Promise.all([
    files.damage
      ? uploadVehicleDocument(vehicleId, "damage", files.damage).then(
          (path) => ["damage_report_path", path] as const,
        )
      : null,
    files.appraisal
      ? uploadVehicleDocument(vehicleId, "appraisal", files.appraisal).then(
          (path) => ["appraisal_path", path] as const,
        )
      : null,
    files.service
      ? uploadVehicleDocument(vehicleId, "service", files.service).then(
          (path) => ["service_history_path", path] as const,
        )
      : null,
    files.coc
      ? uploadVehicleDocument(vehicleId, "coc", files.coc).then(
          (path) => ["coc_path", path] as const,
        )
      : null,
  ]);

  return Object.fromEntries(
    entries.filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
  );
}
