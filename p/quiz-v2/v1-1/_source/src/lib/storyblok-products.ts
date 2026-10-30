import type { Product, Products } from "@/components/website/results/types";
import { curatedTags } from "@/lib/meals/curatedTags";

// TODO(lift): fake — the prototype reads the public Storyblok CDN directly; production goes through its own API route
export const STORYBLOK_URL =
  "https://api.storyblok.com/v2/cdn/stories?content_type=product&token=F9aBrJBurx9GQm7tRIpiIAtt&version=published&per_page=100&page=";

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
  recipe_contains?: string[];
  protein?: string;
  fibre?: string;
  carbs?: string;
  fat?: string;
  product_weight?: string;
  shopify_product_da?: ShopifyField;
  shopify_product_dev?: ShopifyField;
};

type ShopifyField = { items?: { sku?: string }[] } | null;

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
  /* Storyblok's rich text names its tables camelCase */
  tableRow: "tr",
  tableHeader: "th",
  tableCell: "td",
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

/** Filter values come from Storyblok as slugs: "high-protein" -> "High protein" */
function label(value: string): string {
  const text = String(value).replace(/[-_]+/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** "18,0" and "23.4" alike -> 18 / 23,4: one decimal, as the website's recipe modal shows them */
function grams(value: string | undefined): string | null {
  const n = parseFloat(String(value ?? "").replace(",", "."));
  if (isNaN(n)) return null;
  return (Math.round(n * 10) / 10).toString().replace(".", ",");
}

/**
 * Per portion, from the nutrition table's last column. The loose fields on the product
 * (protein, fibre, carbs, fat) are a fallback — fibre is empty on most of them.
 */
function macrosOf(content: StoryContent): [string | null, string][] {
  const table = (content.nutritional_values?.content ?? []).find((block) => block.type === "table");
  const rows: string[][] = (table?.content ?? []).map((row) =>
    (row.content ?? []).map((cell) => rich(cell).replace(/<[^>]+>/g, "")),
  );
  const pick = (pattern: RegExp, field: "protein" | "fibre" | "carbs" | "fat"): string | null => {
    const row = rows.find((cells) => pattern.test((cells[0] ?? "").replace(/ /g, " ")));
    return grams(row?.[row.length - 1]) ?? grams(content[field]);
  };
  return [
    [pick(/^protein/i, "protein"), "PROTEIN"],
    [pick(/^(dietary )?fib(re|er)/i, "fibre"), "FIBRE"],
    [pick(/^carbohydrate/i, "carbs"), "CARBS"],
    [pick(/^fat/i, "fat"), "FAT"],
  ];
}

/** Per-portion kcal from the "Energy (kJ/kcal)" row: "847/202" -> "202" */
function kcalOf(content: StoryContent): string | null {
  const table = (content.nutritional_values?.content ?? []).find((block) => block.type === "table");
  const row = (table?.content ?? [])
    .map((r) => (r.content ?? []).map((cell) => rich(cell).replace(/<[^>]+>/g, "")))
    .find((cells) => /^energy/i.test(cells[0] ?? ""));
  const n = parseFloat((row?.[row.length - 1] ?? "").split("/").pop()?.replace(",", ".") ?? "");
  return isNaN(n) ? null : String(Math.round(n));
}

/**
 * The highlights come in two shapes: a heading (the ingredient) then a paragraph (why it matters), repeated;
 * or one paragraph per ingredient, its name in bold, a line break, then the text. Same reading as the
 * website's MealDetailModal.
 */
function keyIngredientsOf(doc: RichDoc): Product["keyIngredients"] {
  const textOf = (parts: RichNode[]) => parts.map((part) => part.text ?? "").join("").trim();
  return (doc?.content ?? []).reduce<Product["keyIngredients"]>((list, node) => {
    const parts = node.content ?? [];
    const [first, second] = parts;
    if (node.type === "heading") list.push({ name: textOf(parts), text: "" });
    else if (node.type === "paragraph" && first?.marks?.some((m) => m.type === "bold") && second?.type === "hard_break")
      list.push({ name: textOf([first]), text: textOf(parts.slice(2)) });
    else if (node.type === "paragraph" && list.length > 0) list[list.length - 1].text = `${list[list.length - 1].text} ${textOf(parts)}`.trim();
    return list;
  }, []);
}

const cellText = (cell: RichNode) => rich(cell).replace(/<[^>]+>/g, "").replace(/ /g, " ").trim();

/**
 * The nutrition table as the website's MealDetailModal shows it: "Energy (kJ/kcal)" with "437/104"
 * becomes an "Energy (kJ)" and an "Energy (kcal)" row, every other "Fat (g)" row drops the unit from
 * its label and shows it beside the values ("2,1 g"), and the headers read "Per 100g" and
 * "Per portion (450g)" with a break after "Per".
 */
function nutritionTableOf(doc: RichDoc): RichDoc {
  if (!doc) return doc;
  const NBSP = " ";
  const text = (value: string): RichNode => ({ type: "text", text: value });
  const cellOf = (cell: RichNode, value: string, i: number): RichNode => ({
    ...cell,
    content: [
      {
        type: "paragraph",
        content:
          cell.type === "tableHeader" && i > 0 && value.startsWith("Per ")
            ? [text("Per "), { type: "hard_break" }, text(value.slice(4))]
            : [text(value)],
      },
    ],
  });
  const rowOf = (row: RichNode, cells: string[]): RichNode => ({ ...row, content: (row.content ?? []).map((cell, i) => cellOf(cell, cells[i], i)) });
  const mapRow = (row: RichNode): RichNode[] => {
    const cells = row.content ?? [];
    if (cells[0]?.type === "tableHeader") {
      const [first, ...rest] = cells.map(cellText);
      return [rowOf(row, [first, ...rest.map((h) => h.replace(/^100\s*g$/i, "Per 100g").replace(/^portion\s*\((\d+)\s*g?\)$/i, "Per portion ($1g)"))])];
    }
    if (cells[0]?.type !== "tableCell") return [row];
    const [name0, ...values] = cells.map(cellText);
    const match = name0.match(/^(.*?)\s*\(([^)]*)\)$/);
    if (!match) return [row];
    const [, name, unit] = match;
    if (/^energy$/i.test(name) && unit.includes("/")) {
      const [kj, kcal] = unit.split("/").map((u) => (u.trim().toLowerCase() === "kj" ? "kJ" : u.trim()));
      const part = (i: number, u: string): string[] => [
        `${name} (${u})`,
        ...values.map((v) => (v.split("/")[i]?.trim() ?? "") + (v.split("/")[i] ? NBSP + u : "")),
      ];
      return [rowOf(row, part(0, kj)), rowOf(row, part(1, kcal))];
    }
    return [rowOf(row, [name, ...values.map((v) => (v ? v + NBSP + unit : v))])];
  };
  return { ...doc, content: (doc.content ?? []).map((node) => (node.type === "table" ? { ...node, content: (node.content ?? []).flatMap(mapRow) } : node)) };
}

/* Storyblok stores the filters as display labels; the "*" some carry is dropped */
const filterLabel = (raw: string) => raw.trim().replace(/\*$/, "");

/** Stories to a slug -> product map. A dish with no photograph is left out. */
export function storiesToProducts(stories: Story[]): Products {
  const products: Products = {};
  stories
    .filter((story) => story.full_slug.startsWith("products/"))
    .forEach((story) => {
      const content = story.content;
      const image = thumb(content.image?.filename || content.images?.[0]?.filename);
      if (!image) return;
      const curated = curatedTags({
        nutrition: content.nutrition_filter,
        spiciness: content.spiciness_filter,
        without: content.recipe_without_filter,
        contains: content.recipe_contains,
        label: filterLabel,
      });
      const product: Product = {
        name: story.name.trim(),
        image,
        weight: parseFloat(content.product_weight ?? "") || null,
        sku: (content.shopify_product_da ?? content.shopify_product_dev)?.items?.[0]?.sku ?? "",
        /* a meal is anything with a base (rice, pasta, legume, potato) */
        meal: !!content.base_filter,
        description: rich(content.description) || esc(content.short_description ?? ""),
        shortDescription: (content.short_description ?? "").trim(),
        macros: macrosOf(content),
        kcal: kcalOf(content),
        keyIngredients: keyIngredientsOf(content.highlights),
        ingredients: rich(content.ingredients, "<br>"),
        nutrition: richHtml(nutritionTableOf(content.nutritional_values)),
        preparation: richHtml(content.preparation),
        highlights: richHtml(content.highlights),
        tags: [
          ...(content.nutrition_filter ?? []).map(label),
          ...(content.spiciness_filter ? [label(content.spiciness_filter)] : []),
          ...(content.recipe_without_filter ?? []).map((value) => `Without ${label(value).toLowerCase()}`),
        ],
        curatedTags: curated,
        /* soy and gluten are already among the curated tags, so they aren't repeated under the ingredients */
        withoutTags: (content.recipe_without_filter ?? [])
          .map((value) => `No ${filterLabel(value)}`)
          .filter((tag) => !curated.includes(tag)),
      };
      products[story.slug] = product;
    });
  return products;
}
