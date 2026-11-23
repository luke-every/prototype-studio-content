import Image from "next/image";
import { TrashFilledIcon } from "@/components/icons";
import { formatPrice } from "@/lib/format";
import { usePublicTranslations } from "@/providers/PublicTranslationsProvider";

type Props = {
  title: string;
  quantity: number;
  image: string;
  /** List price of all of them, struck through next to "Free" */
  listPrice: number;
  currencyCode: string;
};

/**
 * Port of every-website `src/components/website/cart-v2/GiftBoxCard.tsx`: a free gift as its own "Complimentary" box card, with
 * the inert trash button production shows. Plain props instead of a `CartLine`, and no image-error fallback.
 */
export function GiftBoxCard({ title, quantity, image, listPrice, currencyCode }: Props) {
  const t = usePublicTranslations().cart;

  return (
    <div className="flex w-full items-start justify-between gap-3 rounded-[12px] border border-light-grey bg-light-brown p-3 shadow-[0px_4px_6px_rgba(0,0,0,0.25)]">
      <div className="flex flex-1 items-start gap-3">
        <div className="relative size-[60px] shrink-0 overflow-hidden rounded-[10px] bg-light-grey">
          <Image src={image} alt={title} fill unoptimized className="object-cover" sizes="60px" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <span className="font-sans text-sm font-medium leading-[15px] tracking-[-0.28px] text-near-black">{t.complimentary}</span>
          <span className="font-book text-lg leading-[18px] tracking-[-0.36px] text-near-black">{`${quantity} ${title}`}</span>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="font-book text-lg leading-[18px] tracking-[-0.36px] text-savings-green">{t.summaryShippingFree}</span>
        <span className="font-book text-lg leading-[18px] tracking-[-0.36px] text-light-text line-through">{formatPrice(listPrice, currencyCode, { space: true })}</span>
        <button
          type="button"
          disabled
          aria-disabled="true"
          aria-label={t.giftRemoveAriaLabel}
          className="flex size-[38px] cursor-not-allowed items-center justify-center rounded-[8px] border-[1.5px] border-near-black/10 bg-white text-dark opacity-40"
        >
          <TrashFilledIcon size={14} />
        </button>
      </div>
    </div>
  );
}
