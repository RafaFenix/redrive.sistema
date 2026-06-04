import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VehicleForm, type VehicleFormPayload } from "@/components/admin/VehicleForm";
import { uploadVehicleDocument, uploadVehiclePhoto } from "@/lib/market-data";
import { getSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/vehicles/new")({
  head: () => ({ meta: [{ title: "Nova viatura — Admin" }] }),
  component: NewVehicle,
});

function NewVehicle() {
  const navigate = useNavigate();
  async function submit(payload: VehicleFormPayload) {
    try {
      const { photoFiles, documentFiles, ...vehiclePayload } = payload;
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("vehicles")
        .insert(vehiclePayload)
        .select("id")
        .single();

      if (error) throw error;
      if (!data?.id) throw new Error("Viatura criada sem ID.");

      const uploadedPhotos = await Promise.all(
        photoFiles.map((file) => uploadVehiclePhoto(data.id as string, file)),
      );
      const uploadedDocuments = await uploadDocuments(data.id as string, documentFiles);
      const updatePayload = {
        photos: [...vehiclePayload.photos, ...uploadedPhotos],
        ...uploadedDocuments,
      };

      if (
        uploadedPhotos.length > 0 ||
        Object.values(uploadedDocuments).some((value) => Boolean(value))
      ) {
        const { error: updateError } = await supabase
          .from("vehicles")
          .update(updatePayload)
          .eq("id", data.id as string);
        if (updateError) throw updateError;
      }

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
      <VehicleForm submitLabel="Guardar viatura" onSubmit={submit} />
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
