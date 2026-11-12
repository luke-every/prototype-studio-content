import type { ReactNode } from "react";
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
  /** Outlined on the white page, or filled with the nutrition tiles' tint on the goal's colour */
  tone?: "outline" | "tint";
};

type LineProps = {
  /** An allergy they chose to avoid is what the meal contains, so it says so with an info mark instead of a shield */
  icon?: "shield" | "info";
  children: ReactNode;
  /** A smaller line under it */
  detail?: string | null;
};

/** One quiet line about allergens, with its icon: the same wherever allergens are said (the taste profile, the box, a meal) */
export function AllergenLine({ icon = "shield", children, detail }: LineProps) {
  return (
    <p className="m-0 flex items-start gap-2 text-sm leading-[18px] tracking-[-0.28px] text-light-text">
      {icon === "info" ? (
        <InfoIcon className="mt-px size-4 shrink-0" />
      ) : (
        <ShieldCheckIcon size={16} className="mt-px shrink-0" />
      )}
      <span className="flex flex-col gap-0.5">
        <span>{children}</span>
        {detail && (
          <span className="text-xs leading-4 tracking-[-0.24px]">{detail}</span>
        )}
      </span>
    </p>
  );
}

/** Said plainly and on its own, so nobody has to check every meal for what they can't eat */
export function AllergenNote({
  allergens,
  fallback,
  scope = "box",
  contains = [],
  mixed = 0,
  tone = "outline",
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
      className={`rounded-2xl px-4 py-3.5 ${tone === "tint" ? "bg-dark/6" : "border border-light-brown"} ${scope === "box" ? "mt-4" : ""}`}
    >
      <AllergenLine icon={has ? "info" : "shield"} detail={body}>
        {title}
      </AllergenLine>
    </div>
  );
}
