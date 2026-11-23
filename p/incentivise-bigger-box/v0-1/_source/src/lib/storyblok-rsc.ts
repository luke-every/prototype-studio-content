// Stands in for "@storyblok/react/rsc" (see next.config.ts). A prototype has no Storyblok editor, so the editable
// attributes are empty, and a nested CMS block renders nothing: pass the real content in as props instead.
export type SbBlokData = { _uid: string; component: string; _editable?: string; [key: string]: unknown };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function storyblokEditable(_blok: SbBlokData): Record<string, string> {
  return {};
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function StoryblokServerComponent(_props: { blok: SbBlokData }) {
  return null;
}

// The fixtures behind some stories register their blocks with it; there is no registry here to put them in.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function setComponents(_components: Record<string, unknown>) {}
