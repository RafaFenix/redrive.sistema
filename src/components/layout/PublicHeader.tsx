import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (p: string) => path === p || (p !== "/" && path.startsWith(p));

  return (
    <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-xl font-extrabold tracking-tighter text-primary">
          REDRIVE<span className="text-foreground">.</span>
        </Link>
        <div className="hidden gap-6 text-sm font-medium md:flex">
          <Link
            to="/auctions"
            className={cn(
              "transition-colors",
              isActive("/auctions")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Leilões
          </Link>
          <Link
            to="/how-it-works"
            className={cn(
              "transition-colors",
              isActive("/how-it-works")
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Como funciona
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden rounded-full bg-success/10 px-2 py-0.5 font-mono text-[10px] font-medium text-success ring-1 ring-success/20 md:inline">
          LEILÕES LIVE
        </span>
        <Link to="/login" className="text-sm font-semibold hover:text-primary">
          Entrar
        </Link>
        <Link
          to="/register"
          className="rounded-sm bg-foreground px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-background transition-colors hover:bg-foreground/90"
        >
          Registar empresa
        </Link>
      </div>
    </nav>
  );
}
