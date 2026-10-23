import type { BundleKey } from "../quiz/types";
import { FaqItem } from "./FaqItem";
import { OtherBundles } from "./OtherBundles";
import { FAQ } from "./sample-data";

type Props = {
  bundle: BundleKey;
};

/** Questions, then the other bundles, on white */
export function FaqSection({ bundle }: Props) {
  return (
    <div className="rounded-t-[32px] bg-white py-12">
      <div className="px-6 pb-6">
        <div className="mb-12 flex flex-col gap-3">
          {/* TODO(lift): replace with translation key */}
          <p className="m-0 text-xs leading-4 font-medium tracking-[-0.24px] text-dark">COMMON QUESTIONS</p>
          {/* TODO(lift): replace with translation key */}
          <h2 className="m-0 font-book text-2xl leading-[26px] tracking-[-0.48px] text-dark">Dig a little deeper</h2>
        </div>
        {FAQ.map(([question, answer]) => (
          <FaqItem key={question} question={question} answer={answer} />
        ))}
      </div>
      <OtherBundles bundle={bundle} />
    </div>
  );
}
