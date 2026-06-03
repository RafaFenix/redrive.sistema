import { useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

export function useAuctionRealtime(auctionId: string, onChange: () => void | Promise<void>) {
  useEffect(() => {
    const supabase = getSupabaseClient();
    const channel = supabase
      .channel(`auction:${auctionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "auctions",
          filter: `id=eq.${auctionId}`,
        },
        () => {
          void onChange();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bids",
          filter: `auction_id=eq.${auctionId}`,
        },
        () => {
          void onChange();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [auctionId, onChange]);
}
