import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  acceptNegotiationOffer,
  euroToCents,
  formatEUR,
  listBuyerNegotiations,
  Negotiation,
  submitNegotiationRound,
} from "@/lib/market-data";
import { toast } from "sonner";

export const Route = createFileRoute("/buyer/negotiations")({
  head: () => ({ meta: [{ title: "Negociações — ReDrive" }] }),
  component: BuyerNegotiations,
});

function BuyerNegotiations() {
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [counterValues, setCounterValues] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [actionId, setActionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadNegotiations();
  }, []);

  async function loadNegotiations() {
    try {
      const data = await listBuyerNegotiations();
      setNegotiations(data);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar negociações.");
    } finally {
      setIsLoading(false);
    }
  }

  async function submitCounter(negotiation: Negotiation) {
    const amount = euroToCents(counterValues[negotiation.id] ?? "");
    if (!amount) {
      toast.error("Introduza uma contraoferta válida.");
      return;
    }

    setActionId(negotiation.id);
    try {
      await submitNegotiationRound({
        negotiationId: negotiation.id,
        amount,
        message: messages[negotiation.id],
      });
      toast.success("Contraoferta submetida.");
      setCounterValues((current) => ({ ...current, [negotiation.id]: "" }));
      setMessages((current) => ({ ...current, [negotiation.id]: "" }));
      await loadNegotiations();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível submeter a contraoferta.", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setActionId(null);
    }
  }

  async function acceptOffer(negotiation: Negotiation) {
    setActionId(negotiation.id);
    try {
      await acceptNegotiationOffer(negotiation.id);
      toast.success("Proposta aceite. A encomenda foi criada.");
      await loadNegotiations();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível aceitar a proposta.", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setActionId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center p-8 text-muted-foreground">
        A carregar negociações...
      </div>
    );
  }

  if (negotiations.length === 0) {
    return (
      <div className="grid min-h-[60vh] place-items-center p-8 text-muted-foreground">
        Sem negociações abertas.
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Negociações</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Quando o preço de reserva não é atingido, a ReDrive abre uma negociação privada de até 5
        rondas.
      </p>

      <div className="mt-8 space-y-8">
        {negotiations.map((negotiation) => {
          const auction = negotiation.auction;
          const vehicle = auction?.vehicle;
          if (!auction || !vehicle) return null;

          const lastRound = negotiation.rounds.at(-1);
          const yourTurn = negotiation.status === "open" && lastRound?.initiatedBy === "admin";
          const isBusy = actionId === negotiation.id;

          return (
            <div key={negotiation.id} className="border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <img src={vehicle.photos[0]} alt="" className="size-12 rounded-sm object-cover" />
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      {auction.lotNumber}
                    </div>
                    <div className="font-bold">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-mono text-muted-foreground">
                    Ronda {negotiation.rounds.length} / {negotiation.maxRounds}
                  </span>
                  <StatusBadge status={negotiation.status} yourTurn={yourTurn} />
                </div>
              </div>

              <div className="space-y-3 p-4">
                {negotiation.rounds.map((round) => (
                  <div
                    key={round.id}
                    className={`flex gap-3 ${round.initiatedBy === "buyer" ? "justify-end" : ""}`}
                  >
                    <div
                      className={`max-w-md border p-3 ${
                        round.initiatedBy === "admin"
                          ? "border-foreground bg-background"
                          : "border-primary/30 bg-primary/5"
                      }`}
                    >
                      <div className="mb-1 flex items-baseline gap-2 font-mono text-[10px] uppercase text-muted-foreground">
                        <span className="font-bold">
                          {round.initiatedBy === "admin" ? "ReDrive" : "Você"}
                        </span>
                        <span>·</span>
                        <span>{new Date(round.createdAt).toLocaleString("pt-PT")}</span>
                      </div>
                      <div className="text-xl font-extrabold">{formatEUR(round.amount)}</div>
                      {round.message && (
                        <p className="mt-1 text-sm text-muted-foreground">{round.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {yourTurn && (
                <div className="border-t border-border bg-muted/30 p-4">
                  <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto_auto]">
                    <input
                      type="text"
                      value={counterValues[negotiation.id] ?? ""}
                      onChange={(event) =>
                        setCounterValues((current) => ({
                          ...current,
                          [negotiation.id]: event.target.value,
                        }))
                      }
                      placeholder="Contraoferta em €..."
                      className="border border-border bg-background px-3 py-2 font-mono text-sm"
                    />
                    <input
                      type="text"
                      value={messages[negotiation.id] ?? ""}
                      onChange={(event) =>
                        setMessages((current) => ({
                          ...current,
                          [negotiation.id]: event.target.value,
                        }))
                      }
                      placeholder="Mensagem opcional..."
                      className="border border-border bg-background px-3 py-2 text-sm"
                    />
                    <button
                      onClick={() => void submitCounter(negotiation)}
                      disabled={isBusy}
                      className="bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Submeter
                    </button>
                    <button
                      onClick={() => void acceptOffer(negotiation)}
                      disabled={isBusy}
                      className="border border-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Aceitar última
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusBadge({ status, yourTurn }: { status: string; yourTurn: boolean }) {
  if (yourTurn) {
    return (
      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold uppercase text-primary">
        A sua vez
      </span>
    );
  }

  const labels: Record<string, string> = {
    open: "Aguarda ReDrive",
    accepted: "Aceite",
    rejected: "Rejeitada",
    expired: "Expirada",
  };

  return (
    <span className="rounded-full bg-muted px-2 py-0.5 font-bold uppercase text-muted-foreground">
      {labels[status] ?? status}
    </span>
  );
}
