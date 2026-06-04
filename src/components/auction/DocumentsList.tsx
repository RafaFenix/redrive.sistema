import { useEffect, useState } from "react";
import { FileText, Lock, AlertCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getCurrentAccess, type CurrentAccess } from "@/lib/auth-client";
import { getVehicleDocuments, type VehicleDocumentLink } from "@/lib/market-data";

interface Props {
  vehicleId: string;
  hasDamageReport: boolean;
  hasAppraisal: boolean;
  hasServiceHistory: boolean;
  hasCoc: boolean;
}

interface MissingDoc {
  kind: VehicleDocumentLink["kind"];
  label: string;
}

const ALL_LABELS: Record<VehicleDocumentLink["kind"], string> = {
  damage: "Relatório de danos",
  appraisal: "Avaliação independente",
  service: "Histórico de manutenção",
  coc: "Certificado de conformidade (COC)",
};

export function DocumentsList({
  vehicleId,
  hasDamageReport,
  hasAppraisal,
  hasServiceHistory,
  hasCoc,
}: Props) {
  const [access, setAccess] = useState<CurrentAccess | null>(null);
  const [docs, setDocs] = useState<VehicleDocumentLink[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const flags: MissingDoc[] = [
    hasDamageReport && { kind: "damage" as const, label: ALL_LABELS.damage },
    hasAppraisal && { kind: "appraisal" as const, label: ALL_LABELS.appraisal },
    hasServiceHistory && { kind: "service" as const, label: ALL_LABELS.service },
    hasCoc && { kind: "coc" as const, label: ALL_LABELS.coc },
  ].filter((flag): flag is MissingDoc => Boolean(flag));

  useEffect(() => {
    let active = true;
    void getCurrentAccess()
      .then((a) => {
        if (active) setAccess(a);
      })
      .catch(() => {
        if (active) setAccess({ isAuthenticated: false, profile: null, roles: [] });
      });
    return () => {
      active = false;
    };
  }, []);

  const canSee = Boolean(
    access?.isAuthenticated &&
    access.profile?.status === "approved" &&
    (access.roles.includes("buyer") || access.roles.includes("admin")),
  );

  useEffect(() => {
    if (!canSee || flags.length === 0) return;
    setIsLoading(true);
    getVehicleDocuments(vehicleId)
      .then((links) => setDocs(links))
      .catch((e) => setError(e instanceof Error ? e.message : "Falha a obter documentos"))
      .finally(() => setIsLoading(false));
  }, [canSee, vehicleId, flags.length]);

  if (flags.length === 0) return null;

  return (
    <div className="rounded-sm border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Documentação disponível
      </h3>

      {!canSee ? (
        <div className="flex items-start gap-3 rounded-sm border border-border bg-muted/30 p-4 text-sm">
          <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-bold">Acesso restrito a compradores aprovados</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {flags.length}{" "}
              {flags.length === 1 ? "documento disponível" : "documentos disponíveis"}:{" "}
              {flags.map((f) => f.label).join(", ")}.{" "}
              <Link to="/register" className="font-bold text-primary underline">
                Registar conta
              </Link>{" "}
              ou{" "}
              <Link to="/login" className="font-bold text-primary underline">
                iniciar sessão
              </Link>{" "}
              para aceder.
            </p>
          </div>
        </div>
      ) : isLoading ? (
        <p className="text-xs text-muted-foreground">A gerar links seguros...</p>
      ) : error ? (
        <div className="flex items-start gap-2 text-xs text-destructive">
          <AlertCircle className="mt-0.5 size-3.5" />
          {error}
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {(docs ?? []).map((d) => (
            <li key={d.kind} className="flex items-center justify-between gap-3 py-3">
              <div className="flex items-center gap-3">
                <FileText className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium">{d.label}</span>
              </div>
              <a
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-foreground hover:text-background"
              >
                Abrir
              </a>
            </li>
          ))}
          {docs && docs.length === 0 && (
            <li className="py-2 text-xs text-muted-foreground">
              Os links seguros expiram em 10 minutos. Recarregue se precisar de novo.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
