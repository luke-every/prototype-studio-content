import Image from "next/image";
import { INCLUDE_ROWS, type Bundle, type Includes } from "./bundles";

const SMALL = "font-sans text-sm leading-[18px] tracking-[-0.28px]";
const CAPTION = "font-sans text-sm leading-[18px] tracking-[-0.28px] text-light-text";

// Main meals first, then breakfast and snacks
const MEAL_ORDER = ["mains", "breakfast", "snacks"].map((key) => INCLUDE_ROWS.find((r) => r.key === key)).filter((r) => r !== undefined);

// TODO(lift): sample data — stand-in photos and one-line descriptions per meal type, the same for every bundle; replace with meals from the bundle's own menu (Storyblok). Literal paths so /push can fix them.
const MEAL_PHOTOS: Record<keyof Includes, string[]> = {
  mains: ["/img/meals/red-curry-bowl.png", "/img/meals/bami-goreng-bowl.png", "/img/meals/dal-delight-bowl.png"],
  breakfast: ["/img/meals/vanilla-hazelnut-muesli.jpg", "/img/meals/apple-cinnamon-porridge.jpg", "/img/meals/pitaya-smoothie.jpg"],
  snacks: ["/img/meals/raw-cakes.jpg"],
};
// TODO(lift): sample data — the circle photos in the "Includes …" stack, from public/img/BundleInclusions (border baked in, one set per bundle). Literal paths so /push can fix them.
const STACK_PHOTOS: Record<string, string[]> = {
  protein: ["/img/BundleInclusions/protein01.png", "/img/BundleInclusions/protein02.png", "/img/BundleInclusions/protein03.png", "/img/BundleInclusions/protein04.png"],
  immunity: ["/img/BundleInclusions/immunity01.png", "/img/BundleInclusions/immunity02.png", "/img/BundleInclusions/immunity03.png", "/img/BundleInclusions/immunity04.png"],
  "body-balance": ["/img/BundleInclusions/body01.png", "/img/BundleInclusions/body02.png", "/img/BundleInclusions/body03.png", "/img/BundleInclusions/body05.png"],
  "new-parent": ["/img/BundleInclusions/post01.png", "/img/BundleInclusions/post02.png", "/img/BundleInclusions/post04.png", "/img/BundleInclusions/post06.png"],
};
const MEAL_NOTE: Record<keyof Includes, string> = {
  mains: "Lunch and dinner bowls",
  breakfast: "Muesli, porridge and smoothies",
  snacks: "Raw cakes and snack balls",
};

// TODO(lift): sample data — one plain line per bundle under "Includes …" (two lines at most, no dish names, never repeating the meal types), in four framings to compare (studio control "subhead"). Replace with a Storyblok field.
// focus / moment are about the meals; first / extras are about the free gifts. New Parent has no gift, so it uses its "focus" line in those two. "Your first box" is how the CMS describes the gifts (checked for Immunity only).
const FOCUS: Record<string, string> = {
  protein: "Plant-based protein in every meal, to keep you full.",
  immunity: "Built around vitamins for the colder months.",
  "body-balance": "Portioned to keep calories in check.",
  "new-parent": "Built around nourishing food for the first months.",
};
const SUBHEAD: Record<string, Record<string, string>> = {
  focus: FOCUS,
  moment: {
    protein: "Filling enough to get you through a busy week.",
    immunity: "Warming meals for when the weather turns cold.",
    "body-balance": "Portioned so healthy habits are easier to keep.",
    "new-parent": "Ready in minutes when your hands are full.",
  },
  first: {
    protein: "Your first box also has Pulled Protein and Crumble Protein.",
    immunity: "Your first box also has a ginger cubes pack and a tote bag.",
    "body-balance": "Your first box also has a green smoothie.",
    "new-parent": FOCUS["new-parent"],
  },
  extras: {
    protein: "Free Planted. Pulled Protein packs and Boonian Crumble to boost protein intake.",
    immunity: "Free ginger shot cubes with vitamin A and C, plus an every tote bag.",
    "body-balance": "Main meals, plus porridge, muesli and smoothies to start the day. Raw cake bites for in between.",
    "new-parent": "Main meals, plus a mix of smoothies, breakfast granola, and a variety of snack balls and crumbles.",
  },
};

