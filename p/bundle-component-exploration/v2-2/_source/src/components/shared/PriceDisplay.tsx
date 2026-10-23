import { applyDiscount, calculatePricePerKg, WeightUnit } from "@/lib/pricing";
import { formatPrice, formatWeightUnit } from "@/lib/format";

type Props = {
  weight: number;
  weightUnit: WeightUnit;
  price: number;
  currencyCode: string;
  discountPercentage?: number;
  pricePerKgSuffix?: string;
};

export function PriceDisplay({
  weight,
  weightUnit,
  price,
  currencyCode,
  discountPercentage,
  pricePerKgSuffix = "inc. VAT, inc. shipping",
}: Props) {
  const finalPrice =
    discountPercentage != null ? applyDiscount(price, discountPercentage) : price;
  const pricePerKg = calculatePricePerKg(price, weight, weightUnit);
  const weightLabel = `${weight}${formatWeightUnit(weightUnit)}`;

  return (
    <div className="flex flex-col gap-[6px] font-sans tracking-[-0.32px]">
      <div className="flex items-center gap-[6px]">
        <span className="text-near-black text-base leading-[22px]">
          {formatPrice(finalPrice, currencyCode)}
        </span>
        {discountPercentage != null && (
          <span className="text-light-text text-base leading-[22px] line-through decoration-solid [text-decoration-skip-ink:none]">
            {formatPrice(price, currencyCode)}
          </span>
        )}
        <span className="text-near-black text-base leading-[22px]">
          /{weightLabel}
        </span>
      </div>
      <p className="text-light-text text-base leading-[22px]">
        {formatPrice(pricePerKg, currencyCode)} / Kg {pricePerKgSuffix}
      </p>
    </div>
  );
}
