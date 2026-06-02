import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { profiles, UserStatus } from "@/lib/mock-data";
import { toast } from "sonner";

const TABS: { value: UserStatus; label: string }[] = [
  { value: "pending", label: "Pendentes" },
  { value: "approved", label: "Aprovados" },
  { value: "rejected", label: "Rejeitados" },
  { value: "suspended", label: "Suspensos" },
];

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Utilizadores — Admin" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  const [tab, setTab] = useState<UserStatus>("pending");
  const filtered = profiles.filter((p) => p.role === "buyer" && p.status === tab);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold tracking-tight">Utilizadores</h1>

      <div className="mt-6 flex gap-1 border-b border-border">
        {TABS.map((t) => {
          const count = profiles.filter((p) => p.role === "buyer" && p.status === t.value).length;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`relative px-4 py-2 text-sm font-bold uppercase tracking-widest transition-colors ${
                tab === t.value ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label} <span className="ml-1 font-mono text-xs text-muted-foreground">({count})</span>
              {tab === t.value && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
            </button>
          );
        })}
      </div>

      <div className="mt-6 border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-left font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Empresa</th>
              <th className="px-4 py-3">NIF</th>
              <th className="px-4 py-3">Responsável</th>
              <th className="px-4 py-3">Cidade</th>
              <th className="px-4 py-3">Submetido</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{p.companyName}</td>
                <td className="px-4 py-3 font-mono text-xs">{p.vatNumber}</td>
                <td className="px-4 py-3 text-sm">{p.contactName}<br /><span className="text-xs text-muted-foreground">{p.contactPhone}</span></td>
                <td className="px-4 py-3 text-sm">{p.city}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString("pt-PT")}</td>
                <td className="px-4 py-3 text-right">
                  {tab === "pending" && (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => toast.success(`${p.companyName} aprovado.`)} className="bg-success px-3 py-1.5 text-[10px] font-bold uppercase text-success-foreground hover:bg-success/90">Aprovar</button>
                      <button onClick={() => toast.error(`${p.companyName} rejeitado.`)} className="border border-primary px-3 py-1.5 text-[10px] font-bold uppercase text-primary hover:bg-primary hover:text-primary-foreground">Rejeitar</button>
                    </div>
                  )}
                  {tab === "approved" && (
                    <button onClick={() => toast(`${p.companyName} suspenso (demo).`)} className="border border-border px-3 py-1.5 text-[10px] font-bold uppercase hover:bg-muted">Suspender</button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">Sem registos nesta categoria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
