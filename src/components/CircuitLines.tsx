import { useEffect, useState } from "react";

/**
 * Fixed animated circuit-line field that reacts to scroll.
 * Purely presentational background used on every page.
 */
export function CircuitLines() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const rows = Array.from({ length: 14 });

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 600px at 70% 10%, oklch(0.35 0.16 262 / 55%), transparent 65%), radial-gradient(700px 500px at 10% 80%, oklch(0.4 0.14 220 / 40%), transparent 70%)",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 800"
        preserveAspectRatio="none"
        style={{ transform: `translate3d(0, ${offset * -0.08}px, 0)` }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.62 0.24 262)" stopOpacity="0" />
            <stop offset="50%" stopColor="oklch(0.8 0.18 230)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.62 0.24 262)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {rows.map((_, i) => {
          const y = 40 + i * 56;
          const step = 60 + ((i * 37) % 120);
          return (
            <path
              key={i}
              d={`M -50 ${y} H ${200 + step} L ${260 + step} ${y - 40} H ${560 + step} L ${620 + step} ${y + 40} H 1050`}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth={i % 3 === 0 ? 1.6 : 0.8}
              strokeDasharray="14 22"
              style={{
                animation: `dash-flow ${8 + (i % 5) * 3}s linear infinite`,
                opacity: 0.55,
              }}
            />
          );
        })}
        {rows.map((_, i) => (
          <circle
            key={`n-${i}`}
            cx={80 + ((i * 137) % 900)}
            cy={60 + ((i * 211) % 720)}
            r={3}
            fill="oklch(0.85 0.16 225)"
            style={{ animation: `pulse-glow ${3 + (i % 4)}s ease-in-out infinite` }}
          />
        ))}
      </svg>
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.8 0.15 240 / 40%) 1px, transparent 1px), linear-gradient(90deg, oklch(0.8 0.15 240 / 40%) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          transform: `perspective(600px) rotateX(62deg) translateY(${offset * 0.15}px)`,
          transformOrigin: "bottom",
          maskImage: "linear-gradient(to top, black, transparent 60%)",
        }}
      />
    </div>
  );
}
