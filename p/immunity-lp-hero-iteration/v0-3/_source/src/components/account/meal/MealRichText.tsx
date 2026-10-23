"use client";

import { StoryblokRichText } from "@storyblok/react";
import type { StoryblokRichTextNode } from "@storyblok/react";
import type { ReactElement } from "react";

type RichTextDoc = StoryblokRichTextNode<ReactElement>;

function isDoc(value: unknown): value is RichTextDoc {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { type?: unknown }).type === "doc"
  );
}

type Props = {
  content: unknown;
  className?: string;
};

export function MealRichText({ content, className }: Props) {
  if (!isDoc(content)) return null;

  return (
    <div
      className={[
        "[&>div]:space-y-2",
        "[&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-dark",
        "[&_p:empty]:hidden [&_p:has(>br:only-child)]:hidden",
        "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:leading-snug [&_h1]:text-dark",
        "[&_h2]:text-lg [&_h2]:font-bold [&_h2]:leading-snug [&_h2]:text-dark",
        "[&_h3]:text-base [&_h3]:font-bold [&_h3]:leading-snug [&_h3]:text-dark",
        "[&_h4]:text-sm [&_h4]:font-bold [&_h4]:leading-snug [&_h4]:text-dark",
        "[&_h5]:text-sm [&_h5]:font-semibold [&_h5]:leading-snug [&_h5]:text-dark",
        "[&_h6]:text-xs [&_h6]:font-semibold [&_h6]:leading-snug [&_h6]:text-dark",
        "[&_ul]:list-disc [&_ul]:list-inside [&_ol]:list-decimal [&_ol]:list-inside",
        "[&_li]:text-sm [&_li]:leading-relaxed [&_li]:text-dark",
        "[&_li>p]:contents",
        "[&_strong]:font-bold",
        "[&_em]:italic",
        "[&_table]:w-full [&_table]:text-sm [&_table]:border-collapse",
        "[&_tr]:border-b [&_tr]:border-gray-100",
        "[&_th]:py-2 [&_th]:pr-4 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:text-dark",
        "[&_th>p]:contents",
        "[&_td]:py-2 [&_td]:pr-4 [&_td]:text-dark",
        "[&_td>p]:contents",
        className ?? "",
      ].join(" ")}
    >
      <StoryblokRichText doc={content} />
    </div>
  );
}
