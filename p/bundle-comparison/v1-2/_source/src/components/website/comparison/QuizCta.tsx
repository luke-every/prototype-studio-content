import { CtaCard } from "./CtaCard";

/** The quiz entry, in the same card as "Build your own box". Stacked layout: desktop only, since on a phone the quiz is the sticky bar in ComparisonFrame. Row layout: on every screen size. */
export function QuizCta({ layout = "stack" }: { layout?: "stack" | "row" }) {
  return (
    // TODO(lift): replace with translation keys
    <CtaCard
      layout={layout}
      className={layout === "stack" ? "hidden lg:flex" : ""}
      icon={
        <div className="relative overflow-hidden rounded-lg bg-off-white">
          {/* The same crop of the quiz photo as the sticky bar's card */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/quiz-card.png" alt="" className="absolute left-[-66.3%] top-[-20.3%] h-[180%] w-[227.5%] max-w-none" />
        </div>
      }
      title="Unsure where to start?"
      body="Get matched to the right bundle"
      action="Take the quiz"
    />
  );
}
