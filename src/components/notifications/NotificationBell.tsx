import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import {
  AppNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/market-data";
import { getSupabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.readAt).length,
    [notifications],
  );

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseClient();

    async function boot() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || !isMounted) {
          setIsLoading(false);
          return;
        }

        await loadNotifications();

        const channel = supabase
          .channel(`notifications:${user.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                const title =
                  typeof payload.new.title === "string" ? payload.new.title : "Nova notificação";
                toast(title);
              }
              void loadNotifications();
            },
          )
          .subscribe();

        return () => {
          void supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    }

    let cleanup: (() => void) | undefined;
    void boot().then((callback) => {
      cleanup = callback;
    });

    return () => {
      isMounted = false;
      cleanup?.();
    };
  }, []);

  async function loadNotifications() {
    try {
      const data = await listNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function markRead(notification: AppNotification) {
    if (notification.readAt) return;

    try {
      await markNotificationRead(notification.id);
      await loadNotifications();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível marcar a notificação como lida.");
    }
  }

  async function markAllRead() {
    try {
      await markAllNotificationsRead();
      await loadNotifications();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível marcar notificações como lidas.");
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative grid size-9 place-items-center rounded-sm border border-border bg-background hover:bg-muted"
        aria-label="Notificações"
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-primary px-1 font-mono text-[9px] font-bold text-primary-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 border border-border bg-card shadow-[4px_4px_0px_0px_var(--color-foreground)]">
          <div className="flex items-center justify-between border-b border-border p-3">
            <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Notificações
            </h3>
            <button
              type="button"
              onClick={() => void markAllRead()}
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="size-3" />
              Ler tudo
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="p-6 text-center text-xs text-muted-foreground">A carregar...</div>
            )}

            {!isLoading &&
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => void markRead(notification)}
                  className={cn(
                    "block w-full border-b border-border p-3 text-left last:border-0 hover:bg-muted/50",
                    !notification.readAt && "bg-primary/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold">{notification.title}</p>
                      {notification.body && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {notification.body}
                        </p>
                      )}
                    </div>
                    {!notification.readAt && (
                      <span className="mt-1 size-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString("pt-PT")}
                  </p>
                </button>
              ))}

            {!isLoading && notifications.length === 0 && (
              <div className="p-6 text-center text-xs text-muted-foreground">
                Sem notificações por agora.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
