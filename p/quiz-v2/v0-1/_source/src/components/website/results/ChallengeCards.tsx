import Image from "next/image";
import type { ChallengeId } from "../quiz/types";
import { Headline } from "./Headline";
import { CARD_IMAGES, CHALLENGE_CARDS, CHALLENGE_HEADLINE, SHARED_CARDS } from "./sample-data";

type Props = {
  challenge: ChallengeId;
};

/** Variant B's argument for the bundle: a headline for the challenge picked first, and four cards. */
export function ChallengeCards({ challenge }: Props) {
  const cards = [...CHALLENGE_CARDS[challenge], ...SHARED_CARDS];
  return (
    <div className="flex flex-col gap-5 bg-white py-14">
      <h2 className="mx-6 my-0 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">
        <Headline text={CHALLENGE_HEADLINE[challenge]} />
      </h2>
      {/* each card is as tall as its own text */}
      <div className="scrollbar-hide flex snap-x snap-mandatory scroll-pl-6 items-start gap-3 overflow-x-auto px-6 pt-1">
        {cards.map(([lead, rest], i) => (
          <div key={lead} className="flex w-[250px] shrink-0 snap-start flex-col overflow-hidden rounded-[20px] bg-light-grey">
            <div className="relative h-[220px]">
              <Image src={CARD_IMAGES[i]} alt="" fill sizes="250px" className="object-cover" />
            </div>
            <p className="m-0 px-4 pb-6 text-sm leading-[19px] tracking-[-0.28px] text-dark/60">
              <b className="font-medium text-dark">{lead}</b> <span>{rest}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
