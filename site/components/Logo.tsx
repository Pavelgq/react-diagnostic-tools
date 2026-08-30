export function Logo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="16" cy="19" rx="9" ry="8.5" fill="#dc2626" />
      <path
        d="M16 10.5 L16 27.5"
        stroke="#7f1d1d"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="16" cy="9" r="4" fill="#1f2937" />
      <line
        x1="14"
        y1="6.5"
        x2="11"
        y2="3.5"
        stroke="#1f2937"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <line
        x1="18"
        y1="6.5"
        x2="21"
        y2="3.5"
        stroke="#1f2937"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1.7" fill="#1f2937" />
      <circle cx="20" cy="16" r="1.7" fill="#1f2937" />
      <circle cx="11.5" cy="22.5" r="1.7" fill="#1f2937" />
      <circle cx="20.5" cy="22.5" r="1.7" fill="#1f2937" />
      <circle cx="16" cy="24.5" r="1.5" fill="#1f2937" />
    </svg>
  );
}
