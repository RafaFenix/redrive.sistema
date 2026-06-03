import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { getCurrentUserSummary, signOut, type CurrentUserSummary } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function SidebarUserCard({
  roleLabel,
  avatarClassName,
}: {
  roleLabel: string;
  avatarClassName?: string;
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUserSummary | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const data = await getCurrentUserSummary();
        if (isMounted) setUser(data);
      } catch (error) {
        console.error(error);
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayName = user?.companyName || user?.contactName || user?.email || "Utilizador";
  const initials = useMemo(() => getInitials(displayName), [displayName]);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
      await navigate({ to: "/login" });
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível terminar sessão.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-sm bg-muted p-2">
      <div
        className={cn(
          "grid size-8 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground",
          avatarClassName,
        )}
      >
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold">{displayName}</p>
        <p className="font-mono text-[10px] uppercase text-muted-foreground">{roleLabel}</p>
      </div>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        disabled={isSigningOut}
        className="text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Terminar sessão"
      >
        <LogOut className="size-3.5" />
      </button>
    </div>
  );
}

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean).slice(0, 2);

  if (!parts.length) return "U";
  return parts.map((part) => part[0]?.toUpperCase()).join("");
}
