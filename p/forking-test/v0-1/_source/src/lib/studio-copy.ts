/**
 * Dev only: tags each line of a copy file with where it is in the file, so the studio, when somebody edits an element,
 * knows which line it shows and can change that line and no other. The tag is invisible: a word joiner, sixteen
 * zero-width joiners / non-joiners that spell the line's number, and a word joiner, before and after the words. An
 * image address is tagged with `#studio-<number>` instead. Lines are numbered in file order, empty ones included. In a production build the copy is returned untouched.
 */
const EDGE = "⁠";
const BIT = ["‌", "‍"];
// An image address: a url or a path to a picture. Tagged with a fragment (`#studio-12`), which no server or browser reads, and which stays in the address the page ends up showing.
const IMAGE = /^(https?:\/\/|\/)[^\s#]*\.(png|jpe?g|webp|gif|avif|svg)(\?[^\s#]*)?$/i;

export function tagged<T>(copy: T): T {
  if (process.env.NODE_ENV === "production") return copy;
  let next = 0;
  const walk = (value: unknown): unknown => {
    if (typeof value === "string") {
      // An empty line is not tagged (it would show as something), but it still has its number, so emptying a line never moves the rest.
      if (value === "") {
        next++;
        return value;
      }
      if (IMAGE.test(value)) return `${value}#studio-${next++}`;
      const tag = EDGE + [...(next++).toString(2).padStart(16, "0")].map((bit) => BIT[Number(bit)]).join("") + EDGE;
      return tag + value + tag;
    }
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, walk(item)]));
    return value;
  };
  return walk(copy) as T;
}

/**
 * Dev only: the studio asks which lines of the copy file the page shows now (a message from the studio, as a prototype on its own address can't be
 * read from there), and is answered with their numbers: every line that is in the page's markup, read off its tags. A line the page never puts out
 * (a field a component takes and doesn't draw, another variation's) isn't in the answer, so it can be left out of a copy document.
 */
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  window.addEventListener("message", (event: MessageEvent) => {
    const data = event.data as { type?: string; id?: string } | null;
    if (data?.type !== "studio:copy-seen" || !event.source) return;
    const html = document.documentElement.outerHTML;
    const seen = new Set<number>();
    for (const found of html.matchAll(/\u2060([\u200c\u200d]{16})\u2060/g)) seen.add(parseInt([...found[1]].map((bit) => (bit === "\u200d" ? "1" : "0")).join(""), 2));
    (event.source as Window).postMessage({ type: "studio:copy-seen:answer", id: data.id, lines: [...seen] }, "*");
  });
}
