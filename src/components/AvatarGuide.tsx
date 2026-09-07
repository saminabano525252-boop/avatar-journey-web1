import { useEffect, useState } from "react";
import avatarImg from "@/assets/avatar-point.png";
import { useAvatarChat } from "@/components/AvatarChatProvider";

export type GuideStop = {
  id: string;
  line: string;
  side: "left" | "right";
};

/**
 * Robot guide that travels down the page as the user scrolls, pointing at the
 * section currently in view and speaking a line about it.
 */
export function AvatarGuide({ stops }: { stops: GuideStop[] }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const { open } = useAvatarChat();

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.55;
      let next = 0;
      stops.forEach((stop, i) => {
        const el = document.getElementById(stop.id);
        if (el && el.getBoundingClientRect().top <= mid) next = i;
      });
      setActive(next);
      setVisible(window.scrollY < document.body.scrollHeight - window.innerHeight * 1.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [stops]);

  const stop = stops[active];
  if (!stop) return null;
  const onRight = stop.side === "right";

  return (
    <div
      className={`pointer-events-none fixed bottom-28 z-40 transition-all duration-700 ease-out ${
        onRight ? "right-2 md:right-10" : "left-2 md:left-10"
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? 0 : 40}px)`,
      }}
    >
      <div className={`flex items-end gap-2 md:gap-3 ${onRight ? "flex-row" : "flex-row-reverse"}`}>
        <div
          key={stop.id}
          className="animate-pop-3d glass-card pointer-events-auto max-w-[150px] rounded-2xl px-3 py-2 text-xs leading-snug md:max-w-[240px] md:px-4 md:py-3 md:text-sm"
        >
          <p className="font-display text-[10px] tracking-widest text-accent md:text-xs">SAIF BOT</p>
          <p className="mt-1">{stop.line}</p>
          <button
            onClick={open}
            className="mt-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition hover:brightness-125 md:mt-3"
          >
            Chat about this
          </button>
        </div>
        <img
          src={avatarImg}
          alt="SAIF Solutions robot guide"
          width={768}
          height={1024}
          loading="lazy"
          className="animate-float h-24 w-auto drop-shadow-[0_0_35px_oklch(0.62_0.24_262/60%)] transition-transform duration-700 md:h-44"
          style={{ transform: onRight ? "scaleX(-1)" : "none" }}
        />
      </div>
    </div>
  );
}

