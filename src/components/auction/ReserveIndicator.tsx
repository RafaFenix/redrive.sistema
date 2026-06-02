import { cn } from "@/lib/utils";

interface Props {
  reserveMet: boolean;
  className?: string;
}

export function ReserveIndicator({ reserveMet, className }: Props) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div
        className={cn(
          "size-2 rounded-full",
          reserveMet ? "bg-success" : "bg-primary",
        )}
      />
      <span
        className={cn(
          "text-[10px] font-bold uppercase tracking-widest",
          reserveMet ? "text-success" : "text-primary",
        )}
      >
        {reserveMet ? "Reserva atingida" : "Reserva não atingida"}
      </span>
    </div>
  );
}
