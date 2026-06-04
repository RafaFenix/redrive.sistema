import { createFileRoute } from "@tanstack/react-router";
import { CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import {
  listAllNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  resolveNotificationHref,
  type AppNotification,
} from "@/lib/market-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/buyer/notifications")({
  head: () => ({ meta: [{ title: "Notificações — Buyer" }] }),
  component: BuyerNotifications,
});

function BuyerNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadNotifications();
  }, []);

  async function loadNotifications() {
    setIsLoading(true);

    try {
      const data = await listAllNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar notificações.");
    } finally {
      setIsLoading(false);
    }
  }

  async function openNotification(notification: AppNotification) {
    try {
      if (!notification.readAt) {
        await markNotificationRead(notification.id);
      }

      const href = resolveNotificationHref(notification);
      if (href) window.location.href = href;
      else await loadNotifications();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível abrir a notificação.");
    }
  }

  async function markAllRead() {
    try {
      await markAllNotificationsRead();
      await loadNotifications();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível marcar todas como lidas.");
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Comprador
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Notificações</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Histórico completo de alertas da sua conta.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void markAllRead()}
          className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-muted"
        >
          <CheckCheck className="size-4" />
          Marcar todas como lidas
        </button>
      </div>

      <div className="border border-border bg-card">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">A carregar notificações...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">Sem notificações por agora.</div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => void openNotification(notification)}
                className={cn(
                  "block w-full p-5 text-left hover:bg-muted/50",
                  !notification.readAt && "bg-primary/5",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold">{notification.title}</p>
                    {notification.body && (
                      <p className="mt-1 text-sm text-muted-foreground">{notification.body}</p>
                    )}
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {notification.type} ·{" "}
                      {new Date(notification.createdAt).toLocaleString("pt-PT")}
                    </p>
                  </div>
                  {!notification.readAt && (
                    <span className="mt-1 rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-primary-foreground">
                      Nova
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
