import { ChilliIcon } from "@/components/icons";
import type { Meal } from "@/lib/recommendation";

type Props = {
  spice: Meal["spice"];
};

/** One chilli for a little heat, two for very spicy; nothing for a dish that isn't spicy */
export function SpiceBadge({ spice }: Props) {
  if (spice === "nein") return null;
  const count = spice === "very" ? 2 : 1;
  return (
    <span
      aria-label={spice === "very" ? "Spicy" : "A little spicy"}
      className="absolute bottom-2 left-2 flex h-6 items-center gap-0.5 rounded-full bg-chilli-red px-1.5 text-white"
    >
      {Array.from({ length: count }, (_, i) => (
        <ChilliIcon key={i} size={14} />
      ))}
    </span>
  );
}
