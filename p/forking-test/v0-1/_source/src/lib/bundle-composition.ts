export type BundleKey = "protein" | "portions" | "postpartum" | "better";

/*
 * Which dishes sit in which bundle isn't in Storyblok, so it lives here: per bundle, a list of
 * rails, each a heading and the Storyblok slugs in the order they show. From the
 * Bundle_composition tab of the "NEW master data" sheet.
 *
 * Bundles drawn as a grid (Protein, Back to Better) have one rail and ignore its heading.
 */
// TODO(lift): sample data — replace with the bundle composition from the master data sheet
export const BUNDLE_MENU: Record<BundleKey, [heading: string, slugs: string[]][]> = {
  protein: [
    [
      "Main meals",
      [
        "bami-goreng-bowl",
        "better-butter-chicken",
        "chili-sin-carne",
        "chimichurri-glow",
        "creamy-peanut-curry",
        "dal-delight-bowl",
        "forest-green-bowl",
        "lemon-cashew-pasta",
        "nasi-goreng",
        "paella-del-sol",
        "peas-love",
        "red-curry",
        "sesame-quinoa-salad",
        "spiced-peanut-couscous",
        "teriyaki-wok",
        "umami-rice",
        "tikka-masala-bowl",
        "brilliant-bolognese",
      ],
    ],
  ],
  better: [
    [
      "Main meals",
      [
        "better-butter-chicken",
        "brilliant-bolognese",
        "coco-curry-pasta",
        "creamy-peanut-curry",
        "garden-gnocchi",
        "lemon-cashew-pasta",
        "naked-taco",
        "paprika-thai-ragout",
        "pasta-arrabbiata",
        "peas-love",
        "sesame-fried-rice",
        "spiced-peanut-couscous",
        "dal-delight-bowl",
        "golden-glow-bowl",
        "forest-green-bowl",
        "paella-del-sol",
        "bami-goreng-bowl",
        "creamy-paprika-pasta",
        "peanut-noodles",
        "lemon-zucchini-gnocchi",
        "spirulina-glow-smoothie",
      ],
    ],
  ],
  postpartum: [
    ["Breakfast", ["pistachio-pecan-granola", "green-smoothie", "pitaya-smoothie", "tropical-smoothie"]],
    [
      "Main meals",
      [
        "golden-glow-bowl",
        "nasi-goreng",
        "peas-love",
        "coco-curry-pasta",
        "paella-del-sol",
        "golden-curry-bowl",
        "teriyaki-wok",
        "garden-gnocchi",
      ],
    ],
    [
      "Snacks",
      [
        "raspberry-crumble",
        "blueberry-white-chocolate-crumble",
        "swedish-chocolate-ball",
        "lemon-cake-ball",
        "apple-crumble",
      ],
    ],
  ],
  portions: [
    ["Breakfast", ["apple-cinnamon-porridge", "vanilla-hazelnut-muesli", "pitaya-smoothie", "green-smoothie"]],
    [
      "Main meals",
      [
        "bami-goreng-bowl",
        "better-butter-chicken",
        "brilliant-bolognese",
        "chili-sin-carne",
        "crunchy-beetroot-salad",
        "dal-delight-bowl",
        "farmhouse-ratatouille",
        "garden-gnocchi",
        "green-curry-noodles",
        "mushroom-spatzle",
        "naked-taco",
        "paella-del-sol",
        "pasta-arrabbiata",
        "pearl-pasta-salad",
        "ramen-noodles",
        "red-curry",
        "spiced-peanut-couscous",
        "tikka-masala-bowl",
        "umami-rice",
        "creamy-peanut-curry",
      ],
    ],
    ["Snacks", ["raw-cakes-9-bites-box"]],
  ],
};

/** Every slug set to the same quantity */
const box = (qty: number, ...slugs: string[]): Record<string, number> =>
  Object.fromEntries(slugs.map((slug) => [slug, qty]));

const PROTEIN_12: string[] = [
  "lemon-cashew-pasta",
  "chimichurri-glow",
  "umami-rice",
  "bami-goreng-bowl",
  "teriyaki-wok",
  "nasi-goreng",
  "chili-sin-carne",
  "creamy-peanut-curry",
  "dal-delight-bowl",
  "spiced-peanut-couscous",
  "peas-love",
  "forest-green-bowl",
];

const PORTIONS_MEALS: string[] = BUNDLE_MENU.portions[1][1];

const POSTPARTUM_ALL: string[] = BUNDLE_MENU.postpartum.flatMap(([, slugs]) => slugs);

/*
 * What each box size actually holds, and how many of each: one entry per pill in the size picker,
 * in the same order. The rails above set the headings and the order; these decide which dishes show
 * and the count on "See all". A bundle without an entry shows its rails whole.
 */
