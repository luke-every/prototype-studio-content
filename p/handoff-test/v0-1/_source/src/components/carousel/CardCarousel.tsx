import Image from "next/image";
import { Button } from "@/components/shared/Button";
import { CARDS } from "./carousel.data";

export function CardCarousel() {
  return (
    <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 lg:gap-6">
      {CARDS.map((card) => (
        <li key={card.id} className="w-[260px] shrink-0 snap-start md:w-auto">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-light-grey">
            <Image src={card.image} alt={card.title} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 260px" className="object-cover" />
          </div>
          <h3 className="mt-4 font-book text-[22px] leading-[24px] tracking-[-0.44px] text-near-black">{card.title}</h3>
          <Button variant="dark" href={card.href} className="mt-3" aria-label={`Shop ${card.title}`}>
            {/* TODO(lift): replace with translation key */}
            Shop now
          </Button>
        </li>
      ))}
    </ul>
  );
}
