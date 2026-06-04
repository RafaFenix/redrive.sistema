import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  endsAt: string;
  status?: "scheduled" | "active" | "ended" | "cancelled";
  size?: "sm" | "md" | "lg";
  className?: string;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function diff(endsAt: string) {
  const ms = new Date(endsAt).getTime() - Date.now();
  if (ms <= 0) return { ended: true, d: 0, h: 0, m: 0, s: 0, totalMs: 0 };
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { ended: false, d, h, m, s, totalMs: ms };
}

export function AuctionTimer({ endsAt, status = "active", size = "md", className }: Props) {
  const [tick, setTick] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setTick(diff(endsAt));
    const i = setInterval(() => setTick(diff(endsAt)), 1000);
    return () => clearInterval(i);
  }, [endsAt]);

  if (!tick) {
    return (
      <span
        className={cn(
          "font-mono tabular-nums tracking-tight text-muted-foreground",
          sizeClasses[size],
          className,
        )}
      >
        --:--:--
      </span>
    );
  }

  if (status === "ended" || tick.ended) {
    return (
      <span
        className={cn(
          "font-mono tracking-tight text-muted-foreground",
          sizeClasses[size],
          className,
        )}
      >
        Leilão terminado
      </span>
    );
  }

  if (status === "scheduled") {
    return (
      <span
        className={cn(
          "font-mono tracking-tight text-muted-foreground",
          sizeClasses[size],
          className,
        )}
      >
        Inicia em {tick.d > 0 ? `${tick.d}d ` : ""}
        {pad(tick.h)}:{pad(tick.m)}:{pad(tick.s)}
      </span>
    );
  }

  const urgent = tick.totalMs < 5 * 60 * 1000;
  const critical = tick.totalMs < 2 * 60 * 1000;

  const display =
    tick.d > 0
      ? `${pad(tick.d)}d ${pad(tick.h)}:${pad(tick.m)}:${pad(tick.s)}`
      : `${pad(tick.h)}:${pad(tick.m)}:${pad(tick.s)}`;

  return (
    <span
      className={cn(
        "font-mono font-bold tabular-nums tracking-tighter",
        sizeClasses[size],
        urgent ? "text-primary" : "text-foreground",
        critical && "animate-pulse-red",
        className,
      )}
    >
      {display}
    </span>
  );
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-xl",
  lg: "text-5xl",
};