// TODO(lift): sample data — replace with the box composition from the master data sheet
export const BOX_CONTENTS: Record<BundleKey, Record<string, number>[]> = {
  protein: [
    box(1, ...PROTEIN_12) /* B0347Z */,
    {
      ...box(1, ...PROTEIN_12, "red-curry", "better-butter-chicken", "sesame-quinoa-salad"),
      "lemon-cashew-pasta": 2,
    } /* B0345Z */,
    {
      ...box(
        1,
        ...PROTEIN_12,
        "red-curry",
        "better-butter-chicken",
        "sesame-quinoa-salad",
        "tikka-masala-bowl",
        "brilliant-bolognese",
        "paella-del-sol",
      ),
      "lemon-cashew-pasta": 2,
      "chimichurri-glow": 2,
    } /* B0346Z */,
  ],
  better: [
    {
      ...box(
        1,
        "lemon-cashew-pasta",
        "paprika-thai-ragout",
        "better-butter-chicken",
        "creamy-peanut-curry",
        "sesame-fried-rice",
        "spiced-peanut-couscous",
        "naked-taco",
        "brilliant-bolognese",
        "peas-love",
        "pasta-arrabbiata",
        "coco-curry-pasta",
        "garden-gnocchi",
      ),
      "spirulina-glow-smoothie": 2,
    } /* B0327Z */,
    {
      ...box(
        1,
        "garden-gnocchi",
        "dal-delight-bowl",
        "forest-green-bowl",
        "brilliant-bolognese",
        "coco-curry-pasta",
        "lemon-cashew-pasta",
        "golden-glow-bowl",
        "paprika-thai-ragout",
        "pasta-arrabbiata",
        "peas-love",
        "spiced-peanut-couscous",
        "better-butter-chicken",
        "creamy-peanut-curry",
        "naked-taco",
        "paella-del-sol",
        "sesame-fried-rice",
      ),
      "spirulina-glow-smoothie": 2,
    } /* B0335Z */,
    {
      ...box(
        1,
        "lemon-cashew-pasta",
        "bami-goreng-bowl",
        "paprika-thai-ragout",
        "better-butter-chicken",
        "creamy-peanut-curry",
        "paella-del-sol",
        "creamy-paprika-pasta",
        "sesame-fried-rice",
        "spiced-peanut-couscous",
        "peanut-noodles",
        "naked-taco",
        "forest-green-bowl",
        "brilliant-bolognese",
        "peas-love",
        "pasta-arrabbiata",
        "golden-glow-bowl",
        "dal-delight-bowl",
        "coco-curry-pasta",
        "garden-gnocchi",
        "lemon-zucchini-gnocchi",
      ),
      "spirulina-glow-smoothie": 2,
    } /* B0325Z */,
  ],
  portions: [
    box(1, ...PORTIONS_MEALS) /* B0341Z Starter */,
    {
      ...box(1, ...PORTIONS_MEALS, "raw-cakes-9-bites-box", "apple-cinnamon-porridge", "vanilla-hazelnut-muesli"),
      "green-smoothie": 2,
      "pitaya-smoothie": 2,
    } /* B0342Z Complete */,
  ],
  postpartum: [{ ...box(2, ...POSTPARTUM_ALL), "pistachio-pecan-granola": 1 } /* B0305Z */],
};

/*
 * Immunity bundle. Not in BundleKey yet (that would touch the quiz), so it sits beside the others
 * with the same shapes: one rail of slugs, and one box entry per size (11, 14 and 19 meals).
 */
// TODO(lift): sample data — replace with the bundle composition from the master data sheet
// TODO(lift): "ginger-ritual-cubes" is a guessed slug — the product isn't published in Storyblok yet
export const IMMUNITY_MENU: [heading: string, slugs: string[]][] = [
  [
    "Main meals",
    [
      "balsamic-tomato-pan",
      "bami-goreng-bowl",
      "better-butter-chicken",
      "brilliant-bolognese",
      "pumpkin-rigatoni",
      "pumpkin-zucchini-risotto",
      "lemon-cashew-pasta",
      "creamy-peanut-curry",
      "sesame-fried-rice",
      "korean-fried-rice",
      "peas-love",
      "clean-green-bowl",
      "spiced-peanut-couscous",
      "dal-delight-bowl",
      "golden-glow-bowl",
      "coco-curry-pasta",
      "pasta-arrabbiata",
      "peanut-noodles",
      "garden-gnocchi",
      "ginger-ritual-cubes",
    ],
  ],
];

// TODO(lift): sample data — replace with the box composition from the master data sheet
export const IMMUNITY_BOX_CONTENTS: Record<string, number>[] = [
  box(
    1,
    "pumpkin-rigatoni",
    "lemon-cashew-pasta",
    "pumpkin-zucchini-risotto",
    "creamy-peanut-curry",
    "balsamic-tomato-pan",
    "bami-goreng-bowl",
    "sesame-fried-rice",
    "korean-fried-rice",
    "brilliant-bolognese",
    "peas-love",
    "clean-green-bowl",
    "ginger-ritual-cubes",
  ) /* 11 meals */,
  box(
    1,
    "pumpkin-rigatoni",
    "lemon-cashew-pasta",
    "pumpkin-zucchini-risotto",
    "better-butter-chicken",
    "creamy-peanut-curry",
    "sesame-fried-rice",
    "spiced-peanut-couscous",
    "korean-fried-rice",
    "balsamic-tomato-pan",
    "brilliant-bolognese",
    "peas-love",
    "clean-green-bowl",
    "dal-delight-bowl",
    "coco-curry-pasta",
    "ginger-ritual-cubes",
  ) /* 14 meals */,
  box(1, ...IMMUNITY_MENU[0][1]) /* 19 meals */,
];
