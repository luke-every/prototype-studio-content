import { Button } from "@/components/shared/Button";

/** New, no production counterpart: the add-to-cart button and delivery note under the price breakdown (Figma "div.sticky-cta-inner"). */
export function BundleCta() {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* TODO(lift): fake add to cart */}
      <Button type="button" variant="dark" aria-label="Add to cart" sizeClassName="h-10 w-full justify-center px-4" className="text-xs font-medium uppercase leading-none tracking-[1.8px]">
        {/* TODO(lift): replace with translation key */}
        Add to cart
      </Button>
      {/* TODO(lift): replace with translation key */}
      <p className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark">Delivered in 2-3 days • Skip or cancel anytime</p>
    </div>
  );
}
