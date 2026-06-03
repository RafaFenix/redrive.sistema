import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, PackageCheck, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { BuyerOrder, DeliveryStatus, formatEUR, getBuyerOrder } from "@/lib/market-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/buyer/won/$id")({
  head: () => ({ meta: [{ title: "Detalhe da adjudicação — ReDrive" }] }),
  component: BuyerWonDetail,
});

function BuyerWonDetail() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<BuyerOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await getBuyerOrder(id);
        setOrder(data);
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível carregar a adjudicação.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center p-8 text-muted-foreground">
        A carregar adjudicação...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="grid min-h-[60vh] place-items-center p-8 text-center">
        <div>
          <XCircle className="mx-auto size-10 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-bold">Adjudicação não encontrada</h2>
          <Link
            to="/buyer/won"
            className="mt-4 inline-block border border-foreground px-4 py-2 text-xs font-bold uppercase hover:bg-foreground hover:text-background"
          >
            Voltar aos ganhos
          </Link>
        </div>
      </div>
    );
  }

  const auction = order.auction;
  const vehicle = order.vehicle ?? auction?.vehicle;

  return (
    <div className="p-8">
      <Link to="/buyer/won" className="text-xs font-bold uppercase tracking-widest text-primary">
        ← Leilões ganhos
      </Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="border border-border bg-card">
          <div className="border-b border-border p-5">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {auction?.lotNumber ?? "Adjudicação"}
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
              {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : "Viatura adjudicada"}
            </h1>
            {vehicle?.variant && (
              <p className="mt-1 text-sm text-muted-foreground">{vehicle.variant}</p>
            )}
          </div>

          {vehicle && (
            <div className="grid gap-5 p-5 md:grid-cols-[220px_1fr]">
              <img
                src={vehicle.photos[0]}
                alt=""
                className="h-40 w-full rounded-sm object-cover md:h-full"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Fact label="Valor adjudicado" value={formatEUR(order.amount)} />
                <Fact label="Estado da encomenda" value={orderStatusLabels[order.status]} />
                <Fact label="Entrega" value={deliveryStatusLabels[order.deliveryStatus]} />
                <Fact label="Data" value={new Date(order.createdAt).toLocaleString("pt-PT")} />
                <Fact
                  label="Quilometragem"
                  value={`${vehicle.mileage.toLocaleString("pt-PT")} km`}
                />
                <Fact label="Combustível" value={vehicle.fuelType} />
              </div>
            </div>
          )}

          {order.deliveryNotes && (
            <div className="border-t border-border p-5">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Notas de entrega
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{order.deliveryNotes}</p>
            </div>
          )}
        </section>

        <aside className="border border-border bg-card p-5">
          <div className="mb-5 flex items-center gap-2">
            <PackageCheck className="size-5 text-primary" />
            <h2 className="text-lg font-extrabold">Timeline de entrega</h2>
          </div>
          <div className="space-y-4">
            {timelineSteps.map((step) => {
              const state = getTimelineState(order.deliveryStatus, step.status);
              const Icon = state === "done" ? CheckCircle2 : Circle;

              return (
                <div key={step.status} className="flex gap-3">
                  <Icon
                    className={cn(
                      "mt-0.5 size-5 shrink-0",
                      state === "done" && "text-success",
                      state === "current" && "fill-primary text-primary",
                      state === "pending" && "text-muted-foreground",
                    )}
                  />
                  <div>
                    <p
                      className={cn(
                        "text-sm font-bold",
                        state === "pending" && "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border bg-background p-3">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-bold">{value}</div>
    </div>
  );
}

function getTimelineState(current: DeliveryStatus, step: DeliveryStatus) {
  if (current === "cancelled") return step === "cancelled" ? "current" : "pending";

  const currentIndex = timelineSteps.findIndex((item) => item.status === current);
  const stepIndex = timelineSteps.findIndex((item) => item.status === step);

  if (step === "cancelled") return "pending";
  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) return "current";
  return "pending";
}

const orderStatusLabels = {
  pending_payment: "Aguarda pagamento",
  paid: "Pago",
  cancelled: "Cancelado",
  completed: "Concluído",
} as const;

const deliveryStatusLabels = {
  pending: "Pendente",
  awaiting_payment: "Aguarda pagamento",
  documentation: "Documentação",
  in_transit: "Em transporte",
  ready_for_pickup: "Pronto para recolha",
  delivered: "Entregue",
  cancelled: "Cancelado",
} as const;

const timelineSteps: { status: DeliveryStatus; label: string; description: string }[] = [
  {
    status: "pending",
    label: "Adjudicação criada",
    description: "A ReDrive confirmou a adjudicação da viatura.",
  },
  {
    status: "awaiting_payment",
    label: "Aguarda pagamento",
    description: "A equipa confirma os dados finais para pagamento.",
  },
  {
    status: "documentation",
    label: "Documentação",
    description: "Documentos e formalidades de entrega em preparação.",
  },
  {
    status: "in_transit",
    label: "Em transporte",
    description: "A viatura está em trânsito para entrega/recolha.",
  },
  {
    status: "ready_for_pickup",
    label: "Pronto para recolha",
    description: "A viatura está pronta para entrega ou recolha.",
  },
  {
    status: "delivered",
    label: "Entregue",
    description: "Entrega concluída.",
  },
  {
    status: "cancelled",
    label: "Cancelado",
    description: "A entrega foi cancelada.",
  },
];
