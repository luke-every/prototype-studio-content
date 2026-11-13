import { BuildBoxIcon } from "@/components/icons";
import { Button } from "@/components/shared/Button";

/** The alternative to a bundle: a dashed card under the bundle list that sends the customer to the box builder. */
export function BuildYourOwnBox() {
  return (
    <section className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-light-grey-2 bg-white px-6 py-10 text-center" aria-label="Build your own box">
      <BuildBoxIcon size={56} className="text-dark" />
      <div className="flex max-w-[360px] flex-col gap-2">
        {/* TODO(lift): replace with translation keys */}
        <h3 className="font-book text-2xl leading-7 tracking-[-0.48px] text-near-black">Build your own box</h3>
        <p className="font-sans text-base leading-[22px] tracking-[-0.32px] text-light-text">Pick your own meals and build your box from the ground up instead.</p>
      </div>
      <Button
        type="button"
        sizeClassName="h-12 px-8"
        className="mt-2 justify-center border border-near-black font-sans text-xs font-medium uppercase leading-none tracking-[1.8px] text-near-black"
        aria-label="Build my box"
      >
        {/* TODO(lift): replace with translation key */}
        Build my box
      </Button>
    </section>
  );
}
