import { CtaCard } from "./CtaCard";

/** The quiz entry on desktop, in the same card as "Build your own box". On a phone the quiz stays the sticky bar in ComparisonFrame, so this is hidden there. */
export function QuizCta() {
  return (
    // TODO(lift): replace with translation keys
    <CtaCard
      className="hidden lg:flex"
      icon={
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-off-white lg:size-8">
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
