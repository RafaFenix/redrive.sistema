import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { isAuctionWatched, toggleAuctionWatchlist } from "@/lib/market-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function WatchlistButton({ auctionId }: { auctionId: string }) {
  const [isWatched, setIsWatched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadState() {
      try {
        const watched = await isAuctionWatched(auctionId);
        if (isMounted) setIsWatched(watched);
      } catch {
        if (isMounted) setIsWatched(false);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadState();

    return () => {
      isMounted = false;
    };
  }, [auctionId]);

  async function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    setIsLoading(true);
    try {
      const watched = await toggleAuctionWatchlist(auctionId);
      setIsWatched(watched);
      toast.success(watched ? "Adicionado à watchlist." : "Removido da watchlist.");
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar a watchlist.", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={(event) => void toggle(event)}
      disabled={isLoading}
      className={cn(
        "grid size-8 place-items-center rounded-sm border border-border bg-background/90 backdrop-blur transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60",
        isWatched && "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
      )}
      aria-label={isWatched ? "Remover da watchlist" : "Adicionar à watchlist"}
    >
      <Star className={cn("size-4", isWatched && "fill-current")} />
    </button>
  );
}
