import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { getCurrentAccess, getDefaultAuthenticatedPath } from "@/lib/auth-client";
import { getSupabaseClient } from "@/lib/supabase/client";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const ADMIN_EMAIL = "plusroimkd@gmail.com";

export const Route = createFileRoute("/setup-admin")({
  head: () => ({ meta: [{ title: "Configurar admin — ReDrive" }] }),
  component: SetupAdminPage,
});

function SetupAdminPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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

  async function createAdminAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsCreating(true);

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") ?? "");

    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/setup-admin`,
          data: {
            company_name: "ReDrive Admin",
            vat_number: "ADMIN",
            contact_name: "Administrador",
            contact_phone: "",
            city: "",
            country: "PT",
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        await claimFirstAdmin();
        return;
      }

      toast.success("Conta admin criada.", {
        description:
          "Confirme o email se o Supabase pedir confirmação e depois volte a /setup-admin.",
      });
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível criar a conta admin.", {
        description: "Se a conta já existir, entre com este email e volte a /setup-admin.",
      });
    } finally {
      setIsCreating(false);
    }
  }

  async function claimFirstAdmin() {
    if (email && email.toLowerCase() !== ADMIN_EMAIL) {
      toast.error("Esta sessão não pode configurar o admin.", {
        description: `Entre com ${ADMIN_EMAIL}.`,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.rpc("claim_first_admin");
      if (error) throw error;

      const access = await getCurrentAccess();
      toast.success("Administrador configurado.");
      await navigate({ to: getDefaultAuthenticatedPath(access) });
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível configurar o admin.", {
        description:
          "Confirme que entrou com o email autorizado e que ainda não existe outro admin.",
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
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Configurar administrador</h1>
        <p className="mt-3 max-w-prose text-sm text-muted-foreground">
          Esta página cria ou ativa a conta de backoffice do sistema. Não é cadastro de empresa.
          Apenas <span className="font-medium text-foreground">{ADMIN_EMAIL}</span> pode concluir
          esta configuração.
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
                disabled={isSubmitting || email.toLowerCase() !== ADMIN_EMAIL}
                className="mt-5 w-full bg-primary py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "A configurar..." : "Ativar acesso ao backoffice"}
              </button>
              {email.toLowerCase() !== ADMIN_EMAIL && (
                <p className="mt-3 text-xs text-destructive">
                  Termine sessão e entre com {ADMIN_EMAIL} para configurar o administrador.
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Defina uma palavra-passe para criar a conta administradora do backoffice.
              </p>
              <form onSubmit={createAdminAccount} className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Email admin
                  </span>
                  <input
                    type="email"
                    value={ADMIN_EMAIL}
                    readOnly
                    className="w-full border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Palavra-passe
                  </span>
                  <input
                    name="password"
                    type="password"
                    minLength={8}
                    required
                    className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-primary py-3 text-sm font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreating ? "A criar..." : "Criar conta admin"}
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Já criou a conta?{" "}
                <Link to="/login" className="underline">
                  Entrar
                </Link>{" "}
                e voltar a esta página.
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
