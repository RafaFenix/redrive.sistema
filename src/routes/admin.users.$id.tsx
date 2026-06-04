import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  formatEUR,
  getAdminUserDetail,
  getTradeRegistrySignedUrl,
  type AdminUserDetail,
} from "@/lib/market-data";
import { getSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users/$id")({
  head: () => ({ meta: [{ title: "Ficha de utilizador — Admin" }] }),
  component: AdminUserDetailPage,
});

function AdminUserDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AdminUserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await getAdminUserDetail(id);
      setProfile(data);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar a ficha do utilizador.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  async function runUserAction(action: "approve" | "reject" | "suspend") {
    if (!profile) return;

    const reason =
      action === "reject" || action === "suspend"
        ? window.prompt(
            action === "reject"
              ? "Motivo da rejeição (opcional):"
              : "Motivo da suspensão (opcional):",
          )
        : null;

    if (reason === null && action !== "approve") return;

    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();
      const { error } =
        action === "approve"
          ? await supabase.rpc("approve_user", { target_user_id: profile.id })
          : action === "reject"
            ? await supabase.rpc("reject_user", { target_user_id: profile.id, reason })
            : await supabase.rpc("suspend_user", { target_user_id: profile.id, reason });

      if (error) throw error;

      toast.success("Utilizador atualizado.");
      await loadProfile();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar o utilizador.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function openTradeRegistry() {
    if (!profile?.tradeRegistryPath) return;

    try {
      const url = await getTradeRegistrySignedUrl(profile.tradeRegistryPath);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível abrir a certidão comercial.");
    }
  }

  if (isLoading) {
    return <div className="p-8 text-sm text-muted-foreground">A carregar utilizador...</div>;
  }

  if (!profile) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-extrabold tracking-tight">Utilizador não encontrado</h1>
        <Link
          to="/admin/users"
          className="mt-4 inline-block text-sm font-semibold underline-offset-4 hover:underline"
        >
          Voltar aos utilizadores
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Ficha de utilizador
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">
            {profile.companyName || "Empresa sem nome"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.contactName || "Sem responsável"} · {profile.status}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void navigate({ to: "/admin/users" })}
            className="border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-muted"
          >
            Voltar
          </button>
          {profile.status === "pending" && (
            <>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void runUserAction("approve")}
                className="bg-success px-4 py-2 text-xs font-bold uppercase tracking-widest text-success-foreground hover:bg-success/90 disabled:opacity-60"
              >
                Aprovar
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void runUserAction("reject")}
                className="border border-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
              >
                Rejeitar
              </button>
            </>
          )}
          {profile.status === "approved" && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => void runUserAction("suspend")}
              className="border border-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
            >
              Suspender
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="space-y-4 lg:col-span-5">
          <Panel title="Empresa">
            <Fact label="Estado" value={profile.status} />
            <Fact label="Roles" value={profile.roles.join(", ") || "—"} />
            <Fact label="NIF/NIPC" value={profile.vatNumber || "—"} />
            <Fact label="Morada" value={profile.address || "—"} />
            <Fact label="Cidade" value={profile.city || "—"} />
            <Fact label="País" value={profile.country || "—"} />
            <Fact label="Registo" value={new Date(profile.createdAt).toLocaleString("pt-PT")} />
            <Fact
              label="Aprovado em"
              value={
                profile.approvedAt ? new Date(profile.approvedAt).toLocaleString("pt-PT") : "—"
              }
            />
          </Panel>

          <Panel title="Contacto">
            <Fact label="Responsável" value={profile.contactName || "—"} />
            <Fact label="Telefone" value={profile.contactPhone || "—"} />
          </Panel>

          <Panel title="Documentação">
            {profile.tradeRegistryPath ? (
              <button
                type="button"
                onClick={() => void openTradeRegistry()}
                className="border border-foreground px-3 py-2 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background"
              >
                Abrir certidão comercial
              </button>
            ) : (
              <p className="text-sm text-muted-foreground">Sem documento submetido.</p>
            )}
          </Panel>
        </section>

        <section className="space-y-4 lg:col-span-7">
          <Panel title="Últimos lances">
            {profile.bids.length ? (
              <div className="divide-y divide-border">
                {profile.bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="flex items-center justify-between gap-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {bid.auction?.lotNumber ?? "Leilão"} · {bid.status}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(bid.createdAt).toLocaleString("pt-PT")}
                      </p>
                    </div>
                    <span className="font-mono font-bold">{formatEUR(bid.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sem lances registados.</p>
            )}
          </Panel>

          <Panel title="Compras / adjudicações">
            {profile.orders.length ? (
              <div className="divide-y divide-border">
                {profile.orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between gap-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {order.vehicle
                          ? `${order.vehicle.year} ${order.vehicle.make} ${order.vehicle.model}`
                          : (order.auction?.lotNumber ?? "Encomenda")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.status} · {order.deliveryStatus}
                      </p>
                    </div>
                    <span className="font-mono font-bold">{formatEUR(order.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Sem adjudicações registadas.</p>
            )}
          </Panel>
        </section>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-card p-5">
      <h2 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[60%] text-right font-medium">{value}</span>
    </div>
  );
}
