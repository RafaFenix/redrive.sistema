import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Gavel, Trophy, Handshake } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { SidebarUserCard } from "@/components/layout/SidebarUserCard";

const items = [
  { title: "Dashboard", url: "/buyer/dashboard", icon: LayoutDashboard },
  { title: "Os meus lances", url: "/buyer/bids", icon: Gavel },
  { title: "Leilões ganhos", url: "/buyer/won", icon: Trophy },
  { title: "Negociações", url: "/buyer/negotiations", icon: Handshake },
] as const;

export function BuyerSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <aside className="sticky top-0 flex h-screen w-60 flex-col border-r border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <Link to="/" className="text-lg font-extrabold tracking-tighter text-primary">
          REDRIVE<span className="text-foreground">.</span>
        </Link>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Área comprador
        </p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = path === item.url || path.startsWith(item.url + "/");
          return (
            <Link
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-2 border-t border-border p-3">
        <Link
          to="/auctions"
          className="block rounded-sm border border-foreground px-3 py-2 text-center text-xs font-bold uppercase tracking-wider hover:bg-foreground hover:text-background"
        >
          Ver leilões
        </Link>
        <SidebarUserCard roleLabel="Aprovado" />
        <div className="flex justify-end">
          <NotificationBell />
        </div>
      </div>
    </aside>
  );
}
