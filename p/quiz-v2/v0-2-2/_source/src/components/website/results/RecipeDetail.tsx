import Image from "next/image";
import { ChevronLeftIcon } from "@/components/icons";
import { PLACEHOLDER_RECIPE } from "./sample-data";
import type { MenuItem, Products } from "./types";

type Props = {
  item: MenuItem;
  products: Products | null;
};

const DOC =
  "pb-5 text-base leading-[22px] tracking-[-0.32px] text-dark [&_ol]:m-0 [&_ol]:list-decimal [&_ol]:pl-[1.2em] [&_p]:m-0 [&_p+p]:mt-2 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:py-2 [&_td]:pr-4 [&_td]:pl-0 [&_td]:text-left [&_th]:py-2 [&_th]:pr-4 [&_th]:pl-0 [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_tr]:border-b [&_tr]:border-light-grey [&_ul]:m-0 [&_ul]:list-disc [&_ul]:pl-[1.2em]";

/**
 * Laid out like the website's MealDetailModal: photograph, name, description, macro tiles, tags, then
 * collapsible sections. Everything comes from Storyblok when the dish has a slug and the data has
 * loaded; placeholder copy stands in otherwise. There are no ratings or reviews here.
 */
export function RecipeDetail({ item, products }: Props) {
  const live = products?.[item.slug];
  const body = live ? live.description : PLACEHOLDER_RECIPE.body;
  /* a macro the API doesn't have is left out, not made up */
  const macros = (live ? live.macros : PLACEHOLDER_RECIPE.macros).filter(([value]) => value != null);
  const tags = live?.tags ?? [];
  const sections: [string, string | undefined][] = [
    ["Ingredients", live ? live.ingredients : PLACEHOLDER_RECIPE.ingredients],
    ["Nutritional values", live?.nutrition],
    ["Preparation", live?.preparation],
    ["Key ingredients", live?.highlights],
  ];
  return (
    <>
      <div className="relative h-[220px] shrink-0 bg-light-grey lg:h-[330px]">
        <Image src={item.image} alt={item.name} fill sizes="560px" className="object-cover" />
        {/* the grab handle sits on the photograph */}
        <span className="absolute top-2 left-1/2 -ml-5 h-1 w-10 rounded-full bg-white/70 lg:hidden" />
      </div>
      <div className="flex flex-col gap-4 bg-white px-6 py-8">
        <h2 className="m-0 font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">{item.name}</h2>
        {body && <p className="m-0 text-base leading-[22px] tracking-[-0.32px] text-dark" dangerouslySetInnerHTML={{ __html: body }} />}
        {macros.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {macros.map(([value, label]) => (
              <div
                key={label}
                className="flex h-[73px] min-w-20 flex-col items-center justify-center gap-1 rounded-[14px] bg-dark/6 p-3 lg:h-[83px] lg:w-[120px]"
              >
                <p className="m-0 flex items-baseline gap-0.5">
                  <b className="font-book text-2xl leading-[26px] font-normal tracking-[-0.48px] text-dark lg:text-[34px] lg:leading-[34px] lg:tracking-[-0.68px]">
                    {value}
                  </b>
                  <s className="text-sm leading-[19px] tracking-[-0.28px] text-dark/65 no-underline">g</s>
                </p>
                <span className="text-sm leading-[19px] tracking-[-0.28px] text-dark/60 uppercase">{label}</span>
              </div>
            ))}
          </div>
        )}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full border border-light-grey bg-dark/6 px-3 py-1 text-xs leading-4 text-dark">
                {tag}
              </span>
            ))}
          </div>
        )}
        {/* collapsible sections: one open at a time (details sharing a name) */}
        <div className="border-t border-light-grey">
          {sections
            .filter(([, html]) => html)
            .map(([label, html]) => (
              <details key={label} name="mealinfo" className="group border-b border-light-grey">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-2 text-xs font-medium text-dark uppercase [&::-webkit-details-marker]:hidden">
                  <span>{label}</span>
                  <ChevronLeftIcon
                    size={8}
                    stroke="currentColor"
                    className="mx-1 my-2 shrink-0 -rotate-90 text-light-grey-2 transition-transform duration-200 ease-ui group-open:rotate-90"
                  />
                </summary>
                <div className={DOC} dangerouslySetInnerHTML={{ __html: html ?? "" }} />
              </details>
            ))}
        </div>
      </div>
    </>
  );
}
