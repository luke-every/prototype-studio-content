"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Toaster } from "sonner";
import { lastVariant, parseQuizLink, rememberVariant } from "@/lib/quiz-link";
import { HomeStickyBar } from "./home/HomeStickyBar";
import { Homepage } from "./home/Homepage";
import { EMPTY_ANSWERS, QUIZ_IMAGES } from "./quiz/sample-data";
import type { QuizEntry, ResultsVariant } from "./quiz/types";
import { QuizSheet } from "./QuizSheet";
import { useProducts } from "./results/useProducts";

type Session = {
  id: number;
  entry: QuizEntry;
  /** Opened by the link, so it is already up rather than rising */
  instant: boolean;
};

const FRESH_ENTRY: QuizEntry = { step: 0, answers: EMPTY_ANSWERS, results: false };

/** How long the sheet takes to go back down before the run is thrown away */
const CLOSE_MS = 640;

const subscribeToNothing = () => () => {};
const readSearch = () => window.location.search;
const readServerSearch = () => "";

/** The homepage, with the quiz sliding up over it. The query string sets up a test session (see quiz-link). */
export function Prototype() {
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [variant, setVariant] = useState<ResultsVariant>("A");
  const [heroCtaGone, setHeroCtaGone] = useState<boolean>(false);
  const [linkSeen, setLinkSeen] = useState<string>("");
  const closeTimer = useRef<number | null>(null);
  const products = useProducts();

  /* remember the variant only once the link has been read, so the first render's default doesn't count as a switch */
  useEffect(() => {
    if (linkSeen) rememberVariant(variant);
  }, [variant, linkSeen]);

  /* fetch every image the quiz can show while the homepage is up, so no quiz step waits on its image */
  useEffect(() => {
    QUIZ_IMAGES.forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });
  }, []);

  /* the link is read once the page is on the client; a bare link is the homepage */
  const search = useSyncExternalStore(subscribeToNothing, readSearch, readServerSearch);
  if (search !== linkSeen) {
    setLinkSeen(search);
    const link = parseQuizLink(search, lastVariant());
    setVariant(link.variant);
    if (link.entry) {
      setSession({ id: 1, entry: link.entry, instant: true });
      setOpen(true);
    }
  }

  const openQuiz = () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    setSession((current) => ({ id: (current?.id ?? 0) + 1, entry: FRESH_ENTRY, instant: false }));
    setOpen(true);
  };

  const closeQuiz = () => {
    setOpen(false);
    /* thrown away only once the sheet has gone, so nothing flickers on the way down */
    closeTimer.current = window.setTimeout(() => setSession(null), CLOSE_MS);
  };

  return (
    <div className="fixed inset-0 touch-manipulation overflow-hidden overscroll-none bg-white">
      <Homepage onOpenQuiz={openQuiz} onHeroCtaGone={setHeroCtaGone} />
      {/* the ground the quiz rises over; it dims the homepage instead of the homepage shrinking back */}
      <div
        className={`pointer-events-none absolute inset-0 z-30 bg-near-black/45 transition-opacity duration-[450ms] ease-ui ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <HomeStickyBar visible={heroCtaGone && !open} onOpenQuiz={openQuiz} />
      {session && (
        <QuizSheet
          key={session.id}
          entry={session.entry}
          variant={variant}
          open={open}
          instant={session.instant}
          products={products}
          onClose={closeQuiz}
        />
      )}
      <Toaster position="bottom-center" offset={96} />
    </div>
  );
}
