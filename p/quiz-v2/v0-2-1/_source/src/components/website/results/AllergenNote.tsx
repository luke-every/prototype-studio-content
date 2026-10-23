import { ShieldCheckIcon } from "@/components/icons";
import { listOf } from "./copy";
import { orList } from "./highlights";

type Props = {
  /** The allergens they picked, in plain words */
  allergens: string[];
  /** No box could be built without them, so this is the box free of all 14 */
  fallback: boolean;
};

/** Said plainly and on its own, so nobody has to check every meal for what they can't eat */
export function AllergenNote({ allergens, fallback }: Props) {
  if (!allergens.length && !fallback) return null;
  // TODO(lift): replace with translation keys
  const title = fallback ? "Free from all 14 allergens" : `No ${orList(allergens)} in any of these meals`;
  /* only the fallback needs explaining */
  const body = fallback ? `Not enough meals avoid ${listOf(allergens)} yet, so every meal here is free from all 14 allergens.` : null;
  return (
    <div className={`mt-4 flex gap-3 rounded-2xl bg-light-brown px-4 py-3.5 ${body ? "items-start" : "items-center"}`}>
      <ShieldCheckIcon size={22} className="shrink-0 text-dark" />
      <p className="m-0 flex flex-col gap-0.5">
        <span className="text-sm leading-[18px] font-medium tracking-[-0.28px] text-dark">{title}</span>
        {body && <span className="text-xs leading-4 tracking-[-0.24px] text-light-text">{body}</span>}
      </p>
    </div>
  );
}
