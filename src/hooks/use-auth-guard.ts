import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getCurrentAccess, getDefaultAuthenticatedPath, type AppRole } from "@/lib/auth-client";
import { getSupabaseClient } from "@/lib/supabase/client";

export function useAuthGuard(requiredRole: AppRole) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseClient();

    async function checkAccess() {
      try {
        const access = await getCurrentAccess();
        if (!isMounted) return;

        if (!access.isAuthenticated) {
          await navigate({ to: "/login" });
          return;
        }

        if (access.profile?.status !== "approved") {
          await navigate({ to: "/pending-approval" });
          return;
        }

        if (!access.roles.includes(requiredRole)) {
          toast.error("Não tem permissões para aceder a esta área.");
          await navigate({ to: getDefaultAuthenticatedPath(access) });
          return;
        }

        setIsChecking(false);
      } catch (error) {
        console.error(error);
        if (!isMounted) return;
        toast.error("Não foi possível validar a sessão.");
        await navigate({ to: "/login" });
      }
    }

    void checkAccess();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void checkAccess();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, requiredRole]);

  return { isChecking };
}
