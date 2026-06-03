import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { useAuthGuard } from "@/hooks/use-auth-guard";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isChecking } = useAuthGuard("admin");

  if (isChecking) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
        A validar sessão...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
