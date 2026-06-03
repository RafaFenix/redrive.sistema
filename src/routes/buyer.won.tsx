import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BuyerBid, formatEUR, listBuyerWonAuctions } from "@/lib/market-data";
import { Trophy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/buyer/won")({
  head: () => ({ meta: [{ title: "Leilões ganhos — ReDrive" }] }),
  component: BuyerWon,
});

function BuyerWon() {
  const [won, setWon] = useState<{ bid: BuyerBid; auction: NonNullable<BuyerBid["auction"]> }[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadWonAuctions() {
      try {
        const data = await listBuyerWonAuctions();
        setWon(data);
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível carregar leilões ganhos.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadWonAuctions();
  }, []);

  if (!isLoading && won.length === 0) {
    return (
      <div className="grid min-h-[60vh] place-items-center p-8 text-center">
        <div>
          <Trophy className="mx-auto size-10 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-bold">Ainda sem leilões ganhos</h2>
          <Link
            to="/auctions"
            className="mt-4 inline-block border-2 border-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background"
          >
            Ver leilões ativos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Leilões ganhos</h1>
      <p className="mt-1 text-sm text-muted-foreground">Viaturas adjudicadas à sua empresa.</p>

      <div className="mt-8 grid gap-4">
        {isLoading && (
          <div className="border border-border bg-card p-12 text-center text-muted-foreground">
            A carregar leilões ganhos...
          </div>
        )}
        {!isLoading &&
          won.map(({ bid, auction: a }) => {
            const v = a.vehicle;
            if (!v) return null;
            return (
              <div
                key={a.id}
                className="flex flex-wrap items-center gap-4 border border-border bg-card p-4"
              >
                <img src={v.photos[0]} alt="" className="size-20 rounded-sm object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {a.lotNumber}
                  </div>
                  <div className="text-lg font-bold">
                    {v.year} {v.make} {v.model}
                  </div>
                  <div className="text-xs text-muted-foreground">{v.variant}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Valor adjudicado
                  </div>
                  <div className="text-xl font-extrabold">{formatEUR(bid.amount)}</div>
                </div>
                <Link
                  to="/auctions/$id"
                  params={{ id: a.id }}
                  className="border border-foreground px-4 py-2 text-xs font-bold uppercase hover:bg-foreground hover:text-background"
                >
                  Ver detalhe
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
}
