import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PublicHeader } from "@/components/layout/PublicHeader";
import { getSupabaseClient } from "@/lib/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Recuperar palavra-passe — ReDrive" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasRecoverySession(Boolean(data.session));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setHasRecoverySession(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function requestReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Email enviado.", {
        description: "Verifique a caixa de entrada para continuar.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível enviar o email de recuperação.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") ?? "");

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Palavra-passe atualizada.");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar a palavra-passe.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto grid max-w-md gap-6 px-6 py-16">
        <div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
            Conta ReDrive
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Recuperar palavra-passe</h1>
        </div>

        {hasRecoverySession ? (
          <form onSubmit={updatePassword} className="space-y-4 border border-border bg-card p-6">
            <Field
              label="Nova palavra-passe"
              name="password"
              type="password"
              required
              minLength={8}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "A atualizar..." : "Atualizar palavra-passe"}
            </button>
          </form>
        ) : (
          <form onSubmit={requestReset} className="space-y-4 border border-border bg-card p-6">
            <Field label="Email empresarial" name="email" type="email" required />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "A enviar..." : "Enviar email de recuperação"}
            </button>
          </form>
        )}

        <Link
          to="/login"
          className="text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Voltar ao login
        </Link>
      </main>
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
