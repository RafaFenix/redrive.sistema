import { AlertCircle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { getErrorDetails } from "@/lib/error-message";

interface Props {
  title?: string;
  error: unknown;
  onRetry?: () => void;
  variant?: "block" | "inline";
}

export function ErrorState({ title = "Não foi possível carregar os dados.", error, onRetry, variant = "block" }: Props) {
  const [open, setOpen] = useState(false);
  const details = getErrorDetails(error);

  const containerClass =
    variant === "inline"
      ? "rounded-sm border border-destructive/40 bg-destructive/5 p-3 text-sm"
      : "rounded-sm border border-destructive/40 bg-destructive/5 p-5 text-sm";

  return (
    <div className={containerClass} role="alert">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-destructive">{title}</p>
          <p className="mt-1 break-words text-xs text-foreground/80">{details.message}</p>

          {(details.code || details.hint || details.details || details.raw) && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              {open ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
              Detalhes técnicos
            </button>
          )}

          {open && (
            <dl className="mt-2 space-y-1 rounded-sm bg-background/60 p-3 font-mono text-[11px]">
              {details.code && (
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-muted-foreground">code</dt>
                  <dd className="break-all">{details.code}</dd>
                </div>
              )}
              {details.hint && (
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-muted-foreground">hint</dt>
                  <dd className="break-all">{details.hint}</dd>
                </div>
              )}
              {details.details && (
                <div className="flex gap-2">
                  <dt className="w-16 shrink-0 text-muted-foreground">details</dt>
                  <dd className="break-all">{details.details}</dd>
                </div>
              )}
              {details.raw && (
                <details className="pt-1">
                  <summary className="cursor-pointer text-muted-foreground">stack / raw</summary>
                  <pre className="mt-1 whitespace-pre-wrap break-all">{details.raw}</pre>
                </details>
              )}
            </dl>
          )}

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 border border-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-foreground hover:text-background"
            >
              <RefreshCw className="size-3" />
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
