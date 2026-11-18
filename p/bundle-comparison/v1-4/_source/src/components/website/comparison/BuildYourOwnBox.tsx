import { BuildBoxIcon } from "@/components/icons";
import { copy } from "./copy";
import { CtaCard } from "./CtaCard";

/** The alternative to a bundle: a card under the bundle list that sends the customer to the box builder. */
export function BuildYourOwnBox() {
  return (
    <CtaCard icon={<BuildBoxIcon size={24} className="text-dark" />} title={copy("build.title")} body={copy("build.line")} action={copy("build.button")} />
  );
}
