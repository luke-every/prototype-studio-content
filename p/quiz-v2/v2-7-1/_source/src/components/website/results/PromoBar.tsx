import { PROMO } from "./sample-data";

type Props = {
  ref?: React.Ref<HTMLParagraphElement>;
};

/** The dark band at the top: the hero's colour with 80% black over it. The hero is pulled up over its lower half. */
export function PromoBar({ ref }: Props) {
  return (
    <p
      ref={ref}
      className="m-0 bg-[color-mix(in_srgb,black_80%,var(--bundle))] px-6 pt-[88px] pb-11 text-center text-xs leading-4 text-white"
    >
      {/* TODO(lift): replace with translation key */}
      🏷️ {PROMO}
    </p>
  );
}
