import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export type RealtimeStatus = "connecting" | "connected" | "error" | "closed";

export interface RealtimeStatusInfo {
  status: RealtimeStatus;
  lastEventAt: string | null;
  lastError: string | null;
}

/**
 * Subscribes to a broad bids+auctions channel and exposes the connection state
 * plus the timestamp of the last received realtime event. Useful for an
 * operations dashboard that needs to confirm the realtime engine is alive.
 */
export function useRealtimeStatus(channelName = "system:health"): RealtimeStatusInfo {
  const [status, setStatus] = useState<RealtimeStatus>("connecting");
  const [lastEventAt, setLastEventAt] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bids" },
        () => setLastEventAt(new Date().toISOString()),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "auctions" },
        () => setLastEventAt(new Date().toISOString()),
      )
      .subscribe((state, err) => {
        if (state === "SUBSCRIBED") {
          setStatus("connected");
          setLastError(null);
        } else if (state === "CHANNEL_ERROR" || state === "TIMED_OUT") {
          setStatus("error");
          setLastError(err?.message ?? state);
        } else if (state === "CLOSED") {
          setStatus("closed");
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [channelName]);

  return { status, lastEventAt, lastError };
}
