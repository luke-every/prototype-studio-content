"use client";

import { Button } from "@/components/shared/Button";
import { useTranslations } from "@/providers/TranslationsProvider";

function OrangeSpinner({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block size-5 shrink-0 rounded-full border-2 border-dark/25 border-t-signal-orange animate-spin ${className ?? ""}`}
      aria-hidden
    />
  );
}

type StickyConfirmCTAProps = {
  visible: boolean;
  disabled?: boolean;
  /** Subscription multi-update in flight — disables control and shows orange spinner. */
  loading?: boolean;
  buttonLabel?: string;
  subLabel?: string;
  onConfirm?: () => void;
};

export function StickyConfirmCTA({
  visible,
  disabled = false,
  loading = false,
  buttonLabel,
  subLabel,
  onConfirm,
}: StickyConfirmCTAProps) {
  const t = useTranslations();
  const label = buttonLabel ?? t.allMeals.savingsCTA.confirmSelection;
  const isBlocked = disabled || loading;

  return (
    <div
      style={{ paddingRight: "var(--scrollbar-width, 0px)" }}
      className={`fixed inset-x-0 bottom-0 z-[60] pointer-events-none transition-[opacity,transform] duration-300 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      aria-hidden={!visible}
    >
      <div className={`mx-auto w-full max-w-[360px] px-3 pb-3 ${visible ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div className="rounded-md bg-dark p-3 shadow-xl">
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isBlocked}
            aria-busy={loading}
            aria-label={loading ? t.layout.savingAriaLabel : label}
            className={`w-full justify-center rounded-md px-6 !py-1 text-xl font-regular transition-colors ${
              isBlocked && !loading
                ? "bg-light-grey-3 text-dark/40 cursor-not-allowed"
                : loading
                  ? "bg-signal-orange text-dark cursor-wait opacity-95"
                  : "bg-signal-orange text-dark hover:opacity-90"
            }`}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <OrangeSpinner />
                <span>{t.layout.saving}</span>
              </span>
            ) : (
              label
            )}
          </Button>

          {subLabel && (
            <p className="mt-2 text-center text-base text-light-grey-2">
              {subLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

