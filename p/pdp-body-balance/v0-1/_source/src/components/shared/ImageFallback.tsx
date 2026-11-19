import Image from "next/image";

type Props = {
  size?: number;
};

export function ImageFallback({ size = 120 }: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <Image src="/Logo.png" alt="" width={size} height={size} className="w-1/3 object-contain opacity-30" />
    </div>
  );
}
