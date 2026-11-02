export type Ok<T> = { ok: true; data: T };
export type Err = { ok: false; error: string; code: "TIMEOUT" | "AUTH" | "FORBIDDEN" | "NOT_FOUND" | "SERVICE_AUTH" | "SERVER" | "NETWORK" | "VALIDATION" | "UNPROCESSABLE" | "RATE_LIMIT" | "CONFLICT"; meta?: Record<string, unknown> };
export type Result<T> = Ok<T> | Err;

export const ok = <T>(data: T): Ok<T> => ({ ok: true, data });
export const err = (error: string, code: Err["code"], meta?: Record<string, unknown>): Err => ({ ok: false, error, code, ...(meta && { meta }) });
