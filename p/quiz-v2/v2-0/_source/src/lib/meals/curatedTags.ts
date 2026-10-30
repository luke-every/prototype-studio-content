// PROTOTYPE DEVIATION: the recipe modal's ordered tag list. Reads the story's raw filter values (Storyblok stores display labels).
// Config-driven: each entry has a canonical id, aliases, the field it comes from, a rank (the display order) and an optional group
// (only the best-ranked match of a group shows) or `hiddenBy` (hidden when another tag is present).
// Never shown, so never listed: Under 500 kcal, Low Carb, Not spicy and every recipe_without_filter value except Soy* and Gluten*.

type Source = "nutrition" | "spiciness" | "without" | "contains";

type TagDef = {
  id: string;
  source: Source;
  /** Normalised spellings (see `norm`) */
  aliases: string[];
  rank: number;
  /** Only the lowest-ranked present tag of a group shows */
  group?: "fat" | "sugar";
  /** Hidden when this tag id is present (same nutrient, higher claim) */
  hiddenBy?: string;
  /** Fixed text; otherwise the label comes from the datasource lookup, then the raw value */
  text?: string;
  /** Prefix the label with "No" (recipe_without_filter) */
  without?: boolean;
};

type Filters = {
  nutrition?: string[];
  spiciness?: string;
  without?: string[];
  contains?: string[];
  /** Locale dimensionValue, then entry name, then the raw value */
  label: (raw: string) => string;
};

/** Case, edges, a trailing * and the Fibre/Fiber spelling all fold away before matching. */
const norm = (v: string): string => v.trim().toLowerCase().replace(/\*$/, "").replace(/fibre/g, "fiber");

const TAGS: TagDef[] = [
  { id: "vegan", source: "nutrition", aliases: ["vegan"], rank: 1 },
  // TODO(lift): replace with translation key
  { id: "nuts", source: "contains", aliases: ["nuts"], rank: 2, text: "Contains nuts" },
  // TODO(lift): replace with translation key
  { id: "nut-traces", source: "contains", aliases: ["traces of nuts"], rank: 3, text: "May contain traces of nuts" },
  { id: "no-soy", source: "without", aliases: ["soy"], rank: 4, without: true },
  { id: "no-gluten", source: "without", aliases: ["gluten"], rank: 5, without: true },
  { id: "high-protein", source: "nutrition", aliases: ["high protein"], rank: 6 },
  { id: "high-fiber", source: "nutrition", aliases: ["high fiber", "high in fiber"], rank: 7 },
  { id: "source-protein", source: "nutrition", aliases: ["source of protein"], rank: 8, hiddenBy: "high-protein" },
  { id: "source-fiber", source: "nutrition", aliases: ["source of fiber"], rank: 9, hiddenBy: "high-fiber" },
  { id: "veggie", source: "nutrition", aliases: ["50%+ veggie"], rank: 10 },
  { id: "low-fat", source: "nutrition", aliases: ["low fat"], rank: 11, group: "fat" },
  { id: "low-sat-fat", source: "nutrition", aliases: ["low in saturated fats", "low in saturated fat"], rank: 12, group: "fat" },
  { id: "no-added-sugar", source: "nutrition", aliases: ["no added sugar"], rank: 13, group: "sugar" },
  { id: "low-sugar", source: "nutrition", aliases: ["low sugar"], rank: 14, group: "sugar" },
  { id: "very-spicy", source: "spiciness", aliases: ["very spicy"], rank: 15 },
  { id: "medium-spicy", source: "spiciness", aliases: ["medium spicy"], rank: 16 },
];

// TODO(lift): replace the "No" prefix with translation key
export function curatedTags({ nutrition = [], spiciness, without = [], contains = [], label }: Filters): string[] {
  const raw: Record<Source, string[]> = { nutrition, spiciness: spiciness ? [spiciness] : [], without, contains };
  // Normalised value -> the raw value it came from, per source
  const present = (source: Source): Map<string, string> => new Map(raw[source].map((v) => [norm(v), v]));
  const found = TAGS.flatMap((def) => {
    const values = present(def.source);
    const hit = def.aliases.find((a) => values.has(a));
    return hit ? [{ def, value: values.get(hit) as string }] : [];
  });
  const ids = new Set(found.map((f) => f.def.id));

  const seenGroups = new Set<string>();
  return found
    .filter(({ def }) => !(def.hiddenBy && ids.has(def.hiddenBy)))
    .sort((a, b) => a.def.rank - b.def.rank)
    .filter(({ def }) => {
      if (!def.group) return true;
      if (seenGroups.has(def.group)) return false;
      seenGroups.add(def.group);
      return true;
    })
    .map(({ def, value }) => def.text ?? (def.without ? `No ${label(value)}` : label(value)));
}
