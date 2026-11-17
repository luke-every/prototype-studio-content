import { useId } from "react";
import type { IconProps } from "./types";

export function MastercardIcon({ width = 38, height = 27, className, ...rest }: IconProps & { width?: number; height?: number }) {
  const clipId = useId();
  return (
    <svg width={width} height={height} viewBox="0 0 38 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden {...rest}>
      <g clipPath={`url(#${clipId})`}>
        <path fill="#FF5F00" d="M16.1111 7.71167H22.864V20.294H16.1111V7.71167Z" />
        <path fill="#EB001B" d="M16.5399 14.0029C16.5399 11.4465 17.6976 9.17894 19.4769 7.7117C18.1692 6.64466 16.5186 6 14.7178 6C10.4515 6 7 9.57904 7 14.0029C7 18.4267 10.4515 22.0059 14.7177 22.0059C16.5185 22.0059 18.1691 21.3612 19.4769 20.2941C17.6976 18.8491 16.5399 16.5594 16.5399 14.0029V14.0029Z" />
        <path fill="#F79E1B" d="M31.9751 14.0029C31.9751 18.4267 28.5237 22.0059 24.2575 22.0059C22.4567 22.0059 20.806 21.3612 19.4983 20.2941C21.2991 18.8269 22.4353 16.5594 22.4353 14.0029C22.4353 11.4465 21.2776 9.17894 19.4983 7.7117C20.8059 6.64466 22.4567 6 24.2575 6C28.5237 6 31.9752 9.60132 31.9752 14.0029H31.9751Z" />
      </g>
      <rect strokeOpacity="0.2" stroke="black" rx="2.5" height="26" width="37" y="0.5" x="0.5" />
      <defs>
        <clipPath id={clipId}>
          <rect transform="translate(7 6)" fill="white" height="16" width="25" />
        </clipPath>
      </defs>
    </svg>
  );
}
