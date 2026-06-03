import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BuyerSidebar } from "@/components/layout/BuyerSidebar";
import { useAuthGuard } from "@/hooks/use-auth-guard";

export const Route = createFileRoute("/buyer")({
  component: BuyerLayout,
});

function BuyerLayout() {
  const { isChecking } = useAuthGuard("buyer");

  if (isChecking) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
        A validar sessão...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <BuyerSidebar />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
