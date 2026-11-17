import { BuildBoxIcon } from "@/components/icons";
import { copy } from "./copy";
import { CtaCard } from "./CtaCard";

/** The alternative to a bundle: a dashed card under the bundle list that sends the customer to the box builder. */
export function BuildYourOwnBox({ layout = "stack" }: { layout?: "stack" | "row" }) {
  return (
    <CtaCard layout={layout} icon={<BuildBoxIcon size={56} className="text-dark" />} title={copy("build.title")} body={copy("build.line")} action={copy("build.button")} />
  );
}
