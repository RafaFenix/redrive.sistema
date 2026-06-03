import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { toast } from "sonner";
import { useState } from "react";
import { getCurrentAccess, getDefaultAuthenticatedPath } from "@/lib/auth-client";
import { getSupabaseClient } from "@/lib/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — ReDrive" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const access = await getCurrentAccess();
      toast.success("Sessão iniciada.");
      await navigate({ to: getDefaultAuthenticatedPath(access) });
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível iniciar sessão.", {
        description: "Confirme o email e a palavra-passe.",
      });
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
            Acesso restrito · B2B
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Entrar</h1>
        </div>
        <form onSubmit={submit} className="space-y-4 border border-border bg-card p-6">
          <Field label="Email empresarial" name="email" type="email" required />
          <Field label="Palavra-passe" name="password" type="password" required />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "A entrar..." : "Entrar"}
          </button>
          <div className="flex justify-between pt-2 text-xs">
            <Link to="/register" className="text-muted-foreground hover:text-foreground">
              Não tem conta? Registar →
            </Link>
            <Link to="/reset-password" className="text-muted-foreground hover:text-foreground">
              Recuperar palavra-passe
            </Link>
          </div>
        </form>
      </main>
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
