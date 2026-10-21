// The variant overrides the baseline's props. There is one, keyed "" (no ?v= param).
// A client-side param (not a server searchParam) so the static export Prototype Studio serves still works.

import { MEAL_DESCRIPTIONS } from "./meal-descriptions";

export type PdpVariant = {
  /** Eyebrow above the meals headline; undefined removes it */
  mealsKicker?: string;
  /** Grey line under the meals headline */
  mealsSubhead?: string;
  /** Chips under the meals headline */
  mealsTags?: string[];
  /** "shelves": one row per product type instead of the 2×2 carousel */
  mealsLayout?: "carousel" | "shelves";
  /** Meal card style in the carousel */
  mealCard?: "image" | "circle" | "outlined";
  /** 16px sides below desktop, heading and stats inset 8px more */
  tightPadding?: boolean;
  /** Nutrition tiles and menu button style */
  statsDesign?: "default" | "outlined";
  /** Meals per carousel page */
  mealsPerPage?: 1 | 4 | 6;
  /** Nutrition tiles above the carousel */
  statsAbove?: boolean;
  /** Line under the name on the circle card */
  cardDetail?: "kcal" | "ingredients";
  /** Replacement meal photos by product slug */
  mealImages?: Record<string, string>;
  /** Photos that replace the story's own in the meal modal, by product slug */
  modalImages?: Record<string, string>;
  /** Aspect ratio of the meal modal's photo, e.g. "1/1" */
  modalImageRatio?: string;
  /** Shortened descriptions for the meal modal, by product slug; also turns the description grey */
  modalDescriptions?: Record<string, string>;
  /** How the meal modal moves between meals: swipe (with a first-open hint), a floating thumbnail dock, or an "up next" teaser */
  exploreMeals?: "swipe" | "thumbs" | "next";
  /** Teaser grid with the last row faded, menu button above the tiles, and the Perfect Portions Menu modal */
  menuPreview?: boolean;
  /** Meal modal shows the curated tag set (max 10, fixed order) instead of every filter value */
  curatedTags?: boolean;
};

// The one flow (v2): the full menu teaser grid, the Perfect Portions Menu modal, swipe between recipes and the ordered recipe tags.
// An unknown or missing ?v= falls back to this, so there is a single variant.
export const VARIANTS: Record<string, Partial<PdpVariant>> = {
  "": {
    mealsKicker: "",
    // TODO(lift): replace with translation key
    mealsTags: ["100% Plant-based menu", "25 g protein avg", "Low sugar", "No additives"],
    mealCard: "outlined",
    tightPadding: true,
    statsDesign: "outlined",
    mealsPerPage: 6,
    menuPreview: true,
    exploreMeals: "swipe",
    curatedTags: true,
    // TODO(lift): sample photos — replace with the story's own
    mealImages: {
      "apple-cinnamon-porridge": "img/cards/apple-cinnamon-porridge.jpg",
      "bami-goreng-bowl": "img/cards/bami-goreng-bowl-bowl.png",
      "better-butter-chicken": "img/cards/better-butter-chicken-bowl.png",
      "brilliant-bolognese": "img/cards/brilliant-bolognese-bowl.png",
      "chili-sin-carne": "img/cards/chili-sin-carne-bowl.png",
      "creamy-peanut-curry": "img/cards/creamy-peanut-curry-bowl.png",
      "crunchy-beetroot-salad": "img/cards/crunchy-beetroot-salad-bowl.png",
      "dal-delight-bowl": "img/cards/dal-delight-bowl-bowl.png",
      "farmhouse-ratatouille": "img/cards/farmhouse-ratatouille-bowl.png",
      "garden-gnocchi": "img/cards/garden-gnocchi-bowl.png",
      "green-curry-noodles": "img/cards/green-curry-noodles-bowl.png",
      "mushroom-spatzle": "img/cards/mushroom-spatzle-bowl.png",
      "naked-taco": "img/cards/naked-taco.png",
      "paella-del-sol": "img/cards/paella-del-sol-bowl.png",
      "pasta-arrabbiata": "img/cards/pasta-arrabbiata-bowl.png",
      "pearl-pasta-salad": "img/cards/pearl-pasta-salad-bowl.png",
      "pitaya-smoothie": "img/cards/pitaya-smoothie.jpg",
      "ramen-noodles": "img/cards/ramen-noodles-bowl.png",
      "raw-cakes-9-bites-box": "img/cards/raw-cakes-9-bites-box.jpg",
      "red-curry": "img/cards/red-curry-bowl.png",
      "spiced-peanut-couscous": "img/cards/spiced-peanut-couscous-bowl.png",
      "tikka-masala-bowl": "img/cards/tikka-masala-bowl-bowl.png",
      "umami-rice": "img/cards/umami-rice-bowl.png",
      "vanilla-hazelnut-muesli": "img/cards/vanilla-hazelnut-muesli.jpg",
    },
    // TODO(lift): sample photos — replace with the story's own
    modalImages: {
      "apple-cinnamon-porridge": "img/modals/apple-cinnamon-porridge-modal.jpg",
      "bami-goreng-bowl": "img/modals/bami-goreng-bowl-modal.jpg",
      "better-butter-chicken": "img/modals/better-butter-chicken-modal.jpg",
      "brilliant-bolognese": "img/modals/brilliant-bolognese-modal.jpg",
      "chili-sin-carne": "img/modals/chili-sin-carne-modal.jpg",
      "crunchy-beetroot-salad": "img/modals/crunchy-beetroot-salad-modal.jpg",
      "dal-delight-bowl": "img/modals/dal-delight-bowl-modal.jpg",
      "farmhouse-ratatouille": "img/modals/farmhouse-ratatouille-modal.jpg",
      "garden-gnocchi": "img/modals/garden-gnocchi-modal.jpg",
      "green-curry-noodles": "img/modals/green-curry-noodles-modal.jpg",
      "mushroom-spatzle": "img/modals/mushroom-spatzle-modal.jpg",
      "naked-taco": "img/modals/naked-taco-modal.jpg",
      "paella-del-sol": "img/modals/paella-del-sol-modal.jpg",
      "pasta-arrabbiata": "img/modals/pasta-arrabbiata-modal.jpg",
      "pearl-pasta-salad": "img/modals/pearl-pasta-salad-modal.jpg",
      "pitaya-smoothie": "img/modals/pitaya-smoothie-modal.jpg",
      "ramen-noodles": "img/modals/ramen-noodles-modal.jpg",
      "raw-cakes-9-bites-box": "img/modals/raw-cakes-9-bites-box-modal.jpg",
      "red-curry": "img/modals/red-curry-modal.jpg",
      "spiced-peanut-couscous": "img/modals/spiced-peanut-couscous-modal.jpg",
      "tikka-masala-bowl": "img/modals/tikka-masala-bowl-modal.jpg",
      "umami-rice": "img/modals/umami-rice-modal.jpg",
      "vanilla-hazelnut-muesli": "img/modals/vanilla-hazelnut-muesli-modal.jpg",
    },
    modalImageRatio: "1/1",
    modalDescriptions: MEAL_DESCRIPTIONS,
  },
};
