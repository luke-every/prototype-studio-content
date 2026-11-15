import { HeaderV2 } from "@/components/website/HeaderV2";
import { Footer } from "@/components/website/Footer";
import { CardCarousel } from "@/components/carousel/CardCarousel";
import { FOOTER, NAV_ITEMS } from "@/lib/site-chrome-sample";

export default function Home() {
  return (
    <>
      <HeaderV2 navItems={NAV_ITEMS} logoSrc={FOOTER.logoSrc} overlay={false} />
      <main className="mx-auto max-w-[1200px] px-4 py-10 lg:px-10 lg:py-20">
        {/* TODO(lift): replace with translation key */}
        <h1 className="font-book text-[34px] leading-[34px] tracking-[-0.68px] text-near-black lg:text-[48px] lg:leading-[48px] lg:tracking-[-0.96px]">
          Eat well, every day
        </h1>
        {/* TODO(lift): replace with translation key */}
        <p className="mt-4 font-sans text-base leading-[22px] tracking-[-0.32px] text-light-text">
          Chef-made meals, built around how you want to feel.
        </p>
        <div className="mt-8 lg:mt-12">
          <CardCarousel />
        </div>
      </main>
      {/* TODO(lift): sample data — rating comes from reviews.io */}
      <Footer {...FOOTER} rating={{ average: 4.7 }} />
    </>
  );
}
