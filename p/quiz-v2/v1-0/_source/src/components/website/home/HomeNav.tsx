import Image from "next/image";

type Props = {
  /** White on a blur while the hero photograph is behind it; a light ground once it has gone by */
  solid: boolean;
};

export function HomeNav({ solid }: Props) {
  const tone = solid ? "brightness-0" : "";
  return (
    <header
      className={`flex h-[72px] items-center gap-4 p-3 backdrop-blur-[14px] backdrop-saturate-[1.2] transition-colors duration-[350ms] ease-ui ${
        solid ? "bg-white/72" : "bg-near-black/14"
      }`}
    >
      <Image src="img/hp-logo.svg" alt="every" width={86} height={28} className={`mr-auto block h-7 w-[86px] ${tone}`} />
      {["img/hp-account.svg", "img/hp-cart.svg"].map((src) => (
        <span
          key={src}
          className={`flex h-[34px] w-12 shrink-0 items-center justify-center rounded-3xl border transition-colors duration-[350ms] ease-ui ${
            solid ? "border-near-black" : "border-white"
          }`}
        >
          <Image src={src} alt="" width={22} height={22} className={`block size-[22px] ${tone}`} />
        </span>
      ))}
      <span className="relative size-6 shrink-0" aria-hidden>
        {["top-[5px]", "top-[11px]", "top-[17px]"].map((top) => (
          <i
            key={top}
            className={`absolute left-[3px] h-0.5 w-[18px] transition-colors duration-[350ms] ease-ui ${top} ${
              solid ? "bg-near-black" : "bg-white"
            }`}
          />
        ))}
      </span>
    </header>
  );
}
