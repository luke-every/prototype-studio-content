"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeftIcon } from "@/components/icons";
import { PartialFillStars } from "@/components/shared/PartialFillStars";
import { ingredientImage } from "@/lib/meals/ingredientImages";
import { MEALS } from "@/lib/recommendation-data";
import { AllergenNote } from "./AllergenNote";
import { PLACEHOLDER_RECIPE, SAMPLE_REVIEWS } from "./sample-data";
import type { MenuItem, Products } from "./types";

type Props = {
  item: MenuItem;
  products: Products | null;
  /** What they avoid, for a meal chosen around it (from the box or its swaps); none for add-ons, which aren't */
  allergens?: string[];
  /** Which of those allergens this meal has, when they chose one that does */
  containing?: string[];
  /** The box is the one free from all 14 allergens */
  fallback?: boolean;
};

/* the website's AppRichText table, with the modal's fixed columns: the label takes the rest, "Per portion" a little more than "Per 100g" */
const NUTRITION =
  "text-base leading-5.5 tracking-[-0.32px] text-dark [&_b]:font-semibold [&_p]:m-0 [&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse [&_table]:text-sm [&_th]:border [&_th]:border-dark/10 [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-dark [&_td]:border [&_td]:border-dark/10 [&_td]:p-2 [&_td]:text-dark [&_th:not(:first-child)]:text-right [&_td:not(:first-child)]:text-right [&_th:nth-child(2)]:w-[22%] [&_th:nth-child(3)]:w-[24%] lg:[&_th_br]:hidden";

// TODO(lift): fake bio flag — replace with the product's organic attribute
const BIO_SLUGS = ["apple-cinnamon-porridge", "pitaya-smoothie", "vanilla-hazelnut-muesli"];

type Section = "ingredients" | "nutrition";

/**
 * The bundle test's MealDetailModal: the dish's own photograph from Storyblok, square, then its name
 * with its rating, the short description, one macro bar that opens the nutrition table, the curated
 * tags, then ingredients (key ingredients with their photos first) and nutrition, sliding open. From
 * Storyblok when the dish has loaded; placeholder copy otherwise. Then the reviews: the rating and its
 * count from the menu data, and the bundle test's three sample reviews in place of Reviews.io.
 */
