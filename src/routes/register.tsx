import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { toast } from "sonner";
import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Registar empresa — ReDrive" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const tradeRegistryFile = formData.get("trade_registry");

    try {
      if (tradeRegistryFile instanceof File && tradeRegistryFile.size > 5 * 1024 * 1024) {
        toast.error("A certidão comercial não pode exceder 5MB.");
        return;
      }

      const supabase = getSupabaseClient();
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            company_name: String(formData.get("company_name") ?? ""),
            vat_number: String(formData.get("vat_number") ?? ""),
            address: String(formData.get("address") ?? ""),
            city: String(formData.get("city") ?? ""),
            contact_name: String(formData.get("contact_name") ?? ""),
            contact_phone: String(formData.get("contact_phone") ?? ""),
            country: "PT",
          },
        },
      });

      if (error) throw error;

      if (
        data.user &&
        data.session &&
        tradeRegistryFile instanceof File &&
        tradeRegistryFile.size > 0
      ) {
        const safeFileName = tradeRegistryFile.name.replace(/[^a-z0-9._-]/gi, "-").toLowerCase();
        const path = `${data.user.id}/${Date.now()}-${safeFileName}`;
        const { error: uploadError } = await supabase.storage
          .from("trade-registry")
          .upload(path, tradeRegistryFile, { upsert: true });
        if (uploadError) throw uploadError;

        const { error: profileError } = await supabase
          .from("profiles")
          .update({ trade_registry_path: path })
          .eq("id", data.user.id);
        if (profileError) throw profileError;
      }

      toast.success("Pedido submetido!", { description: "Aguarde aprovação (até 48h)." });
      await navigate({ to: "/pending-approval" });
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível submeter o pedido.", {
        description: "Confirme os dados e tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
          Acesso a leilões · Apenas empresas
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Registar a minha empresa</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          O acesso à plataforma requer validação manual da equipa ReDrive.
        </p>

        <form onSubmit={submit} className="mt-8 space-y-6 border border-border bg-card p-6">
          <Section title="Conta">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Email empresarial" name="email" type="email" required />
              <Field label="Palavra-passe" name="password" type="password" required minLength={8} />
            </div>
          </Section>

          <Section title="Dados da empresa">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nome da empresa" name="company_name" required />
              <Field label="NIF / NIPC" name="vat_number" required />
              <Field label="Morada" name="address" required />
              <Field label="Cidade" name="city" required />
            </div>
          </Section>

          <Section title="Contacto">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nome do responsável" name="contact_name" required />
              <Field label="Telemóvel" name="contact_phone" type="tel" required />
            </div>
          </Section>

          <Section title="Documentos">
            <label className="block">
              <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Certidão comercial (PDF, máx 5MB)
              </span>
              <input
                name="trade_registry"
                type="file"
                accept="application/pdf"
                required
                className="block w-full border border-dashed border-border bg-background p-4 text-xs text-muted-foreground file:mr-3 file:border-0 file:bg-foreground file:px-3 file:py-1.5 file:text-xs file:font-bold file:uppercase file:text-background"
              />
            </label>
          </Section>

          <label className="flex items-start gap-2 text-xs text-muted-foreground">
            <input type="checkbox" required className="mt-0.5" />
            <span>Aceito os Termos & Condições e a Política de Privacidade da ReDrive.</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "A submeter..." : "Submeter pedido"}
          </button>
        </form>
      </main>
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
  minLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  minLength?: number;
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
        minLength={minLength}
        className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}
