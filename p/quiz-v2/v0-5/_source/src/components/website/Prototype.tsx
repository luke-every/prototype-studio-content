"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Toaster } from "sonner";
import { INGREDIENT_IMAGE_PATHS } from "@/lib/meals/ingredientImages";
import { lastVariant, parseQuizLink, rememberVariant } from "@/lib/quiz-link";
import { HomeStickyBar } from "./home/HomeStickyBar";
import { Homepage } from "./home/Homepage";
import { EMPTY_ANSWERS, QUIZ_IMAGES, stepsFor } from "./quiz/sample-data";
import type { Answers, QuizEntry, ResultsVariant } from "./quiz/types";
import { QuizSheet } from "./QuizSheet";
import type { HeadlineAngle } from "./results/framing";
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

/** What /review posts into the frame when an answer changes */
export const REVIEW_MESSAGE = "review:answers";
/** Where in the flow the review page has the frame: the homepage, the loader, or the results */
export type ReviewFlow = "home" | "loader" | "results";

const subscribeToNothing = () => () => {};
const readSearch = () => window.location.search;
const readServerSearch = () => "";
const onClient = () => true;
const onServer = () => false;

/** The homepage, with the quiz sliding up over it. The query string sets up a test session (see quiz-link). */
export function Prototype() {
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [variant, setVariant] = useState<ResultsVariant>("A");
  const [angle, setAngle] = useState<HeadlineAngle>("identity");
  const [heroCtaGone, setHeroCtaGone] = useState<boolean>(false);
  const [linkSeen, setLinkSeen] = useState<string>("");
  const closeTimer = useRef<number | null>(null);
  const products = useProducts();
  /* the toaster goes into the body, which only exists once the page is on the client */
  const client = useSyncExternalStore(subscribeToNothing, onClient, onServer);

  /* remember the variant only once the link has been read, so the first render's default doesn't count as a switch */
  useEffect(() => {
    if (linkSeen) rememberVariant(variant);
  }, [variant, linkSeen]);

  /*
   * fetch every image the quiz can show while the homepage is up, so no quiz step waits on its image;
   * the recipe's ingredient photos too (about 1MB), which only start loading once a recipe opens otherwise
   */
  useEffect(() => {
    [...QUIZ_IMAGES, ...INGREDIENT_IMAGE_PATHS].forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });
  }, []);

  /** The variant on screen, for the review messages, which arrive outside React's render */
  const shownVariant = useRef<ResultsVariant>(variant);
  useEffect(() => {
    shownVariant.current = variant;
  }, [variant]);
  /** The flow point and tap count last sent by the review page: a new one is a request to go there afresh */
  const shownFlow = useRef<{ flow: ReviewFlow; run: number }>({ flow: "results", run: 0 });

  // TODO(lift): prototype review harness only — /review sends its answers here so the results update in place
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== REVIEW_MESSAGE) return;
      const { answers, variant: next, angle: nextAngle, flow, run } = event.data as {
        answers: Answers;
        variant: ResultsVariant;
        angle: HeadlineAngle;
        flow: ReviewFlow;
        run: number;
      };
      /*
       * E's consultation begins as the loader clears, so switching to E starts a fresh run from the loader;
       * after that, and in every other variant, a changed answer updates what's on screen in place
       */
      const enteredE = next === "E" && shownVariant.current !== "E";
      shownVariant.current = next;
      const moved = flow !== shownFlow.current.flow || run !== shownFlow.current.run;
      shownFlow.current = { flow, run };
      setVariant(next);
      setAngle(nextAngle);
      if (flow === "home") {
        setOpen(false);
        setSession(null);
        return;
      }
      const toLoader = flow === "loader" || enteredE;
      const entry: QuizEntry = { step: stepsFor(answers).length - 1, answers, results: !toLoader };
      const fresh = moved || enteredE;
      setSession((current) => ({ id: fresh ? (current?.id ?? 0) + 1 : (current?.id ?? 1), entry, instant: true }));
      setOpen(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  /* the link is read once the page is on the client; a bare link is the homepage */
  const search = useSyncExternalStore(subscribeToNothing, readSearch, readServerSearch);
  if (search !== linkSeen) {
    setLinkSeen(search);
    const link = parseQuizLink(search, lastVariant());
    setVariant(link.variant);
    setAngle(link.angle);
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
          angle={angle}
          open={open}
          instant={session.instant}
          products={products}
          onClose={closeQuiz}
        />
      )}
      {/*
        from the top, so a toast never covers the sheet or button that set it off; full width on a phone. Put
        beside the sheets in the body, which are portalled there too, so it shows above their dimmed backdrop
      */}
      {client && createPortal(<Toaster position="top-right" richColors />, document.body)}
    </div>
  );
}
