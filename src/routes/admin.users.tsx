import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { toast } from "sonner";

type UserStatus = "pending" | "approved" | "rejected" | "suspended";
type AppRole = "admin" | "buyer";

type ProfileRow = {
  id: string;
  status: UserStatus;
  company_name: string;
  vat_number: string;
  contact_name: string;
  contact_phone: string;
  city: string | null;
  country: string;
  trade_registry_path: string | null;
  rejected_reason: string | null;
  suspended_reason: string | null;
  approved_at: string | null;
  created_at: string;
};

type RoleRow = {
  user_id: string;
  role: AppRole;
};

type AdminProfile = ProfileRow & {
  roles: AppRole[];
};

const TABS: { value: UserStatus; label: string }[] = [
  { value: "pending", label: "Pendentes" },
  { value: "approved", label: "Aprovados" },
  { value: "rejected", label: "Rejeitados" },
  { value: "suspended", label: "Suspensos" },
];

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Utilizadores — Admin" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  const [tab, setTab] = useState<UserStatus>("pending");
  const [users, setUsers] = useState<AdminProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      users.filter(
        (profile) =>
          profile.roles.includes("buyer") &&
          !profile.roles.includes("admin") &&
          profile.status === tab,
      ),
    [tab, users],
  );

  useEffect(() => {
    void loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();
      const [{ data: profiles, error: profilesError }, { data: roles, error: rolesError }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select(
              "id,status,company_name,vat_number,contact_name,contact_phone,city,country,trade_registry_path,rejected_reason,suspended_reason,approved_at,created_at",
            )
            .order("created_at", { ascending: false }),
          supabase.from("user_roles").select("user_id,role"),
        ]);

      if (profilesError) throw profilesError;
      if (rolesError) throw rolesError;

      const rolesByUser = ((roles ?? []) as RoleRow[]).reduce<Record<string, AppRole[]>>(
        (acc, row) => {
          acc[row.user_id] = [...(acc[row.user_id] ?? []), row.role];
          return acc;
        },
        {},
      );

      setUsers(
        ((profiles ?? []) as ProfileRow[]).map((profile) => ({
          ...profile,
          roles: rolesByUser[profile.id] ?? [],
        })),
      );
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar utilizadores.");
    } finally {
      setIsLoading(false);
    }
  }

  async function runUserAction(profile: AdminProfile, action: "approve" | "reject" | "suspend") {
    const reason =
      action === "reject" || action === "suspend"
        ? window.prompt(
            action === "reject"
              ? "Motivo da rejeição (opcional):"
              : "Motivo da suspensão (opcional):",
          )
        : null;

    if (reason === null && action !== "approve") return;

    setActionUserId(profile.id);

    try {
      const supabase = getSupabaseClient();
      const { error } =
        action === "approve"
          ? await supabase.rpc("approve_user", { target_user_id: profile.id })
          : action === "reject"
            ? await supabase.rpc("reject_user", { target_user_id: profile.id, reason })
            : await supabase.rpc("suspend_user", { target_user_id: profile.id, reason });

      if (error) throw error;

      const actionLabels = {
        approve: "aprovado",
        reject: "rejeitado",
        suspend: "suspenso",
      };

      toast.success(`${profile.company_name || "Utilizador"} ${actionLabels[action]}.`);
      await loadUsers();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar o utilizador.");
    } finally {
      setActionUserId(null);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Utilizadores</h1>

      <div className="mt-6 flex gap-1 border-b border-border">
        {TABS.map((t) => {
          const count = users.filter(
            (profile) =>
              profile.roles.includes("buyer") &&
              !profile.roles.includes("admin") &&
              profile.status === t.value,
          ).length;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`relative px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${
                tab === t.value ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}{" "}
              <span className="ml-1 font-mono text-xs text-muted-foreground">({count})</span>
              {tab === t.value && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">NIF</th>
              <th className="px-4 py-3">Responsável</th>
              <th className="px-4 py-3">Cidade</th>
              <th className="px-4 py-3">Submetido</th>
              <th className="px-4 py-3">Doc.</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-muted-foreground">
                  A carregar utilizadores...
                </td>
              </tr>
            )}
            {!isLoading &&
              filtered.map((profile) => (
                <tr
                  key={profile.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 font-medium">{profile.company_name || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{profile.vat_number || "—"}</td>
                  <td className="px-4 py-3 text-sm">
                    {profile.contact_name || "—"}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {profile.contact_phone || "Sem telefone"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{profile.city || "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {new Date(profile.created_at).toLocaleDateString("pt-PT")}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {profile.trade_registry_path ? "Sim" : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {tab === "pending" && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => void runUserAction(profile, "approve")}
                          disabled={actionUserId === profile.id}
                          className="bg-success px-3 py-1.5 text-[10px] font-bold uppercase text-success-foreground hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => void runUserAction(profile, "reject")}
                          disabled={actionUserId === profile.id}
                          className="border border-primary px-3 py-1.5 text-[10px] font-bold uppercase text-primary hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Rejeitar
                        </button>
                      </div>
                    )}
                    {tab === "approved" && (
                      <button
                        onClick={() => void runUserAction(profile, "suspend")}
                        disabled={actionUserId === profile.id}
                        className="border border-border px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Suspender
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center text-muted-foreground">
                  Sem registos nesta categoria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
