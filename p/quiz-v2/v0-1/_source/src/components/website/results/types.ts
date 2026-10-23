

/** A headline whose second half is set in italic, optionally on a line of its own */
export type Headline = {
  lead: string;
  italic: string;
  lineBreak?: boolean;
};

export type BoxSize = {
  n: number;
  per: string;
  total: string;
  was: string;
  disc: string;
  qty: string;
  /** Label under the number, MEALS unless stated */
  label?: string;
  /** Third line on the pill; the generic one for its position when absent */
  tagline?: string;
  popular?: boolean;
};

export type BoxPlanInfo = {
  title: string;
  /** false for a box with no size to pick */
  pills?: boolean;
  sizes: BoxSize[];
};

export type BoxBreakdown = {
  note?: string;
  gift?: string;
  /** One list for the box, or one per size pill */
  items?: string[][];
  addon?: { name: string; price: string; image: string };
};

/** A dish in a rail or the grid: [name, image, slug, quantity in the box] */
export type MenuItem = {
  name: string;
  image: string;
  slug: string;
  qty: number;
};

export type Rail = {
  heading: string;
  items: MenuItem[];
};

export type Product = {
  name: string;
  image: string;
  /** A meal counts towards "N meals"; smoothies, snacks and breakfast do not */
  meal: boolean;
  description: string;
  macros: [string | null, string][];
  ingredients: string;
  nutrition: string;
  preparation: string;
  highlights: string;
  tags: string[];
};

export type Products = Record<string, Product>;

