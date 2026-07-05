interface LogoProps {
  size?: "sm" | "md" | "lg";
  showPulse?: boolean;
  isLive?: boolean;
}

const sizes = {
  sm: { icon: 18, text: "text-base" },
  md: { icon: 22, text: "text-xl" },
  lg: { icon: 34, text: "text-3xl" },
};

export function Logo({ size = "md", showPulse = false, isLive = false }: LogoProps) {
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2 select-none">
      <svg width={s.icon} height={s.icon} viewBox="0 0 32 32" fill="none">
        <path
          d="M4 22L12 13L18 19L28 6"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 6H28V13"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className={`font-display font-semibold tracking-tight ${s.text} text-ink dark:text-ink-dark`}
      >
        Finans<span className="font-normal text-ink-soft dark:text-ink-soft-dark">Takip</span>
      </span>
      {showPulse && (
        <span className="relative flex h-2 w-2 ml-1">
          {isLive && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rise opacity-60" />
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isLive ? "bg-rise" : "bg-ink-faint dark:bg-ink-faint-dark"
            }`}
          />
        </span>
      )}
    </div>
  );
}
