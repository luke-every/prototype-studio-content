import type { ReactNode } from "react";
import { NARROW_INSET_CLASS, NARROW_LEFT_CLASS } from "@/lib/section-width";

type Props = {
  tone?: "white" | "warm" | "dark";
  children: ReactNode;
};

/** Same card, padding and PDP-rail inset as GlobalImageTextV2, so the explored sections sit in the page like the real ones. */
export function SectionShell({ tone = "white", children }: Props) {
  const toneClass = tone === "dark" ? "bg-dark text-white" : tone === "warm" ? "bg-light-brown text-dark" : "bg-white text-dark";

  return (
    <section className={`w-full rounded-4xl px-6 pt-8 pb-16 scroll-mt-19 md:px-8 lg:pt-16 lg:pb-32 ${NARROW_LEFT_CLASS} ${NARROW_INSET_CLASS} ${toneClass}`}>
      <div className="flex flex-col gap-8 lg:max-w-184 lg:gap-12">{children}</div>
    </section>
  );
}
