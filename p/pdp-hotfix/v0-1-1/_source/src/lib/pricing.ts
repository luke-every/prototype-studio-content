export type WeightUnit = "GRAMS" | "KILOGRAMS";

export function applyDiscount(price: number, discountPercentage: number): number {
  return price * (1 - discountPercentage / 100);
}

export function calculatePricePerKg(price: number, weight: number, weightUnit: WeightUnit): number {
  const weightInKg = weightUnit === "GRAMS" ? weight / 1000 : weight;
  return price / weightInKg;
}

export function isFreeM(price: string | null): boolean {
  return !price || parseFloat(price) === 0;
}
