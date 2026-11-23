import { COPY } from "@/lib/copy";

export type CartGift = {
  title: string;
  quantity: number;
  image: string;
  /** List price of one */
  unitListPrice: number;
};

// TODO(lift): sample data — free gifts come from the bundle's free-gift configuration (freeGiftMealsByBundleId)
export const CART_GIFTS: CartGift[] = [
  { title: COPY.cartNew.gifts[0].name, quantity: 2, image: COPY.images.cartGifts[0], unitListPrice: 10.99 },
  { title: COPY.cartNew.gifts[1].name, quantity: 1, image: COPY.images.cartGifts[1], unitListPrice: 9.99 },
];

/** What the gifts would cost at list price, for the struck-through total */
export const giftRetailTotal = (): number => CART_GIFTS.reduce((sum, g) => sum + g.unitListPrice * g.quantity, 0);
