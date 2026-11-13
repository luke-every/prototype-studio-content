import { BuildBoxIcon } from "@/components/icons";
import { CtaCard } from "./CtaCard";

/** The alternative to a bundle: a dashed card under the bundle list that sends the customer to the box builder. */
export function BuildYourOwnBox() {
  return (
    // TODO(lift): replace with translation keys
    <CtaCard icon={<BuildBoxIcon size={56} className="shrink-0 text-dark lg:size-8" />} title="Build your own box" body="Find your perfect fit with over 30+ meals" action="Choose my meals" />
  );
}