const LIST = new Intl.ListFormat("en-GB", { type: "conjunction" });
// TODO(lift): sample copy — a non-meal thing named in the "Includes …" headline, where a bundle has one
const FULL_ROUTINE = new Set(["body-balance", "new-parent"]);
const HEADLINE_EXTRA: Record<string, string> = { immunity: "cold-pressed shots" };

type Item = { key: string; label: string; photo: string; note: string; free: boolean; /** A cut-out bowl on a transparent background. */ cutOut: boolean };

type Props = {
  b: Bundle;
  /** The treatment under exploration (studio control "included"). The goal of all of them: see at a glance what physically comes in the box, in a form that reads the same on every bundle. */
  variant: string;
  /** Background class for panels and pills, set by the card style. */
  fill: string;
};

/** Whether a treatment sits in one tinted panel. Those need no "What's included" title (the stack says "Includes …" itself); the others get the title above. */
export const hasPanel = (variant: string) => variant === "stack" || variant === "rows";

type Rgb = [number, number, number];
// The light-grey token (--color-light-grey) and the dark token (--color-dark), as numbers so they can be blended
const DARK: Rgb = [55, 45, 39];
const mix = (over: Rgb, alpha: number, under: Rgb): Rgb => over.map((c, i) => Math.round(c * alpha + under[i] * (1 - alpha))) as Rgb;

/**
 * The colour the panel actually shows, as one solid colour. The panel's fill is see-through (light grey at 40%, or dark at 6% on the bundle colour), so a border
 * painted in that same see-through colour would let the circle behind show through it. A solid border of the blended result matches it exactly.
 */
function panelColour(b: Bundle): string {
  const page: Rgb = [255, 255, 255];
  const m = b.colors.tile.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  const tile = m ? mix([Number(m[1]), Number(m[2]), Number(m[3])], m[4] ? Number(m[4]) : 1, page) : page;
  const rgb = mix(DARK, 0.06, tile);
  return `rgb(${rgb.join(",")})`;
}

