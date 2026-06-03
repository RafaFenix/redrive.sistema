import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { getCurrentAccess, getDefaultAuthenticatedPath } from "@/lib/auth-client";
import { getSupabaseClient } from "@/lib/supabase/client";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/setup-admin")({
  head: () => ({ meta: [{ title: "Configurar admin — ReDrive" }] }),
  component: SetupAdminPage,
});

function SetupAdminPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const supabase = getSupabaseClient();
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;
        setEmail(session?.user.email ?? null);
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível verificar a sessão.");
      } finally {
        setIsChecking(false);
      }
    }

    void checkSession();
  }, []);

  async function claimFirstAdmin() {
    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.rpc("claim_first_admin");
      if (error) throw error;

      const access = await getCurrentAccess();
      toast.success("Primeiro administrador configurado.");
      await navigate({ to: getDefaultAuthenticatedPath(access) });
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível configurar o primeiro admin.", {
        description: "Confirme que ainda não existe outro administrador.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto grid max-w-lg place-items-center px-6 py-24 text-center">
        <div className="grid size-16 place-items-center rounded-full border-2 border-foreground">
          <ShieldCheck className="size-8" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Configurar primeiro admin</h1>
        <p className="mt-3 max-w-prose text-sm text-muted-foreground">
          Use esta página apenas no arranque do projeto. O banco só permite esta ação se ainda não
          existir nenhum administrador.
        </p>

        <div className="mt-8 w-full border border-border bg-card p-6 text-left">
          {isChecking ? (
            <p className="text-center text-sm text-muted-foreground">A verificar sessão...</p>
          ) : email ? (
            <>
              <p className="text-sm text-muted-foreground">
                Sessão ativa como <span className="font-medium text-foreground">{email}</span>.
              </p>
              <button
                type="button"
                onClick={() => void claimFirstAdmin()}
                disabled={isSubmitting}
                className="mt-5 w-full bg-primary py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "A configurar..." : "Tornar esta conta admin"}
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Inicie sessão com a conta que deve ficar como primeiro administrador.
              </p>
              <Link
                to="/login"
                className="mt-5 block w-full bg-primary py-3 text-center text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
              >
                Entrar
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
