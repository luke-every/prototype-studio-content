// Markup taken out of src/components/website/cart-v2/CartDrawerV3.tsx:95 as it was drawn (a snapshot) for this project. It stands on its own and doesn't run. The original is not touched: what is changed here is what is proposed.

export function CartDrawerV3() {
  return (
    <div tabIndex={-1} role="dialog" aria-modal="true" aria-label="Cart" className="fixed top-0 right-0 z-[60] h-dvh w-full max-w-[480px] overflow-y-auto overscroll-contain bg-white outline-none transition-transform duration-300 translate-x-0">
      <div className="sticky top-6 z-10 flex h-0 justify-end pr-6">
        <button type="button" aria-label="Close cart" className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-light-grey text-dark">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex flex-col pb-[200px]">
        <section className="flex flex-col gap-4 px-6 pt-6 pb-8">
          <h2 className="font-book text-2xl leading-[28px] tracking-[-0.48px] text-dark">
            Your order
          </h2>
          <div className="flex flex-col gap-3">
            <div className="w-full overflow-hidden rounded-2xl border border-light-grey bg-white">
              <div className="flex items-center gap-4 p-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-light-grey">
                  <img alt="The Protein Bundle" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://a.storyblok.com/f/291086118523370/2944x1344/808791ae9a/protein-hero-desktop.png#studio-112" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-near-black">
                    The Protein Bundle
                  </span>
                  <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-light-text">
                    16 meals
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="font-sans text-sm font-medium leading-[18px] tracking-[-0.28px] text-near-black">
                    100,64 €
                  </span>
                  <span className="font-sans text-xs leading-4 tracking-[-0.24px] text-light-text line-through">
                    160,80 €
                  </span>
                </div>
              </div>
              <div className="grid transition-[grid-template-rows] duration-300 ease-in-out grid-rows-[0fr]">
                <div className="overflow-hidden">
                  <div className="flex flex-col border-t border-light-grey px-4">
                    <div className="flex items-center gap-3 py-3 ">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://cdn.shopify.com/s/files/1/0228/6528/1104/files/01_BamiGoreng.png?v=1740055371&width=600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        Bami Goreng
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        1
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-t border-light-grey">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://a.storyblok.com/f/291086118523370/0x0/ed603ad938/01_betterbutterchicken.png/m/600x600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        Better Butter Chicken
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        1
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-t border-light-grey">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://a.storyblok.com/f/291086118523370/0x0/14b2f5dabf/01_chili_sin_carne.png/m/600x600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        Chili sin Carne
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        1
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-t border-light-grey">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://a.storyblok.com/f/291086118523370/2000x2000/abf28e694b/2026-05-06-every5051.jpg/m/600x600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        Chimichurri Glow
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        1
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-t border-light-grey">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://a.storyblok.com/f/291086118523370/2000x2000/9f2fb45051/nuts-en-creamy-peanut-curry.png/m/600x600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        Creamy Peanut Curry
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        1
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-t border-light-grey">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://cdn.shopify.com/s/files/1/0228/6528/1104/files/01_DalDelight.png?v=1740054441&width=600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        Dal Delight
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        1
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-t border-light-grey">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://cdn.shopify.com/s/files/1/0228/6528/1104/files/01_ForestGreen.png?v=1740055423&width=600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        Green Forest Bowl
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        1
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-t border-light-grey">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://a.storyblok.com/f/291086118523370/2000x2000/814f8ba60a/every_lemon_cashew_pasta-nuts-en.png/m/600x600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        Lemon Cashew Pasta
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        2
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-t border-light-grey">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://a.storyblok.com/f/291086118523370/0x0/85de22ee4a/4_7b8707de-bfed-4e24-ab1d-830c08fcf71a.jpg/m/600x600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        Nasi Goreng
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        1
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-t border-light-grey">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://cdn.shopify.com/s/files/1/0228/6528/1104/files/Peas_Love.png?v=1740052195&width=600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        {"Peas & Love"}
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        1
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-t border-light-grey">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://a.storyblok.com/f/291086118523370/1625x1625/1e11b7b600/01_redcurry.png/m/600x600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        Red Curry
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        1
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-t border-light-grey">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://a.storyblok.com/f/291086118523370/1600x1600/40698c7fa3/sesame-quinoa-salad.jpg/m/600x600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        Sesame Quinoa Salad
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        1
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-t border-light-grey">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://a.storyblok.com/f/291086118523370/2000x2000/c5ff773afd/every_peanut_couscous_nuts-en.png/m/600x600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        Spiced Peanut Couscous
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        1
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-t border-light-grey">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://a.storyblok.com/f/291086118523370/0x0/da86ac72a4/01_teriyakiwoktopshot.png/m/600x600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        Teriyaki Wok
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        1
                      </span>
                    </div>
                    <div className="flex items-center gap-3 py-3 border-t border-light-grey">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-light-grey">
                        <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover" src="https://a.storyblok.com/f/291086118523370/3125x3125/95e1156a7d/umami-rice.avif/m/600x600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                      </div>
                      <span className="flex-1 font-sans text-sm leading-[18px] tracking-[-0.28px] text-dark">
                        Umami Rice
                      </span>
                      <span className="font-sans text-sm leading-[18px] text-light-text">
                        ×
                        1
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-light-grey px-4 py-3">
                <button type="button" aria-expanded="false" className="flex cursor-pointer items-center gap-2 font-sans text-sm leading-[18px] tracking-[-0.28px] text-light-text">
                  Show meals
                  <svg width="10" height="6.111127777444452" viewBox="0 0 10.0002 6.11125" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-200 " aria-hidden="true">
                    <path d="M5.00005 3.88894L8.88905 0L10.0002 1.11113L5.00005 6.11125L0 1.11113L1.11113 0L5.00005 3.88894Z" fill="currentColor" />
                  </svg>
                </button>
                <button type="button" aria-label="Remove from box" className="cursor-pointer text-light-text transition-colors hover:text-dark">
                  <svg width="16" height="16" viewBox="0 0 13.9986 13.9986" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M10.499 2.79972H13.9986V4.19958H12.5988V13.2987C12.5988 13.6853 12.2854 13.9986 11.8988 13.9986H2.09979C1.71323 13.9986 1.39986 13.6853 1.39986 13.2987V4.19958H0V2.79972H3.49965V0.699931C3.49965 0.313373 3.81303 0 4.19958 0H9.79903C10.1856 0 10.499 0.313373 10.499 0.699931V2.79972ZM11.1989 4.19958H2.79972V12.5988H11.1989V4.19958ZM4.89952 6.29938H6.29938V10.499H4.89952V6.29938ZM7.69924 6.29938H9.0991V10.499H7.69924V6.29938ZM4.89952 1.39986V2.79972H9.0991V1.39986H4.89952Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="grid transition-[grid-template-rows] duration-300 ease-in-out grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-3 rounded-xl bg-light-grey/40 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-0.5">
                        <p className="font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark">
                          Save 0,40 € on every meal
                        </p>
                        <p className="flex items-baseline gap-1.5 font-sans text-xs leading-4 tracking-[-0.24px] text-dark/65">
                          <span className="line-through">
                            6,29 €
                          </span>
                          <span className="text-savings-green">
                            5,89 € a meal
                          </span>
                        </p>
                      </div>
                      <button type="button" tabIndex={0} className="shrink-0 cursor-pointer rounded-full border border-dark px-4 py-2 font-sans text-xs leading-4 tracking-[-0.24px] text-dark transition-colors hover:bg-dark hover:text-white">
                        Switch to 20 meals
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <ul className="flex gap-2">
                        <li>
                          <button type="button" tabIndex={0} aria-label="Chimichurri Glow, 2 portions" className="relative block size-12 cursor-pointer overflow-hidden rounded-lg bg-light-grey">
                            <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover object-left-top" src="https://a.storyblok.com/f/291086118523370/2000x2000/abf28e694b/2026-05-06-every5051.jpg/m/600x600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                            <span className="absolute right-0.5 bottom-0.5 rounded bg-white/90 px-1 font-sans text-[10px] leading-[13px] text-dark">
                              2
                              ×
                            </span>
                          </button>
                        </li>
                        <li>
                          <button type="button" tabIndex={0} aria-label="Paella Del Sol" className="relative block size-12 cursor-pointer overflow-hidden rounded-lg bg-light-grey">
                            <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover object-left-top" src="https://a.storyblok.com/f/291086118523370/0x0/f66f3d4250/01_paelladelsoltopshot.png/m/600x600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                          </button>
                        </li>
                        <li>
                          <button type="button" tabIndex={0} aria-label="Tikka Masala" className="relative block size-12 cursor-pointer overflow-hidden rounded-lg bg-light-grey">
                            <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover object-left-top" src="https://cdn.shopify.com/s/files/1/0228/6528/1104/files/01_TikkaMasala.png?v=1740055317&width=600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                          </button>
                        </li>
                        <li>
                          <button type="button" tabIndex={0} aria-label="Brilliant Bolognese" className="relative block size-12 cursor-pointer overflow-hidden rounded-lg bg-light-grey">
                            <img alt="" loading="lazy" decoding="async" data-nimg="fill" className="object-cover object-left-top" src="https://cdn.shopify.com/s/files/1/0228/6528/1104/files/BrilliantBolognese.png?v=1740052092&width=600" style={{ position: "absolute", height: "100%", width: "100%", left: "0px", top: "0px", right: "0px", bottom: "0px", color: "transparent" }} />
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid transition-[grid-template-rows] duration-300 ease-in-out grid-rows-[0fr]">
                <div className="overflow-hidden">
                  <div className="flex items-center justify-between rounded-xl bg-light-grey/40 px-3 py-2">
                    <span className="font-sans text-xs font-medium leading-4 tracking-[-0.24px] text-dark">
                      Switched to 16 meals
                    </span>
                    <button type="button" tabIndex={-1} className="cursor-pointer font-sans text-xs leading-4 tracking-[-0.24px] text-dark underline underline-offset-2">
                      Undo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-4 px-6">
          <h2 className="font-book text-2xl leading-[28px] tracking-[-0.48px] text-dark">
            Summary
          </h2>
          <div className="rounded-2xl border border-light-grey p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <span className="font-sans text-base leading-[22px] tracking-[-0.32px] text-light-text">
                  Bundle
                  {" ·"}
                  {" "}
                  16 meals
                </span>
                <span className="font-sans text-lg leading-[22px] tracking-[-0.36px] text-light-text">
                  160,80 €
                </span>
              </div>
            </div>
            <div className="my-4 h-px w-full shrink-0 rounded-[12px] border-t border-b border-light-grey" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-sans text-base leading-[22px] tracking-[-0.32px] text-near-black">
                  Quantity discount
                </span>
                <span className="font-sans text-lg leading-[22px] tracking-[-0.36px] text-savings-green">
                  -
                  35,00 €
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-base leading-[22px] tracking-[-0.32px] text-near-black">
                  Discount
                  {" (-"}
                  20
                  %)
                </span>
                <span className="font-sans text-lg leading-[22px] tracking-[-0.36px] text-savings-green">
                  -
                  25,16 €
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-sans text-base leading-[22px] tracking-[-0.32px] text-near-black">
                  Shipping
                </span>
                <span className="font-sans text-lg leading-[22px] tracking-[-0.36px] text-savings-green">
                  Free
                </span>
              </div>
            </div>
            <div className="my-4 h-px w-full shrink-0 rounded-[12px] border-t border-b border-light-grey" />
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-sans text-base leading-[22px] tracking-[-0.32px] text-near-black">
                  Total
                </span>
                <div className="flex flex-col font-sans text-xs leading-[13px] tracking-[-0.24px] text-brown">
                  <span>
                    incl. VAT and Shipping
                  </span>
                  <span>
                    See recurring total in the next step
                  </span>
                </div>
              </div>
              <span className="font-sans text-lg leading-[22px] tracking-[-0.36px] text-near-black">
                100,64 €
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
