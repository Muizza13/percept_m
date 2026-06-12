export function Logo({ size = 18 }: { size?: number }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c7f04b]">
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 12c3-7 15-7 18 0-3 7-15 7-18 0Z"
          stroke="#10231a"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3.1" fill="#10231a" />
      </svg>
    </span>
  );
}
