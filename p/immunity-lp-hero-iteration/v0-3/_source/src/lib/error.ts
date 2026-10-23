// Prototype stub of every-website src/lib/error.ts — same signature, no Sentry.
// TODO(lift): delete this file; production's version sends to Sentry.
type ErrorContext = {
  tags?: Record<string, string | undefined>;
  extra?: Record<string, unknown>;
};

export function captureError(error: Error, context?: ErrorContext): void {
  // eslint-disable-next-line no-console
  console.error(`[${error.message}]`, {
    ...(context?.tags && { tags: context.tags }),
    ...(context?.extra && { extra: context.extra }),
  });
}
