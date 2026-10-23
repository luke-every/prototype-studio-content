import Image from "next/image";

type Props = {
  photos: string[];
  className?: string;
  style?: React.CSSProperties;
};

/** The hero's photographs, held to the left so the next one is only just showing. It snaps, so a swipe lands on a picture. */
export function HeroCarousel({ photos, className, style }: Props) {
  return (
    <div
      className={`scrollbar-hide flex snap-x snap-mandatory scroll-pl-6 gap-4 overflow-x-auto px-6 ${className ?? ""}`}
      style={style}
    >
      {photos.map((src) => (
        <div
          key={src}
          className="relative aspect-square shrink-0 grow-0 basis-[80vw] snap-start overflow-hidden rounded-[20px] bg-white lg:basis-[324px]"
        >
          <Image src={src} alt="" fill sizes="324px" className="object-cover" />
        </div>
      ))}
    </div>
  );
}
