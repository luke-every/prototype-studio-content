import { BUNDLES } from "./bundles";
import { FACTS } from "./BundleComparisonA.data";
import { BundleCardA, ROW_COUNT } from "./BundleCardA";
import { ComparisonFrame } from "./ComparisonFrame";

/** A: image, name, headline, four facts, Continue. Mobile: every bundle in its own bordered card, led by a tag in the bundle colour. */
export function BundleComparisonA() {
  return (
    <ComparisonFrame>
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0" style={{ gridTemplateRows: `repeat(${ROW_COUNT}, auto)` }}>
        {FACTS.map((f) => {
          const b = BUNDLES.find((x) => x.key === f.key);
          return b ? <BundleCardA key={f.key} f={f} b={b} /> : null;
        })}
      </div>
    </ComparisonFrame>
  );
}
