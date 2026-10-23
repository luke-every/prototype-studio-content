import Image from "next/image";
import { shopifyImageUrl } from "@/lib/shopify/image";

type OrderMealRowProps = {
  title: string;
  imageUrl: string | null;
  reviewed: boolean;
  onReview?: () => void;
  onInfo?: () => void;
};

export function OrderMealRow({ title, imageUrl, onInfo }: OrderMealRowProps) {
  return (
    <div
      className={`flex items-center gap-4 py-3 border-b border-light-grey ${onInfo ? "cursor-pointer" : ""}`}
      onClick={onInfo}
    >
      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-light-grey">
        {imageUrl ? (
          <Image src={shopifyImageUrl(imageUrl, 80) ?? imageUrl} alt={title} fill unoptimized sizes="48px" className="object-cover" />
        ) : (
          <div className="h-full w-full bg-light-grey" aria-hidden="true" />
        )}
      </div>

      <p className="flex-1 text-base text-dark">{title}</p>
    </div>
  );
}
