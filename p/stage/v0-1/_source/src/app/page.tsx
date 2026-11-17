"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { stories } from "@/lib/stage-registry";

type Shown = { Component: React.ComponentType<Record<string, unknown>>; args: Record<string, unknown> } | { error: string } | null;

/**
 * One real component of the website on an empty stage, for the studio's canvas to place and edit:
 *   ?id=shared-button--dark          a story, by its Storybook id (its example props)
 *   &props={"children":"Order now"}  props to change, as JSON
 */
function Stage() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const raw = params.get("props") ?? "";
  const story = stories[id];
  const [loaded, setShown] = useState<Shown>(null);
  // An unknown id is told at once; a known one is shown when its story has loaded.
  const shown: Shown = story ? loaded : { error: id ? `No story called ${id}.` : "Choose a component." };

  useEffect(() => {
    if (!story) return undefined;
    let stale = false;
    story
      .load()
      .then((module) => {
        if (stale) return;
        const one = module[story.name] as { args?: Record<string, unknown>; render?: (args: Record<string, unknown>) => React.ReactNode } | undefined;
        let over: Record<string, unknown> = {};
        try {
          over = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
        } catch {
          // Props that don't parse change nothing.
        }
        const args = { ...module.default.args, ...one?.args, ...over };
        const Component = one?.render ? function Rendered(props: Record<string, unknown>) { return <>{one.render!(props)}</>; } : (module.default.component as React.ComponentType<Record<string, unknown>> | undefined);
        setShown(Component ? { Component, args } : { error: `${id} has nothing to draw.` });
      })
      .catch((error: unknown) => !stale && setShown({ error: error instanceof Error ? error.message : "It didn't load." }));
    return () => {
      stale = true;
    };
  }, [story, id, raw]);

  if (!shown) return null;
  if ("error" in shown) return <p className="p-6 text-sm text-light-text">{shown.error}</p>;
  // The component sits at its own size in the corner, so a screen can be as small as the component is.
  return (
    <div data-stage className="inline-block">
      <shown.Component {...shown.args} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Stage />
    </Suspense>
  );
}
