// Markup taken out of src/components/website/routine/RoutineComponentV2.tsx:26-26 for this project. The original is not touched: what is changed here is what is proposed.
import Image from "next/image";

type Props = {
  slides: string[];
};

export function ImageSection({ slides }: Props) {
  return (
    <Image src={slides[0]} alt="" fill unoptimized className="object-cover" sizes="(max-width: 1023px) 100vw, 415px" />
  );
}
