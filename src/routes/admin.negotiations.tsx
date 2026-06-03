import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  acceptNegotiationOffer,
  euroToCents,
  formatEUR,
  listAdminNegotiations,
  Negotiation,
  submitNegotiationRound,
} from "@/lib/market-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/negotiations")({
  head: () => ({ meta: [{ title: "Negociações — Admin" }] }),
  component: AdminNegotiations,
});

function AdminNegotiations() {
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
      const data = await listAdminNegotiations();
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
      toast.success("Contraoferta enviada.");
      setCounterValues((current) => ({ ...current, [negotiation.id]: "" }));
      setMessages((current) => ({ ...current, [negotiation.id]: "" }));
      await loadNegotiations();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível enviar a contraoferta.", {
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
      toast.success("Negociação aceite. A encomenda foi criada.");
      await loadNegotiations();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível aceitar a negociação.", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setActionId(null);
    }
  }

  const openNegotiations = negotiations.filter((negotiation) => negotiation.status === "open");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Negociações</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Leilões em que a reserva não foi atingida. Submeta contraoferta ou aceite a do comprador.
      </p>

      <div className="mt-8 space-y-6">
        {isLoading && (
          <div className="border border-border bg-card p-12 text-center text-muted-foreground">
            A carregar negociações...
          </div>
        )}

        {!isLoading &&
          openNegotiations.map((negotiation) => {
            const auction = negotiation.auction;
            const vehicle = auction?.vehicle;
            if (!auction || !vehicle) return null;

            const buyer = negotiation.buyer;
            const lastRound = negotiation.rounds.at(-1);
            const yourTurn = lastRound?.initiatedBy === "buyer";
            const isBusy = actionId === negotiation.id;

            return (
              <div key={negotiation.id} className="border border-border bg-card">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={vehicle.photos[0]}
                      alt=""
                      className="size-12 rounded-sm object-cover"
                    />
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        {auction.lotNumber}
                      </div>
                      <div className="font-bold">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="font-medium">{buyer?.companyName ?? "Comprador"}</div>
                    <div className="font-mono text-muted-foreground">
                      Reserva: {auction.reservePrice ? formatEUR(auction.reservePrice) : "—"}
                    </div>
                  </div>
                  <div>
                    <StatusBadge yourTurn={yourTurn} />
                    <span className="ml-2 font-mono text-xs text-muted-foreground">
                      Ronda {negotiation.rounds.length}/{negotiation.maxRounds}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 p-4">
                  {negotiation.rounds.map((round) => (
                    <div
                      key={round.id}
                      className={`flex gap-3 ${round.initiatedBy === "admin" ? "" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-md border p-3 ${
                          round.initiatedBy === "admin"
                            ? "border-foreground bg-background"
                            : "border-primary/30 bg-primary/5"
                        }`}
                      >
                        <div className="mb-1 font-mono text-[10px] uppercase text-muted-foreground">
                          {round.initiatedBy === "admin"
                            ? "ReDrive"
                            : (buyer?.companyName ?? "Comprador")}{" "}
                          · {new Date(round.createdAt).toLocaleString("pt-PT")}
                        </div>
                        <div className="text-lg font-extrabold">{formatEUR(round.amount)}</div>
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
                        Enviar
                      </button>
                      <button
                        onClick={() => void acceptOffer(negotiation)}
                        disabled={isBusy}
                        className="border border-success px-4 py-2 text-xs font-bold uppercase tracking-widest text-success hover:bg-success hover:text-success-foreground disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Aceitar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

        {!isLoading && openNegotiations.length === 0 && (
          <div className="border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
            Sem negociações abertas.
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ yourTurn }: { yourTurn: boolean }) {
  return (
    <span
      className={
        yourTurn
          ? "rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-primary"
          : "rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-muted-foreground"
      }
    >
      {yourTurn ? "A sua vez" : "Aguarda buyer"}
    </span>
  );
}
