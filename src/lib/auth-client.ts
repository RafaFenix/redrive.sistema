import { getSupabaseClient } from "@/lib/supabase/client";

export type AppRole = "admin" | "buyer";
export type UserStatus = "pending" | "approved" | "rejected" | "suspended";

export type CurrentAccess = {
  isAuthenticated: boolean;
  profile: { status: UserStatus } | null;
  roles: AppRole[];
};

export type CurrentUserSummary = {
  id: string;
  email: string;
  status: UserStatus;
  companyName: string;
  contactName: string;
  roles: AppRole[];
};

export async function getCurrentAccess(): Promise<CurrentAccess> {
  const supabase = getSupabaseClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) throw sessionError;
  if (!session) return { isAuthenticated: false, profile: null, roles: [] };

  const [{ data: profile, error: profileError }, { data: roleRows, error: rolesError }] =
    await Promise.all([
      supabase.from("profiles").select("status").eq("id", session.user.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", session.user.id),
    ]);

  if (profileError) throw profileError;
  if (rolesError) throw rolesError;

  return {
    isAuthenticated: true,
    profile: profile as { status: UserStatus } | null,
    roles: (roleRows ?? []).map((row) => row.role as AppRole),
  };
}

export async function getCurrentUserSummary(): Promise<CurrentUserSummary | null> {
  const supabase = getSupabaseClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return null;

  const [{ data: profile, error: profileError }, { data: roleRows, error: rolesError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("status,company_name,contact_name")
        .eq("id", user.id)
        .maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", user.id),
    ]);

  if (profileError) throw profileError;
  if (rolesError) throw rolesError;

  return {
    id: user.id,
    email: user.email ?? "",
    status: (profile?.status as UserStatus | undefined) ?? "pending",
    companyName: (profile?.company_name as string | undefined) || "",
    contactName: (profile?.contact_name as string | undefined) || "",
    roles: (roleRows ?? []).map((row) => row.role as AppRole),
  };
}

export async function signOut() {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function getDefaultAuthenticatedPath(access: CurrentAccess) {
  if (!access.isAuthenticated) return "/login";
  if (access.profile?.status !== "approved") return "/pending-approval";
  if (access.roles.includes("admin")) return "/admin/dashboard";
  return "/buyer/dashboard";
}