export function RecipeDetail({ item, products, allergens = [], containing = [], fallback = false }: Props) {
  const live = products?.[item.slug];
  const rated = MEALS.find((meal) => meal.sku === live?.sku);
  const short = live?.shortDescription;
  const body = live ? live.description : PLACEHOLDER_RECIPE.body;
  const macros = live ? live.macros : PLACEHOLDER_RECIPE.macros;
  const grams = (label: string) => macros.find(([, l]) => l === label)?.[0] ?? null;
  /* always the same four cells, in this order; a missing value shows a dash rather than dropping the cell */
  // TODO(lift): replace with translation keys
  const stats = [
    { label: "Protein", value: grams("PROTEIN"), unit: "g" },
    { label: "Fibre", value: grams("FIBRE"), unit: "g" },
    { label: "Carbs", value: grams("CARBS"), unit: "g" },
    { label: "Kcal", value: live ? live.kcal : PLACEHOLDER_RECIPE.kcal, unit: "" },
  ];
  const tags = live?.curatedTags ?? [];
  const bio = BIO_SLUGS.includes(item.slug);
  const keyIngredients = live?.keyIngredients ?? [];
  const ingredients = (live ? live.ingredients : PLACEHOLDER_RECIPE.ingredients).replace(/<br>/g, " ").replace(/<[^>]+>/g, "");

  const [open, setOpen] = useState<Section[]>(["ingredients"]);
  const [allIngredients, setAllIngredients] = useState<boolean>(false);
  const nutritionRef = useRef<HTMLDivElement>(null);
  const toggle = (section: Section) =>
    setOpen((list) => (list.includes(section) ? list.filter((s) => s !== section) : [...list, section]));
  /*
   * Tapping the macro bar opens the nutrition section and scrolls to 40px above its header. The sheet can't
   * scroll past its own end until the section has grown, so the target is re-measured every frame while it opens.
   */
  const showNutrition = () => {
    setOpen((list) => (list.includes("nutrition") ? list : [...list, "nutrition"]));
    const header = nutritionRef.current;
    const scroller = header?.closest<HTMLElement>(".overflow-y-auto");
    if (!header || !scroller) return;
    const start = scroller.scrollTop;
    const began = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - began) / 400, 1);
      const target = scroller.scrollTop + header.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 40;
      scroller.scrollTop = t < 1 ? start + (target - start) * (1 - (1 - t) ** 3) : target;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <>
      <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-b-[28px] bg-light-grey">
        <Image src={item.image} alt={item.name} fill unoptimized priority sizes="100vw" className="object-cover" />
      </div>

      <div className="flex flex-col bg-white p-6">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                <h2 className="m-0 font-book text-[28px] leading-8 tracking-[-0.56px] text-dark">{item.name}</h2>
                {rated && (
                  <span
                    aria-label={`Rated ${rated.rating.toFixed(1)} from ${rated.reviews} reviews`}
                    className="flex items-center gap-0.5 rounded-full bg-off-white px-2 py-1 text-xs leading-4 tracking-[-0.24px] text-near-black"
                  >
                    <span aria-hidden className="text-signal-orange">
                      ★
                    </span>
                    {rated.rating.toFixed(1)}
                    <span className="text-near-black/60">({rated.reviews.toLocaleString()})</span>
                  </span>
                )}
              </div>
              {/* Storyblok's short description; the long one only where a product has no short one; grey either way, as on the bundle test */}
              {short ? (
                <p className="m-0 text-base leading-5.5 tracking-[-0.32px] text-light-text">{short}</p>
              ) : (
                body && <p className="m-0 text-base leading-5.5 tracking-[-0.32px] text-light-text" dangerouslySetInnerHTML={{ __html: body }} />
              )}
            </div>
            {/* for someone avoiding allergens, said on every meal, so they never have to check one by one */}
            <AllergenNote allergens={allergens} fallback={fallback} scope="meal" contains={containing} />

            {/* one row: a single bar, cells split by white dividers */}
            <button
              type="button"
              onClick={showNutrition}
              disabled={!live?.nutrition}
              aria-label="Nutritional values"
              className="flex w-full cursor-pointer overflow-hidden rounded-[18px] border border-white bg-off-white p-0 disabled:cursor-default lg:max-w-[345px]"
            >
              {stats.map((stat, i) => (
                <span key={stat.label} className={`flex min-w-0 flex-1 flex-col items-center px-3 py-4 ${i > 0 ? "border-l-2 border-white" : ""}`}>
                  <span className="flex items-baseline gap-0.5">
                    <span className="font-book text-2xl leading-[26px] tracking-[-0.48px] text-dark">{stat.value ?? "–"}</span>
                    {stat.value && stat.unit && <span className="text-sm leading-[19px] tracking-[-0.28px] text-light-text">{stat.unit}</span>}
                  </span>
                  <span className="text-sm leading-[19px] tracking-[-0.28px] text-light-text/60">{stat.label}</span>
                </span>
              ))}
            </button>

            {(tags.length > 0 || bio) && (
              <div className="flex flex-wrap items-center gap-2">
                {bio && (
                  <span className="flex items-center gap-1 rounded-full border border-off-white px-3 py-1 text-xs leading-4 tracking-[-0.24px] text-near-black/60">
                    {/* 2x asset, shown at half size (16px tall) */}
                    <Image src="img/bio-label.png" alt="" width={28} height={16} unoptimized className="h-4 w-auto" />
                    {/* TODO(lift): replace with translation key */}
                    Bio
                  </span>
                )}
                {tags.map((tag) => (
                  <Chip key={tag} label={tag} />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            {/* TODO(lift): replace with translation key */}
            <SectionToggle label="Ingredients" open={open.includes("ingredients")} onToggle={() => toggle("ingredients")}>
              <div className="flex flex-col gap-4">
                {keyIngredients.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {keyIngredients.map((key) => {
                      const src = ingredientImage(key.name);
                      return (
                        <div key={key.name} className="flex items-start gap-3 rounded-2xl border border-light-grey p-3">
                          <div aria-hidden className="relative size-16 shrink-0 overflow-hidden rounded-[14px] bg-light-brown">
                            {src && <Image src={src} alt="" fill unoptimized loading="eager" sizes="64px" className="object-cover" />}
                          </div>
                          {/* at least as tall as the photo: short copy centres beside it, longer copy grows the box and starts at the top */}
                          <div className="flex min-h-16 min-w-0 flex-1 items-center">
                            <p className="m-0 text-sm leading-[19px] tracking-[-0.28px] text-dark">
                              {key.name}.<span className="text-dark/60"> {key.text}</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {ingredients && (
                  <div className="relative pt-2 text-sm leading-[19px] tracking-[-0.28px]">
                    {/* collapsed: two lines tall, with "read more" sitting over the end of the second line */}
                    <p className={`m-0 ${allIngredients ? "" : "max-h-[38px] overflow-hidden"}`}>
                      {/* TODO(lift): replace with translation key */}
                      <span className="text-near-black">Full ingredients: </span>
                      <span className="text-dark/60">{ingredients}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setAllIngredients((v) => !v)}
                      aria-expanded={allIngredients}
                      className={`cursor-pointer p-0 text-sm leading-[19px] text-dark underline ${allIngredients ? "mt-1 block" : "absolute right-0 bottom-0 bg-white pl-1"}`}
                    >
                      {/* TODO(lift): replace with translation key */}
                      {allIngredients ? "read less" : "read more"}
                    </button>
                  </div>
                )}
                {live && live.withoutTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {live.withoutTags.map((tag) => (
                      <Chip key={tag} label={tag} />
                    ))}
                  </div>
                )}
              </div>
            </SectionToggle>

            {live?.nutrition && (
              <>
                <div className="h-px shrink-0 bg-light-grey" />
                <div ref={nutritionRef} className="flex flex-col">
                  {/* TODO(lift): replace with translation key */}
                  <SectionToggle label="Nutritional Values" open={open.includes("nutrition")} onToggle={() => toggle("nutrition")}>
                    <div className={NUTRITION} dangerouslySetInnerHTML={{ __html: live.nutrition }} />
                  </SectionToggle>
                </div>
              </>
            )}

            {rated && (
              <>
                <div className="h-px shrink-0 bg-light-grey" />
                {/* TODO(lift): replace with translation key */}
                <section aria-label="Customer reviews" className="flex flex-col">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="font-book text-[34px] leading-8.5 tracking-[-0.68px] text-dark">
                      {rated.rating.toFixed(1).replace(".", ",")}
                    </span>
                    <div className="flex flex-col">
                      <PartialFillStars average={rated.rating} />
                      {/* TODO(lift): replace with translation key */}
                      <span className="text-xs leading-4">{rated.reviews.toLocaleString()} reviews</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {SAMPLE_REVIEWS.map((review) => (
                      <div
                        key={review.name}
                        className="flex flex-col gap-2 rounded-[14px] border border-light-grey bg-off-white p-4.25 shadow-[0px_1px_1.5px] shadow-dark/6"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs leading-4 font-medium tracking-[-0.24px] text-dark">{review.name}</span>
                          <PartialFillStars average={review.rating} size={12} />
                        </div>
                        <p className="m-0 text-xs leading-4 tracking-[-0.24px] text-dark">{review.comments}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// TODO(lift): Tag has no frame-only variant yet; this matches the recipe design (no fill, off-white frame)
function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-off-white px-3 py-1 text-xs leading-4 tracking-[-0.24px] text-near-black/60 capitalize">
      {label}
    </span>
  );
}

type SectionProps = {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

/** Always mounted so it can animate: the grid row slides between 0fr and 1fr, and the closed body is inert */
function SectionToggle({ label, open, onToggle, children }: SectionProps) {
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 p-0 text-left"
      >
        <span className="text-base leading-[22px] font-medium tracking-[-0.32px] text-near-black">{label}</span>
        <span aria-hidden className="flex shrink-0 items-center justify-center py-2 pe-1">
          <ChevronLeftIcon size={8} stroke="currentColor" className={`text-light-grey-2 transition-transform ${open ? "rotate-90" : "-rotate-90"}`} />
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        inert={!open}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
