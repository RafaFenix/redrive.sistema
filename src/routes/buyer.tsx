import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BuyerSidebar } from "@/components/layout/BuyerSidebar";

export const Route = createFileRoute("/buyer")({
  component: BuyerLayout,
});

function BuyerLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <BuyerSidebar />
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
