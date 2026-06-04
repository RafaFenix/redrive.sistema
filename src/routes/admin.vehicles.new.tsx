import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { VehicleForm, type VehicleFormPayload } from "@/components/admin/VehicleForm";
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
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("vehicles").insert(payload);

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
      <VehicleForm submitLabel="Guardar viatura" onSubmit={submit} />
    </div>
  );
}
