import React from "react";
import Link from "next/link";
import {
  render as renderRichText,
  NODE_HEADING,
  NODE_PARAGRAPH,
  NODE_UL,
  NODE_OL,
  NODE_LI,
  NODE_TABLE,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  MARK_STRIKE,
  MARK_LINK,
  MARK_TEXT_STYLE,
} from "storyblok-rich-text-react-renderer";
import type { RenderOptions } from "storyblok-rich-text-react-renderer";
import { richTextComponents } from "@/lib/storyblok/rich-text-components";
import type {Market} from "@/lib/market";

type RichTextMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

type RichTextNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: RichTextNode[];
  text?: string;
  marks?: RichTextMark[];
};

export type RichTextDoc = {
  type: "doc";
  content?: RichTextNode[];
};

type Props = {
  doc: RichTextDoc;
  className?: string;
  headingClassName?: string;
  style?: React.CSSProperties;
  market?: Market;
  locale?: string;
};

type NodeAttrs = { level?: number; textAlign?: string };

const HEADING_CLASSES: Record<number, string> = {
  1: "text-5xl",
  2: "text-4xl",
  3: "text-3xl",
  4: "text-2xl",
  5: "text-lg",
  6: "text-base",
};

function alignStyle(textAlign?: string): React.CSSProperties | undefined {
  return textAlign ? { textAlign: textAlign as React.CSSProperties["textAlign"] } : undefined;
}

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function buildRenderOptions(market?: Market, locale?: string, headingClassName?: string): RenderOptions {
  return {
  defaultBlokResolver: (name, props) => {
    const Component = richTextComponents[name as keyof typeof richTextComponents] as
      | React.ComponentType<{ blok: typeof props; market?: Market; locale?: string }>
      | undefined;
    if (!Component) return null;
    return <Component blok={props} market={market} locale={locale} />;
  },
  markResolvers: {
    [MARK_BOLD]: (children) => <strong className="font-semibold">{children}</strong>,
    [MARK_ITALIC]: (children) => <em>{children}</em>,
    [MARK_UNDERLINE]: (children) => <u>{children}</u>,
    [MARK_STRIKE]: (children) => <s>{children}</s>,
    [MARK_TEXT_STYLE]: (children, { color }) =>
      color ? <span style={{ color }}>{children}</span> : <>{children}</>,
    anchor: (children, attrs) => {
      const id = (attrs as Record<string, unknown>)?.id as string | undefined;
      return <span data-anchor={id}>{children}</span>;
    },
    [MARK_LINK]: (children, { href = "", target, linktype }) => {
      if (linktype === "email") {
        return (
          <a href={`mailto:${href}`} className="underline hover:opacity-80">
            {children}
          </a>
        );
      }
      if (isExternal(href)) {
        return (
          <a
            href={href}
            target={target ?? "_blank"}
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
          >
            {children}
          </a>
        );
      }
      return (
        <Link href={href} target={target ?? undefined} className="underline hover:opacity-80">
          {children}
        </Link>
      );
    },
  },
  nodeResolvers: {
    [NODE_HEADING]: (children, attrs) => {
      const { level, textAlign } = attrs as NodeAttrs;
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      return (
        <Tag className={`font-book ${headingClassName ?? HEADING_CLASSES[level ?? 2]}`} style={alignStyle(textAlign)}>
          {children}
        </Tag>
      );
    },
    [NODE_PARAGRAPH]: ((children: React.ReactNode, attrs: NodeAttrs) => (
      <p style={alignStyle(attrs?.textAlign)}>{children}</p>
    )) as unknown as (children: React.ReactNode) => React.JSX.Element | null,
    [NODE_UL]: (children) => <ul className="list-disc ms-6 space-y-1">{children}</ul>,
    [NODE_OL]: (children) => <ol className="list-decimal ms-6 space-y-1">{children}</ol>,
    [NODE_LI]: (children) => <li>{children}</li>,
    // The library's default table resolver renders <tr> as a direct child of <table>, which
    // browsers silently "fix" by inserting an implicit <tbody> — causing a hydration mismatch.
    [NODE_TABLE]: (children) => <table><tbody>{children}</tbody></table>,
  }
  };
}

const TABLE_CLASSES = [
  "[&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
  "[&_th]:border [&_th]:border-dark/10 [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-dark",
  "[&_td]:border [&_td]:border-dark/10 [&_td]:p-2 [&_td]:text-dark",
].join(" ");

export function AppRichText({ doc, className, headingClassName, style, market, locale }: Props) {
  if (!doc?.content) return null;
  return (
    <div className={`${TABLE_CLASSES} ${className ?? ""}`} style={style}>
      {renderRichText(doc, buildRenderOptions(market, locale, headingClassName))}
    </div>
  );
}
