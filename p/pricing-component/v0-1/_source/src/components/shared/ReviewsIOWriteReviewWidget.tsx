// PROTOTYPE SHIM — not the production file. Same export names/signatures as every-website so callers lift back unchanged;
// swap this file for the real one when the code moves into the app.
// Production embeds reviews.io's third-party "Write review" widget here.

type Props = {
  sku: string | null | undefined;
  locale?: string | null;
  className?: string;
};

export function ReviewsIOWriteReviewWidget({ className = "w-full" }: Props) {
  return (
    <div className={`${className} rounded-xl border border-dashed border-light-grey-3 p-4 text-center text-sm text-light-text`}>
      {/* TODO(lift): reviews.io write-review widget */}
      Write a review (reviews.io widget)
    </div>
  );
}
