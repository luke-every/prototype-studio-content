import { InfoIcon, ShieldCheckIcon } from "@/components/icons";
import { listOf } from "./copy";
import { orList } from "./highlights";

type Props = {
  /** The allergens they picked, in plain words */
  allergens: string[];
  /** No box could be built without them, so this is the box free of all 14 */
  fallback: boolean;
  /** Said of the whole box under "What's in your box", or of one meal in its recipe */
  scope?: "box" | "meal";
  /** Of the meal: which of their allergens it contains, when it does */
  contains?: string[];
  /** Of the box: how many of its meals contain one */
  mixed?: number;
};

/** Said plainly and on its own, so nobody has to check every meal for what they can't eat */
export function AllergenNote({
  allergens,
  fallback,
  scope = "box",
  contains = [],
  mixed = 0,
}: Props) {
  if (!allergens.length) return null;
  /* a meal they chose that has what they avoid says so, instead of the promise */
  const has = scope === "meal" ? contains.length > 0 : mixed > 0;
  /*
   * Always what they told us they avoid, never "all 14": the fallback box is free from all of them, so it is
   * free from theirs too, and theirs is what they need to hear. Only the box explains the repeats.
   */
  // TODO(lift): replace with translation keys
  const title = has
    ? scope === "meal"
      ? `Contains ${listOf(contains)}`
      : `${mixed} of your meals ${mixed === 1 ? "contains" : "contain"} ${orList(allergens)}`
    : scope === "meal"
      ? `No ${orList(allergens)} in this meal`
      : `No ${orList(allergens)} in any of these meals`;
  const body = has
    ? scope === "box"
      ? "Open a meal to check it. The rest are free from them."
      : null
    : fallback && scope === "box"
      ? `Only a few of our meals avoid ${listOf(allergens)}, so some come more than once.`
      : null;
  return (
    <div
      className={`flex gap-3 rounded-2xl bg-light-brown px-4 py-3.5 ${scope === "box" ? "mt-4" : ""} ${body ? "items-start" : "items-center"}`}
    >
      {has ? (
        <InfoIcon className="size-[22px] shrink-0 text-dark" />
      ) : (
        <ShieldCheckIcon size={22} className="shrink-0 text-dark" />
      )}
      <p className="m-0 flex flex-col gap-0.5">
        <span className="text-sm leading-[18px] font-medium tracking-[-0.28px] text-dark">
          {title}
        </span>
        {body && (
          <span className="text-xs leading-4 tracking-[-0.24px] text-light-text">
            {body}
          </span>
        )}
      </p>
    </div>
  );
}
