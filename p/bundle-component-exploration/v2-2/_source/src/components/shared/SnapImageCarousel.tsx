"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { ImageFallback } from "@/components/shared/ImageFallback";
import { useCarouselScroll } from "@/hooks/useCarouselScroll";

export type SnapCarouselImage = { src: string; alt: string; objectPosition?: string };

type Props = {
  images: SnapCarouselImage[];
  sizes?: string;
  prevLabel?: string;
  nextLabel?: string;
  /** Classes for the outer wrapper. Defaults to a rounded, background-filled square. */
  className?: string;
};

export function SnapImageCarousel({
  images,
  sizes = "100vw",
  prevLabel = "Previous image",
  nextLabel = "Next image",
  className = "relative aspect-square w-full overflow-hidden rounded-md bg-light-grey",
}: Props) {
  const { scrollRef, canScrollLeft, canScrollRight, handleScroll, scrollPrev, scrollNext } = useCarouselScroll({ gap: 0 });
  const [failedIndexes, setFailedIndexes] = useState<Set<number>>(new Set());

  return (
    <div className={className}>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex h-full overflow-x-auto scrollbar-hide snap-x snap-mandatory"
      >
        {images.map((img, i) => (
          <div key={i} className="relative aspect-square w-full shrink-0 snap-start">
            {failedIndexes.has(i) ? (
              <ImageFallback />
            ) : (
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={i === 0}
                className="object-cover"
                style={img.objectPosition ? { objectPosition: img.objectPosition } : undefined}
                sizes={sizes}
                onError={() => setFailedIndexes((prev) => new Set(prev).add(i))}
              />
            )}
          </div>
        ))}
      </div>
      {canScrollLeft && (
        <button
          type="button"
          onClick={scrollPrev}
          aria-label={prevLabel}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md cursor-pointer"
        >
          <ChevronLeftIcon size={10} />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          onClick={scrollNext}
          aria-label={nextLabel}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md cursor-pointer"
        >
          <ChevronRightIcon size={10} />
        </button>
      )}
    </div>
  );
}
