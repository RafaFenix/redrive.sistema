import { createFileRoute } from "@tanstack/react-router";
import { negotiations, auctions, formatEUR, getVehicle } from "@/lib/mock-data";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/buyer/negotiations")({
  head: () => ({ meta: [{ title: "Negociações — ReDrive" }] }),
  component: BuyerNegotiations,
});

function BuyerNegotiations() {
  const userId = "u-buyer-2"; // for demo, show one open negotiation
  const mine = negotiations.filter((n) => n.buyerId === userId);
  const [counter, setCounter] = useState("");

  if (mine.length === 0) {
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
        Quando o preço de reserva não é atingido, a ReDrive abre uma negociação privada de até 5 rondas.
      </p>

      <div className="mt-8 space-y-8">
        {mine.map((n) => {
          const a = auctions.find((x) => x.id === n.auctionId);
          const v = a ? getVehicle(a.vehicleId) : undefined;
          if (!a || !v) return null;
          const lastRound = n.rounds[n.rounds.length - 1];
          const yourTurn = lastRound.initiatedBy === "admin";

          return (
            <div key={n.id} className="border border-border bg-card">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <img src={v.photos[0]} alt="" className="size-12 rounded-sm object-cover" />
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{a.lotNumber}</div>
                    <div className="font-bold">{v.year} {v.make} {v.model}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-mono text-muted-foreground">Ronda {n.rounds.length} / {n.maxRounds}</span>
                  <span className={yourTurn ? "rounded-full bg-primary/10 px-2 py-0.5 font-bold uppercase text-primary" : "rounded-full bg-muted px-2 py-0.5 font-bold uppercase text-muted-foreground"}>
                    {yourTurn ? "A sua vez" : "Aguarda ReDrive"}
                  </span>
                </div>
              </div>

              {/* Rounds */}
              <div className="space-y-3 p-4">
                {n.rounds.map((r) => (
                  <div key={r.round} className={`flex gap-3 ${r.initiatedBy === "buyer" ? "justify-end" : ""}`}>
                    <div className={`max-w-md border p-3 ${r.initiatedBy === "admin" ? "border-foreground bg-background" : "border-primary/30 bg-primary/5"}`}>
                      <div className="mb-1 flex items-baseline gap-2 font-mono text-[10px] uppercase text-muted-foreground">
                        <span className="font-bold">{r.initiatedBy === "admin" ? "ReDrive" : "Você"}</span>
                        <span>·</span>
                        <span>{new Date(r.createdAt).toLocaleString("pt-PT")}</span>
                      </div>
                      <div className="text-xl font-extrabold">{formatEUR(r.amount)}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{r.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Counter form */}
              {yourTurn && (
                <div className="border-t border-border bg-muted/30 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={counter}
                      onChange={(e) => setCounter(e.target.value)}
                      placeholder="Contraoferta em €..."
                      className="flex-1 border border-border bg-background px-3 py-2 font-mono text-sm"
                    />
                    <button
                      onClick={() => {
                        toast.success("Contraoferta submetida (demo).");
                        setCounter("");
                      }}
                      className="bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                    >
                      Submeter
                    </button>
                    <button
                      onClick={() => toast("Aceitação registada (demo).")}
                      className="border border-foreground px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-foreground hover:text-background"
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
