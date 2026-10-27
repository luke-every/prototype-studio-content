import { ChilliIcon } from "@/components/icons";
import type { Meal } from "@/lib/recommendation";

type Props = {
  meal: Meal;
  /** The cuisines they said they love; a meal of one of them gets its icon */
  cuisines: string[];
};

// TODO(lift): emoji stand in for cuisine icons until Design draws a set
const CUISINE_ICON: Record<string, [icon: string, name: string]> = {
  Italian: ["🍝", "Italian"],
  Indian: ["🍛", "Indian"],
  Asian: ["🥢", "Asian"],
  German: ["🥨", "German"],
  "Latin American Food": ["🌮", "Latin"],
};

/**
 * Bottom-left of a meal's photo, inset 8px: its cuisine, only when it's one they love, and its heat
 * (one chilli for a little, two for very spicy). Nothing for a mild meal of a cuisine they didn't pick
 */
export function MealBadges({ meal, cuisines }: Props) {
  const cuisine = cuisines.includes(meal.cuis) ? CUISINE_ICON[meal.cuis] : undefined;
  const chillies = meal.spice === "very" ? 2 : meal.spice === "a little" ? 1 : 0;
  if (!cuisine && !chillies) return null;
  return (
    <span className="absolute bottom-2 left-2 flex gap-1">
      {cuisine && (
        <span
          aria-label={cuisine[1]}
          className="flex h-6 items-center rounded-full bg-white/90 px-1.5 text-sm leading-none backdrop-blur-[2px]"
        >
          <span aria-hidden>{cuisine[0]}</span>
        </span>
      )}
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
