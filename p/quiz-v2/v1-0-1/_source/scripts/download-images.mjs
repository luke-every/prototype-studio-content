// Downloads every product image per bundle: node scripts/download-images.mjs [outDir] [bundle ...]
// Uses the same Storyblok CDN call and BUNDLE_MENU mapping as the prototype. Full-size originals.
import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { BUNDLE_MENU, IMMUNITY_MENU } from "../src/components/website/results/menu-data.ts";
import { STORYBLOK_PAGE_SIZE, STORYBLOK_URL } from "../src/lib/storyblok-products.ts";

const outDir = process.argv[2] ?? "bundle-images";
const only = process.argv.slice(3); // e.g. immunity; none = every bundle

const stories = [];
for (let page = 1; ; page++) {
  const res = await fetch(STORYBLOK_URL + page);
  if (!res.ok) throw new Error(`Storyblok page ${page}: ${res.status}`);
  const { stories: batch } = await res.json();
  stories.push(...batch);
  if (batch.length < STORYBLOK_PAGE_SIZE) break;
}
const bySlug = new Map(stories.map((s) => [s.slug, s]));

const bytes = new Map(); // url -> Buffer, so a dish in several bundles downloads once
async function download(url) {
  if (!bytes.has(url)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    bytes.set(url, Buffer.from(await res.arrayBuffer()));
  }
  return bytes.get(url);
}

let saved = 0;
const problems = [];
for (const [bundle, rails] of Object.entries({ ...BUNDLE_MENU, immunity: IMMUNITY_MENU })) {
  if (only.length && !only.includes(bundle)) continue;
  const dir = join(outDir, bundle);
  await mkdir(dir, { recursive: true });
  for (const slug of new Set(rails.flatMap(([, slugs]) => slugs))) {
    const content = bySlug.get(slug)?.content;
    if (!content) {
      problems.push(`${bundle}/${slug}: not in Storyblok`);
      continue;
    }
    const urls = [...new Set([content.image?.filename, ...(content.images ?? []).map((i) => i.filename)].filter(Boolean))];
    if (!urls.length) problems.push(`${bundle}/${slug}: no images`);
    for (const [i, url] of urls.entries()) {
      try {
        const name = `${slug}${i ? `-${i + 1}` : ""}${extname(new URL(url).pathname) || ".jpg"}`;
        await writeFile(join(dir, name), await download(url));
        saved++;
      } catch (err) {
        problems.push(`${bundle}/${slug}: ${url} (${err.message})`);
      }
    }
  }
  console.log(`${bundle} done`);
}
console.log(`\n${saved} files in ${outDir}/`);
if (problems.length) console.log(`\nProblems:\n${problems.join("\n")}`);
