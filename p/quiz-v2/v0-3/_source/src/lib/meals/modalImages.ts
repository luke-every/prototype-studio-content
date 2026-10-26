// PROTOTYPE DEVIATION: the recipe modal's own photos, by product slug — the same set as the bundle test's modalImages.
// TODO(lift): sample photos — replace with the story's own
const MODAL_IMAGES: Record<string, string> = {
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
};

/** The modal's photo for a dish, or undefined to show the dish's own */
export function modalImage(slug: string): string | undefined {
  return MODAL_IMAGES[slug];
}
