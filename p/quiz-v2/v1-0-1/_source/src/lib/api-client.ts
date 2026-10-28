import { type Result, type Err, err } from "@/lib/result";

type RedirectResult = { redirect: true; url: string };
type ApiResult<T> = Result<T> | RedirectResult;

export function isRedirect(result: ApiResult<unknown>): result is RedirectResult {
  return "redirect" in result && result.redirect === true;
}

const TIMEOUT_MS = 60_000;

/**
 * Lightweight fetch wrapper for internal API routes.
 *
 * Handles 401 redirects, content-type validation, JSON parsing,
 * and error normalisation so each hook only deals with business logic.
 */
export async function apiFetch<T = unknown>(
  url: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, { signal: controller.signal, ...init });
  } catch (e) {
    if (e instanceof Error && e.name === "AbortError") {
      return err("Request timed out", "TIMEOUT");
    }
    return err("Network request failed", "NETWORK");
  } finally {
    clearTimeout(timeout);
  }

  if (res.status === 401) {
    return { redirect: true, url: "/login" };
  }

  const contentType: string = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return err("Unexpected response format", "SERVER");
  }

  let json: Record<string, unknown>;
  try {
    json = await res.json();
  } catch {
    return err("Failed to parse response", "SERVER");
  }

  if (!res.ok) {
    if (json?.code === "INVALID_ID_TOKEN") {
      return { redirect: true, url: "/login" };
    }
    const code = (typeof json.code === "string" ? json.code : "SERVER") as Err["code"];
    const message = typeof json.error === "string" ? json.error : "Request failed";
    return err(message, code);
  }

  return { ok: true, data: json as T };
}