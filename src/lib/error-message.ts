// Helpers to extract readable details from any error (Supabase, fetch, JS).

export interface ErrorDetails {
  message: string;
  code?: string;
  hint?: string;
  details?: string;
  raw?: string;
}

export function getErrorDetails(error: unknown): ErrorDetails {
  if (!error) return { message: "Erro desconhecido" };

  if (typeof error === "string") return { message: error };

  if (error instanceof Error) {
    const anyErr = error as Error & {
      code?: string;
      hint?: string;
      details?: string;
    };
    return {
      message: anyErr.message || "Erro desconhecido",
      code: anyErr.code,
      hint: anyErr.hint,
      details: anyErr.details,
      raw: anyErr.stack,
    };
  }

  if (typeof error === "object") {
    const obj = error as Record<string, unknown>;
    const msg =
      (typeof obj.message === "string" && obj.message) ||
      (typeof obj.error === "string" && obj.error) ||
      "Erro desconhecido";

    return {
      message: msg,
      code: typeof obj.code === "string" ? obj.code : undefined,
      hint: typeof obj.hint === "string" ? obj.hint : undefined,
      details: typeof obj.details === "string" ? obj.details : undefined,
      raw: safeStringify(obj),
    };
  }

  return { message: String(error) };
}

export function getErrorMessage(error: unknown): string {
  return getErrorDetails(error).message;
}

function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return undefined;
  }
}
