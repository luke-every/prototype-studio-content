import { copy } from "./copy";
import { CtaCard } from "./CtaCard";

/** The quiz entry, in the same card as "Build your own box". Pass `className="hidden lg:flex"` where a phone already has the sticky quiz bar in ComparisonFrame. */
export function QuizCta({ className }: { className?: string }) {
  return (
    <CtaCard
      className={className}
      icon={
        <div className="relative overflow-hidden rounded-lg bg-off-white">
          {/* The same crop of the quiz photo as the sticky bar's card */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/quiz-card.png" alt="" className="absolute left-[-66.3%] top-[-20.3%] h-[180%] w-[227.5%] max-w-none" />
        </div>
      }
      title={copy("quiz.title")}
      body={copy("quiz.line")}
      action={copy("quiz.button")}
    />
  );
}
