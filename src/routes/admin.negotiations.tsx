import { createFileRoute } from "@tanstack/react-router";
import { negotiations, auctions, getVehicle, getProfile, formatEUR } from "@/lib/mock-data";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/admin/negotiations")({
  head: () => ({ meta: [{ title: "Negociações — Admin" }] }),
  component: AdminNegotiations,
});

function AdminNegotiations() {
  const open = negotiations.filter((n) => n.status === "open");
  const [counter, setCounter] = useState("");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Negociações</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Leilões em que a reserva não foi atingida. Submeta contraoferta ou aceite a do comprador.
      </p>

      <div className="mt-8 space-y-6">
        {open.map((n) => {
          const a = auctions.find((x) => x.id === n.auctionId);
          const v = a ? getVehicle(a.vehicleId) : undefined;
          const buyer = getProfile(n.buyerId);
          if (!a || !v || !buyer) return null;
          const lastRound = n.rounds[n.rounds.length - 1];
          const yourTurn = lastRound.initiatedBy === "buyer";

          return (
            <div key={n.id} className="border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <img src={v.photos[0]} alt="" className="size-12 rounded-sm object-cover" />
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{a.lotNumber}</div>
                    <div className="font-bold">{v.year} {v.make} {v.model}</div>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-medium">{buyer.companyName}</div>
                  <div className="font-mono text-muted-foreground">Reserva: {formatEUR(a.reservePrice)}</div>
                </div>
                <div>
                  <span className={yourTurn ? "rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-primary" : "rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-muted-foreground"}>
                    {yourTurn ? "A sua vez" : "Aguarda buyer"}
                  </span>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">Ronda {n.rounds.length}/{n.maxRounds}</span>
                </div>
              </div>

              <div className="space-y-2 p-4">
                {n.rounds.map((r) => (
                  <div key={r.round} className={`flex gap-3 ${r.initiatedBy === "admin" ? "" : "justify-end"}`}>
                    <div className={`max-w-md border p-3 ${r.initiatedBy === "admin" ? "border-foreground bg-background" : "border-primary/30 bg-primary/5"}`}>
                      <div className="mb-1 font-mono text-[10px] uppercase text-muted-foreground">
                        {r.initiatedBy === "admin" ? "ReDrive" : buyer.companyName} · {new Date(r.createdAt).toLocaleString("pt-PT")}
                      </div>
                      <div className="text-lg font-extrabold">{formatEUR(r.amount)}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{r.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {yourTurn && (
                <div className="border-t border-border bg-muted/30 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={counter}
                      onChange={(e) => setCounter(e.target.value)}
                      placeholder="Contraoferta..."
                      className="flex-1 border border-border bg-background px-3 py-2 font-mono text-sm"
                    />
                    <button
                      onClick={() => { toast.success("Contraoferta enviada (demo)."); setCounter(""); }}
                      className="bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-primary-foreground hover:bg-primary/90"
                    >
                      Enviar
                    </button>
                    <button
                      onClick={() => toast("Negociação aceite (demo).")}
                      className="border border-success px-4 py-2 text-xs font-bold uppercase tracking-widest text-success hover:bg-success hover:text-success-foreground"
                    >
                      Aceitar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {open.length === 0 && (
          <div className="border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
            Sem negociações abertas.
          </div>
        )}
      </div>
    </div>
  );
}
