import { revealMotion } from "@/lib/step-motion";
import { heroPhotos, marqueePhotos } from "@/lib/photos";
import type { Answers, BundleKey, ResultsVariant } from "../quiz/types";
import { AnswerChips } from "./AnswerChips";
import { HeroCarousel } from "./HeroCarousel";
import { PhotoMarquee } from "./PhotoMarquee";
import { BUNDLE_NAME, BUNDLE_SUB, BUNDLE_SUB_B } from "./sample-data";

type Props = {
  ref?: React.Ref<HTMLDivElement>;
  goal: BundleKey;
  answers: Answers;
  variant: ResultsVariant;
  /** The loader has cleared: the hero's elements arrive */
  revealed: boolean;
  /** Arrived without a loader, so nothing animates in */
  instant: boolean;
};

/** "Your best match": variant A carries a carousel of the bundle's photographs, variant B a marquee. */
export function ResultsHero({ ref, goal, answers, variant, revealed, instant }: Props) {
  const title = revealMotion(0, revealed, instant);
  const chips = revealMotion(1, revealed, instant);
  const photos = revealMotion(2, revealed, instant);
  const sub = revealMotion(3, revealed, instant);
  return (
    <div ref={ref} className="relative -mt-8 flex flex-col gap-6 overflow-hidden rounded-[32px] bg-(--bundle) py-10">
      {/* TODO(lift): replace with translation key */}
      <h1
        className={`mx-6 my-0 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark ${title.className}`}
        style={title.style}
      >
        Your best match:
        <br />
        <i className="font-book-italic">{BUNDLE_NAME[goal]}</i>
      </h1>
      <AnswerChips goal={goal} answers={answers} className={chips.className} style={chips.style} />
      {variant === "B" ? (
        <PhotoMarquee photos={marqueePhotos(goal)} className={photos.className} style={photos.style} />
      ) : (
        <HeroCarousel photos={heroPhotos(goal)} className={photos.className} style={photos.style} />
      )}
      <p
        className={`mx-6 my-0 text-base leading-[22px] tracking-[-0.32px] text-dark ${sub.className}`}
        style={sub.style}
      >
        {variant === "B" ? BUNDLE_SUB_B[goal] : BUNDLE_SUB[goal]}
      </p>
    </div>
  );
}
