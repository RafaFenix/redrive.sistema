import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BuyerOrder, formatEUR, listBuyerOrders } from "@/lib/market-data";
import { Trophy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/buyer/won")({
  head: () => ({ meta: [{ title: "Leilões ganhos — ReDrive" }] }),
  component: BuyerWon,
});

function BuyerWon() {
  const [orders, setOrders] = useState<BuyerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await listBuyerOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível carregar leilões ganhos.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrders();
  }, []);

  if (!isLoading && orders.length === 0) {
    return (
      <div className="grid min-h-[60vh] place-items-center p-8 text-center">
        <div>
          <Trophy className="mx-auto size-10 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-bold">Ainda sem leilões ganhos</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            As adjudicações aparecem aqui quando um leilão fecha com reserva atingida ou uma
            negociação é aceite.
          </p>
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
      <p className="mt-1 text-sm text-muted-foreground">
        Viaturas adjudicadas à sua empresa e estado de entrega.
      </p>

      <div className="mt-8 grid gap-4">
        {isLoading && (
          <div className="border border-border bg-card p-12 text-center text-muted-foreground">
            A carregar leilões ganhos...
          </div>
        )}
        {!isLoading &&
          orders.map((order) => {
            const auction = order.auction;
            const vehicle = order.vehicle ?? auction?.vehicle;
            if (!vehicle) return null;

            return (
              <div
                key={order.id}
                className="flex flex-wrap items-center gap-4 border border-border bg-card p-4"
              >
                <img src={vehicle.photos[0]} alt="" className="size-20 rounded-sm object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {auction?.lotNumber ?? "Adjudicação"}
                  </div>
                  <div className="text-lg font-bold">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </div>
                  <div className="text-xs text-muted-foreground">{vehicle.variant}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Valor adjudicado
                  </div>
                  <div className="text-xl font-extrabold">{formatEUR(order.amount)}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Entrega
                  </div>
                  <div className="text-sm font-bold">
                    {deliveryStatusLabels[order.deliveryStatus]}
                  </div>
                </div>
                <Link
                  to="/buyer/won/$id"
                  params={{ id: order.id }}
                  className="border border-foreground px-4 py-2 text-xs font-bold uppercase hover:bg-foreground hover:text-background"
                >
                  Ver timeline
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
}

const deliveryStatusLabels = {
  pending: "Pendente",
  awaiting_payment: "Aguarda pagamento",
  documentation: "Documentação",
  in_transit: "Em transporte",
  ready_for_pickup: "Pronto para recolha",
  delivered: "Entregue",
  cancelled: "Cancelado",
} as const;
