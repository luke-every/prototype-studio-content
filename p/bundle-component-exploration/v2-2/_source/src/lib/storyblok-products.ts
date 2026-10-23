export type Product = {
  name: string;
  image: string;
  /** What the dish is built on, as authored: "Rice", "Pasta/Noodles", "Legume", "Potato"; null for snacks, smoothies and breakfast */
  base: string | null;
  /** A meal counts towards "N meals"; smoothies, snacks and breakfast do not */
  meal: boolean;
  description: string;
  macros: [string | null, string][];
  /** Per portion, as authored (e.g. "519"); null when unset */
  kcal: string | null;
  ingredients: string;
  nutrition: string;
  preparation: string;
  highlights: string;
  /** The first three key ingredient names from `highlights`, in sentence case, e.g. ["Carrots", "Bok choy", "Wood ear mushroom"] */
  keyIngredients: string[];
  tags: string[];
};

export type Products = Record<string, Product>;

// TODO(lift): fake — prototypes read the public Storyblok CDN directly (read-only token); production goes through its own API route
export const STORYBLOK_TOKEN = "F9aBrJBurx9GQm7tRIpiIAtt";

export const STORYBLOK_URL = `https://api.storyblok.com/v2/cdn/stories?content_type=product&token=${STORYBLOK_TOKEN}&version=published&per_page=100&page=`;

/** Stories come back a page at a time; a page that comes back short is the last one. */
export const STORYBLOK_PAGE_SIZE = 100;

type RichNode = {
  type: string;
  text?: string;
  marks?: { type: string }[];
  content?: RichNode[];
};

type RichDoc = { content?: RichNode[] } | null | undefined;

type ImageField = { filename?: string };

type StoryContent = {
  image?: ImageField;
  images?: ImageField[];
  base_filter?: unknown;
  description?: RichDoc;
  short_description?: string;
  ingredients?: RichDoc;
  nutritional_values?: RichDoc;
  preparation?: RichDoc;
  highlights?: RichDoc;
  nutrition_filter?: string[];
  spiciness_filter?: string;
  recipe_without_filter?: string[];
  kcal?: string;
  protein?: string;
  fibre?: string;
  carbs?: string;
  fat?: string;
};

export type Story = {
  slug: string;
  full_slug: string;
  name: string;
  content: StoryContent;
};

/** Photographs are served at 600px: Storyblok resizes with /m/WxH, Shopify with a width parameter. */
function thumb(file: string | undefined): string {
  if (!file) return "";
  if (/a\.storyblok\.com/.test(file)) return `${file}/m/600x600`;
  if (/cdn\.shopify\.com/.test(file)) return `${file}${file.includes("?") ? "&" : "?"}width=600`;
  return file;
}

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Storyblok rich text flattened to HTML: paragraphs joined, bold kept (allergens), everything else dropped. */
function rich(doc: RichDoc, separator: string = " "): string {
  const flat = (node: RichNode): string => {
    if (node.type === "text") {
      const text = esc((node.text ?? "").replace(/\s+/g, " "));
      return node.marks?.some((mark) => mark.type === "bold") ? `<b>${text}</b>` : text;
    }
    if (node.type === "hard_break") return " ";
    return (node.content ?? []).map(flat).join("");
  };
  return (doc?.content ?? [])
    .map(flat)
    .map((text) => text.trim())
    .filter(Boolean)
    .join(separator);
}

const BLOCK_TAGS: Record<string, string> = {
  paragraph: "p",
  bullet_list: "ul",
  ordered_list: "ol",
  list_item: "li",
  table: "table",
  table_row: "tr",
  table_header: "th",
  table_cell: "td",
  heading: "p",
};

/** The accordion sections keep their structure — paragraphs, lists, tables. Unknown nodes are dropped. */
function richHtml(doc: RichDoc): string {
  const inline = (node: RichNode): string => {
    if (node.type === "text") {
      return (node.marks ?? []).reduce(
        (html, mark) => (mark.type === "bold" ? `<b>${html}</b>` : mark.type === "italic" ? `<i>${html}</i>` : html),
        esc(node.text ?? ""),
      );
    }
    if (node.type === "hard_break") return "<br>";
    return (node.content ?? []).map(inline).join("");
  };
  const block = (node: RichNode): string => {
    const tag = BLOCK_TAGS[node.type];
    if (!tag) return node.type === "text" || node.type === "hard_break" ? inline(node) : "";
    const children = node.content ?? [];
    const inner = children.some((child) => BLOCK_TAGS[child.type])
      ? children.map(block).join("")
      : children.map(inline).join("");
    return tag === "p" && !inner.trim() ? "" : `<${tag}>${inner}</${tag}>`;
  };
  return (doc?.content ?? []).map(block).join("");
}

