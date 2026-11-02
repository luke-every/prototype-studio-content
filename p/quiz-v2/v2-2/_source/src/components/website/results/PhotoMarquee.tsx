import Image from "next/image";

type Props = {
  /** The set twice over, so the loop closes on itself */
  photos: string[];
  className?: string;
  style?: React.CSSProperties;
};

/** The bundle's own photographs, drifting slowly past, edge to edge. Holding the pointer over it pauses it. */
export function PhotoMarquee({ photos, className, style }: Props) {
  return (
    <div className={`group overflow-hidden ${className ?? ""}`} style={style}>
      <div className="flex w-max animate-mq-drift gap-4 group-hover:[animation-play-state:paused]">
        {photos.map((src, i) => (
          <div key={`${src}-${i}`} className="relative h-[264px] w-[211px] shrink-0 overflow-hidden rounded-2xl bg-white">
            <Image src={src} alt="" fill sizes="211px" loading="eager" className="object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