/** One picture, cropped to whatever shape `className` gives it. Cut-out bowls are shown whole on a tint; square photos fill the shape. */
function Photo({ item, className, ring }: { item: Item; className: string; ring?: string }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden ${item.cutOut ? "bg-dark/6" : "bg-white"} ${className}`} style={ring ? { borderColor: ring } : undefined}>
      <Image src={item.photo} alt="" fill sizes="120px" className={item.cutOut ? "object-contain p-[6%]" : "object-cover"} />
    </span>
  );
}

/** Up to three round photos overlapping left to right, in a fixed-width column. Cut-out bowls sit bare; square photos get a thin white edge so they read apart. */
function Cluster({ photos, cutOut = false, ring }: { photos: string[]; cutOut?: boolean; ring: string }) {
  return (
    <span className="flex w-[88px] shrink-0">
      {photos.slice(0, 3).map((src, i) => (
        <span key={src} className={`relative size-10 shrink-0 overflow-hidden rounded-full ${i > 0 ? "-ml-4" : ""} ${cutOut ? "" : "border bg-white"}`} style={cutOut ? undefined : { borderColor: ring }}>
          <Image src={src} alt="" fill sizes="40px" className="object-cover" />
        </span>
      ))}
    </span>
  );
}

/** "What's included" inside a bundle card's details, in the treatment picked by the studio control. Every treatment except "rows" shows exactly one picture per thing in the box. */
export function IncludedSection({ b, variant, fill }: Props) {
  const subhead = "extras";
  const ring = panelColour(b);
  const meals = MEAL_ORDER.filter((row) => b.includes[row.key]);
  const items: Item[] = [
    ...meals.map((row) => ({ key: row.key, label: row.label, photo: MEAL_PHOTOS[row.key][0], note: MEAL_NOTE[row.key], free: false, cutOut: row.key === "mains" })),
    // TODO(lift): replace with translation key
    ...b.gifts.map((gift) => ({ key: gift.name, label: gift.name, photo: gift.image, note: "Free extra", free: true, cutOut: false })),
  ];

  // Photo tiles: the pictures do the talking. One equal tile per thing, name underneath, a small "Free" badge on extras.
  if (variant === "tiles") {
    return (
      <ul className={`grid gap-x-2 gap-y-3 lg:grid-cols-2 ${items.length === 4 ? "grid-cols-4" : "grid-cols-3"}`}>
        {items.map((item) => (
          <li key={item.key} className="flex flex-col gap-2">
            <span className="relative">
              <Photo item={item} className="aspect-square w-full rounded-[14px]" />
              {item.free && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-white px-1.5 py-0.5 font-sans text-[10px] font-medium uppercase leading-3 tracking-[0.6px] text-near-black">Free</span>
              )}
            </span>
            <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-near-black">{item.label}</span>
          </li>
        ))}
      </ul>
    );
  }

  // Photo pills: the same shape as the tags above, each with its picture inside. The most compact; wraps to fit.
  if (variant === "pills") {
    return (
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.key} className={`${SMALL} flex items-center gap-2 rounded-[22px] py-1 pl-1 pr-3.5 text-near-black ${fill}`}>
            <Photo item={{ ...item, cutOut: false }} className="size-9 rounded-full" />
            <span>
              {item.label}
              {item.free && <span className={`${CAPTION} ml-1.5`}>Free</span>}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  // List: one row per thing, each the same: a picture, the name, a line saying what it is. Hairlines between rows, no panel.
  if (variant === "list") {
    return (
      <ul className="flex flex-col divide-y divide-dark/10">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
            <Photo item={item} className="size-12 rounded-xl" />
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className={`${SMALL} font-medium text-near-black`}>{item.label}</span>
              <span className={CAPTION}>{item.note}</span>
            </span>
          </li>
        ))}
      </ul>
    );
  }

  // Photo rows (the first version): one tinted panel; each row leads with a cluster of overlapping round photos in a fixed-width column, so the names line up.
  if (variant === "rows") {
    return (
      <div className={`flex flex-col lg:min-h-44 gap-3 rounded-[14px] p-4 ${fill}`}>
        <ul className="flex flex-col gap-3">
        {meals.map((row) => (
          <li key={row.key} className="flex items-center gap-3">
            <Cluster photos={MEAL_PHOTOS[row.key]} cutOut={row.key === "mains"} ring={ring} />
            <span className={`${SMALL} text-near-black`}>{row.label}</span>
          </li>
        ))}
        {b.gifts.length > 0 && (
          <li className="flex items-center gap-3">
            <Cluster photos={b.gifts.map((gift) => gift.image)} ring={ring} />
            <span className="flex min-w-0 flex-col gap-0.5">
              {/* TODO(lift): replace with translation key */}
              <span className={`${SMALL} text-near-black`}>Free extras</span>
              <span className={CAPTION}>{b.gifts.map((gift) => gift.name).join(", ")}</span>
            </span>
          </li>
        )}
        </ul>
      </div>
    );
  }

  // Stack and sentence (the default, the one picked so far): one row of overlapping photos for the whole box, then the contents said as a sentence. Nothing to line up.
  return (
    <div className={`flex flex-col lg:min-h-44 gap-3 rounded-[14px] p-4 ${fill}`}>
      <span className="flex">
        {STACK_PHOTOS[b.key].map((src, i) => (
          <span key={src} className={`relative block size-12 shrink-0 ${i > 0 ? "-ml-3" : ""}`}>
            <Image src={src} alt="" fill sizes="48px" />
          </span>
        ))}
      </span>
      <div className="flex flex-col gap-1">
        {/* TODO(lift): replace with translation key */}
        <p className="pr-4 font-book text-lg leading-[22px] tracking-[-0.36px] text-near-black">Includes {FULL_ROUTINE.has(b.key) ? "a full routine" : LIST.format([...meals.filter((row) => !(b.key === "immunity" && row.key === "snacks")).map((row) => row.label.toLowerCase()), ...(HEADLINE_EXTRA[b.key] ? [HEADLINE_EXTRA[b.key]] : [])]).replace(" and ", " & ")}</p>
        <p className={`${CAPTION} lg:text-xs lg:leading-4 lg:tracking-[-0.24px]`}>{SUBHEAD[subhead]?.[b.key] ?? SUBHEAD.focus[b.key]}</p>
      </div>
    </div>
  );
}
