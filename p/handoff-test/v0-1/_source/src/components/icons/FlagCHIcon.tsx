export function FlagCHIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden={true} preserveAspectRatio="xMidYMid slice">
      <rect width="40" height="40" fill="#FF0000" />
      <rect x="15" y="5" width="10" height="30" fill="#FFFFFF" />
      <rect x="5" y="15" width="30" height="10" fill="#FFFFFF" />
    </svg>
  );
}
