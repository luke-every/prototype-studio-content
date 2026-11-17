#!/usr/bin/env node
/**
 * Writes src/lib/stage-registry.ts: every story in production's clone, by Storybook's own story id, each a lazy import.
 * Run after the stories are in the clone (team-conventions/storybook/sync.mjs --add), and again when they change.
 *
 *   node scripts/build-registry.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, relative } from "node:path";

const clone = process.env.EVERY_WEBSITE_DIR ?? join(homedir(), "Claude", "every-website-main");
const src = join(clone, "src");
const walk = (folder) => readdirSync(folder, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? (entry.name === "node_modules" ? [] : walk(join(folder, entry.name))) : [join(folder, entry.name)]));
// Storybook's own rule for an id: lower case, every run of anything else a dash.
const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const rows = [];
for (const file of walk(src).filter((path) => path.endsWith(".stories.tsx"))) {
  const text = readFileSync(file, "utf8");
  const title = text.match(/title:\s*["'`]([^"'`]+)["'`]/)?.[1];
  if (!title) continue;
  const path = relative(src, file).replace(/\.tsx$/, "");
  for (const [, name] of text.matchAll(/^export const (\w+)\s*[:=]/gm)) {
    if (name === "meta") continue;
    rows.push({ id: `${slug(title)}--${slug(name.replace(/([a-z0-9])([A-Z])/g, "$1 $2"))}`, path, name });
  }
}
rows.sort((a, b) => a.id.localeCompare(b.id));

const lib = join(import.meta.dirname, "..", "src", "lib");
// Plain JS with a hand-written declaration beside it (stage-registry.d.ts): the checker never walks into the stories, which are typed against Storybook.
writeFileSync(
  join(lib, "stage-registry.js"),
  `// Written by scripts/build-registry.mjs: do not edit.
export const stories = {
${rows.map((row) => `  ${JSON.stringify(row.id)}: { name: ${JSON.stringify(row.name)}, load: () => import(${JSON.stringify(`@/${row.path}`)}) },`).join("\n")}
};
`,
);
console.log(`${rows.length} stories`);
