import { BuildBoxIcon } from "@/components/icons";
import { CtaCard } from "./CtaCard";

/** The alternative to a bundle: a dashed card under the bundle list that sends the customer to the box builder. */
export function BuildYourOwnBox({ layout = "stack" }: { layout?: "stack" | "row" }) {
  return (
    // TODO(lift): replace with translation keys
    <CtaCard layout={layout} icon={<BuildBoxIcon size={56} className="text-dark" />} title="Build your own box" body="Find your perfect fit with over 30+ meals" action="Choose my meals" />
  );
}
