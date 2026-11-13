import Image from "next/image";
import type { Includes } from "./bundles";

/** A window onto part of a box photo, as fractions of the photo. */
export type Crop = { src: string; x: number; y: number; w: number; h: number };

// TODO(lift): sample data — crops of the bundle box photos stand in for a product shot per meal type
export const MEAL_CROPS: Record<keyof Includes, Crop> = {
  // The stack of meal pouches in the Immunity box photo
  mains: { src: "/img/immunity.png", x: 0.069, y: 0.392, w: 0.241, h: 0.28 },
  // The muesli bag in the Weight Balance box photo
  breakfast: { src: "/img/perfect.png", x: 0.039, y: 0.43, w: 0.189, h: 0.22 },
  // The snack balls and crumbles in the Weight Balance box photo
  snacks: { src: "/img/perfect.png", x: 0.445, y: 0.644, w: 0.258, h: 0.3 },
};

/** The crop as a 4:5 thumbnail on a tile colour; `className` sets its size and must keep that ratio. */
export function MealThumb({ crop, tile, className }: { crop: Crop; tile: string; className: string }) {
  return (
    <span className={`relative shrink-0 overflow-clip rounded-lg ${className}`} style={{ backgroundColor: tile }}>
      <span
        className="absolute"
        style={{ left: `${(-crop.x / crop.w) * 100}%`, top: `${(-crop.y / crop.h) * 100}%`, width: `${100 / crop.w}%`, height: `${100 / crop.h}%` }}
      >
        <Image src={crop.src} alt="" fill sizes="240px" className="object-cover" />
      </span>
    </span>
  );
}
