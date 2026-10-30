import { ChilliIcon } from "@/components/icons";
import type { Meal } from "@/lib/recommendation";

type Props = {
  meal: Meal;
};

/**
 * Bottom-left of a meal's photo, inset 8px: its heat (one chilli for a little, two for very spicy).
 * Nothing for a mild meal
 */
export function MealBadges({ meal }: Props) {
  const chillies =
    meal.spice === "very" ? 2 : meal.spice === "a little" ? 1 : 0;
  if (!chillies) return null;
  return (
    <span className="absolute bottom-2 left-2 flex gap-1">
      {chillies > 0 && (
        <span
          aria-label={chillies === 2 ? "Spicy" : "A little spicy"}
          className="flex h-6 items-center gap-0.5 rounded-full bg-chilli-red px-1.5 text-white"
        >
          {Array.from({ length: chillies }, (_, i) => (
            <ChilliIcon key={i} size={14} />
          ))}
        </span>
      )}
    </span>
  );
}