/**
 * The key ingredient names from `highlights`, the same titles the meal modal's "Key ingredients" section shows, first three.
 * Stories write them one of two ways: a heading per ingredient, or a paragraph that starts with the name in bold.
 * Sentence case: "Wood Ear Mushroom" -> "Wood ear mushroom".
 */
function keyIngredientsOf(doc: RichDoc): string[] {
  return (doc?.content ?? [])
    .flatMap((node) => {
      if (node.type === "heading") return [(node.content ?? []).map((child) => child.text ?? "").join("")];
      const first = node.content?.[0];
      return node.type === "paragraph" && first?.type === "text" && first.marks?.some((mark) => mark.type === "bold") ? [first.text ?? ""] : [];
    })
    .map((name) => name.trim())
    .filter(Boolean)
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
    .slice(0, 3);
}

/** Filter values come from Storyblok as slugs: "high-protein" -> "High protein" */
function label(value: string): string {
  const text = String(value).replace(/[-_]+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** "18,0" and "23.4" alike -> 18 / 23,4; whole grams from 10 up */
function grams(value: string | undefined): string | null {
  const n = parseFloat(String(value ?? "").replace(",", "."));
  if (isNaN(n)) return null;
  return (n >= 10 ? Math.round(n) : Math.round(n * 10) / 10).toString().replace(".", ",");
}

/** Per portion, from the nutrition table's last column. The loose fields on the product (protein, fibre, carbs, fat) are not read. */
function macrosOf(content: StoryContent): [string | null, string][] {
  const table = (content.nutritional_values?.content ?? []).find((block) => block.type === "table");
  const rows: string[][] = (table?.content ?? []).map((row) =>
    (row.content ?? []).map((cell) => rich(cell).replace(/<[^>]+>/g, "")),
  );
  const pick = (pattern: RegExp): string | null => {
    const row = rows.find((cells) => pattern.test((cells[0] ?? "").replace(/ /g, " ")));
    return grams(row?.[row.length - 1]);
  };
  return [
    [pick(/^protein/i), "PROTEIN"],
    [pick(/^(dietary )?fib(re|er)/i), "FIBRE"],
    [pick(/^carbohydrate/i), "CARBS"],
    [pick(/^fat/i), "FAT"],
  ];
}

/** Per portion kcal from the nutrition table's "Energy (kJ/kcal)" row ("847/202" -> "202"). The loose kcal field is not read: the table is the one source. */
function kcalFromTable(content: StoryContent): string | null {
  const table = (content.nutritional_values?.content ?? []).find((block) => block.type === "table");
  const cells = (table?.content ?? [])
    .map((row) => (row.content ?? []).map((cell) => rich(cell).replace(/<[^>]+>/g, "")))
    .find((row) => /^energy/i.test((row[0] ?? "").trim()));
  const last = cells?.[cells.length - 1] ?? "";
  const kcal = parseFloat((last.split("/").pop() ?? "").replace(",", "."));
  return isNaN(kcal) ? null : String(Math.round(kcal));
}

/** Stories to a slug -> product map. A dish with no photograph is left out. */
export function storiesToProducts(stories: Story[]): Products {
  const products: Products = {};
  stories
    .filter((story) => story.full_slug.startsWith("products/"))
    .forEach((story) => {
      const content = story.content;
      const image = thumb(content.image?.filename || content.images?.[0]?.filename);
      if (!image) return;
      const product: Product = {
        name: story.name.trim(),
        image,
        /* a meal is anything with a base (rice, pasta, legume, potato) */
        base: typeof content.base_filter === "string" && content.base_filter ? content.base_filter : null,
        meal: !!content.base_filter,
        description: rich(content.description) || esc(content.short_description ?? ""),
        macros: macrosOf(content),
        kcal: kcalFromTable(content),
        ingredients: rich(content.ingredients, "<br>"),
        nutrition: richHtml(content.nutritional_values),
        preparation: richHtml(content.preparation),
        highlights: richHtml(content.highlights),
        keyIngredients: keyIngredientsOf(content.highlights),
        tags: [
          ...(content.nutrition_filter ?? []).map(label),
          ...(content.spiciness_filter ? [label(content.spiciness_filter)] : []),
          ...(content.recipe_without_filter ?? []).map((value) => `Without ${label(value).toLowerCase()}`),
        ],
      };
      products[story.slug] = product;
    });
  return products;
}
