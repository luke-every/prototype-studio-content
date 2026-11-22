// Markup taken out of src/components/website/bundle-v3/BundleContent.tsx:94 as it was drawn (a snapshot) for this project. It stands on its own and doesn't run. The original is not touched: what is changed here is what is proposed.

export function BundleContentSnapshot2() {
  return (
    <div className="rounded-t-[32px] px-6 pt-8 lg:rounded-none lg:p-0" style={{ backgroundColor: "rgba(215, 235, 194, 0.5)" }}>
      <div className="lg:pointer-events-none lg:absolute lg:inset-0 lg:z-20">
        <div className="lg:mx-auto lg:h-full lg:max-w-[1440px] lg:px-40 lg:pt-[calc(4rem+var(--header-overlay-h,138px))]">
          <aside className="flex flex-col gap-6 lg:pointer-events-auto lg:sticky lg:top-[calc(1rem+var(--header-overlay-h,138px))] lg:ml-auto lg:w-[352px] lg:pb-6">
            <div className="flex flex-col gap-6 lg:rounded-[32px] lg:bg-white lg:p-8 lg:shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
              <h2 className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">
                {"What's in your box?"}
              </h2>
              <div role="radiogroup" aria-label="What's in your box?" className="flex flex-col gap-2">
                <button type="button" role="radio" aria-checked="true" aria-label="12 meals" className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border bg-white p-4 text-left transition-colors duration-200 border-dark">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 border-dark" aria-hidden="true">
                    <span className="size-2.5 rounded-full bg-dark transition-transform duration-200 scale-100" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-2">
                      <span className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-dark">
                        12
                        {" "}
                        meals
                      </span>
                    </span>
                    <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark/60">
                      Starter
                    </span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-right font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-dark">
                    6,99€
                    <span className="text-xs font-normal leading-4 tracking-[-0.24px] text-dark/60">
                      / meal
                    </span>
                  </span>
                </button>
                <button type="button" role="radio" aria-checked="false" aria-label="16 meals" className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border bg-white p-4 text-left transition-colors duration-200 border-light-grey hover:border-dark/40">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 border-dark/30" aria-hidden="true">
                    <span className="size-2.5 rounded-full bg-dark transition-transform duration-200 scale-0" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-2">
                      <span className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-dark">
                        16
                        {" "}
                        meals
                      </span>
                      <span className="rounded bg-brown-border px-2 py-1 font-sans text-[8px] uppercase leading-[8px] tracking-[-0.16px] text-white">
                        Most popular
                      </span>
                    </span>
                    <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark/60">
                      Complete
                    </span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-right font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-dark">
                    6,29€
                    <span className="text-xs font-normal leading-4 tracking-[-0.24px] text-dark/60">
                      / meal
                    </span>
                  </span>
                </button>
                <button type="button" role="radio" aria-checked="false" aria-label="20 meals" className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border bg-white p-4 text-left transition-colors duration-200 border-light-grey hover:border-dark/40">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 border-dark/30" aria-hidden="true">
                    <span className="size-2.5 rounded-full bg-dark transition-transform duration-200 scale-0" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex items-center gap-2">
                      <span className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-dark">
                        20
                        {" "}
                        meals
                      </span>
                    </span>
                    <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-dark/60">
                      Max
                    </span>
                  </span>
                  <span className="shrink-0 whitespace-nowrap text-right font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-dark">
                    5,89€
                    <span className="text-xs font-normal leading-4 tracking-[-0.24px] text-dark/60">
                      / meal
                    </span>
                  </span>
                </button>
              </div>
              <dl className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                  <dt>
                    Box price
                  </dt>
                  <dd>
                    124,85€
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark/60">
                  <dt>
                    Quantity discount
                  </dt>
                  <dd className="text-savings-green">
                    -
                    20,00€
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark/60">
                  <dt>
                    Discount
                    {" (-"}
                    20
                    %)
                  </dt>
                  <dd className="text-savings-green">
                    -
                    20,97€
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark/60">
                  <dt>
                    Shipping
                  </dt>
                  <dd className="text-savings-green">
                    Free
                  </dd>
                </div>
                <div className="mt-2 flex items-end justify-between gap-3 border-t border-light-grey pt-4">
                  <div className="flex flex-col gap-0.5">
                    <dt className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-dark">
                      Total
                    </dt>
                    <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-savings-green">
                      {"You save "}
                      40,97€
                    </span>
                  </div>
                  <dd className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-dark">
                    83,88€
                  </dd>
                </div>
              </dl>
              <div className="flex flex-col gap-3.5">
                <button type="button" aria-label="Add to cart" className="w-full cursor-pointer rounded-[24px] bg-dark px-9 pt-[18px] pb-4 text-center font-sans text-[14px] leading-[14px] uppercase tracking-[2px] text-white">
                  Add to cart
                </button>
                <p className="text-center font-sans text-xs leading-[13px] tracking-[-0.24px] text-dark">
                  from 6,99€ / meal · Skip or cancel anytime
                </p>
              </div>
            </div>
            <div className="lg:hidden">
              <div className="flex flex-col gap-3">
                <p className="font-sans text-sm leading-4.75 tracking-[-0.28px] text-dark">
                  Not the right bundle for you?
                </p>
                <div className="relative w-full">
                  <button type="button" aria-expanded="false" aria-label="Change Bundle" className="flex h-12 w-full cursor-pointer items-center justify-between rounded-[28px] border border-[#D1D5DB] bg-white py-0 pl-6 pr-4 font-sans text-sm leading-4.5 tracking-[-0.28px] text-dark">
                    Change Bundle
                    <svg width="16" height="16" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 transition-transform duration-200 " aria-hidden="true">
                      <path d="M0.919922 0.919373L4.30702 4.91937L7.91992 0.919373" stroke="currentColor" strokeWidth="1.83871" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
