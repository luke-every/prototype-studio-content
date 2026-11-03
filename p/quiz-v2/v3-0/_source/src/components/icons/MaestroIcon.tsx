import { useId } from "react";
import type { IconProps } from "./types";

export function MaestroIcon({ width = 38, height = 27, className, ...rest }: IconProps & { width?: number; height?: number }) {
  const clipId = useId();
  return (
    <svg width={width} height={height} viewBox="0 0 38 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden {...rest}>
      <g clipPath={`url(#${clipId})`}>
        <path fill="#6C6BBD" d="M23.1504 20.3104H15.8496V7.71277H23.1504V20.3104Z" />
        <path fill="#D32011" d="M16.313 14.0118C16.313 11.4563 17.5592 9.17995 19.4998 7.71301C18.0807 6.6403 16.2895 6 14.3432 6C9.73528 6 6 9.58694 6 14.0118C6 18.4367 9.73528 22.0236 14.3432 22.0236C16.2896 22.0236 18.0807 21.3833 19.4998 20.3106C17.5592 18.8436 16.313 16.5673 16.313 14.0118Z" />
        <path fill="#0099DF" d="M33.0001 14.0118C33.0001 18.4367 29.2648 22.0236 24.6569 22.0236C22.7104 22.0236 20.9194 21.3833 19.4998 20.3106C21.4409 18.8436 22.687 16.5673 22.687 14.0118C22.687 11.4563 21.4409 9.17995 19.4998 7.71301C20.9194 6.6403 22.7105 6 24.6569 6C29.2648 6 33.0001 9.58694 33.0001 14.0118Z" />
      </g>
      <rect strokeOpacity="0.2" stroke="black" rx="2.5" height="26" width="37" y="0.5" x="0.5" />
      <defs>
        <clipPath id={clipId}>
          <rect transform="translate(6 6)" fill="white" height="16" width="27" />
        </clipPath>
      </defs>
    </svg>
  );
}
