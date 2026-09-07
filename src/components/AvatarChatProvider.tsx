import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import avatarImg from "@/assets/avatar-point.png";

type Msg = { role: "bot" | "user"; text: string };

type ChatCtx = { open: () => void; close: () => void; isOpen: boolean };
const Ctx = createContext<ChatCtx>({ open: () => {}, close: () => {}, isOpen: false });

export const useAvatarChat = () => useContext(Ctx);

const KB: { match: RegExp; reply: string }[] = [
  {
    match: /web|site|website|app|develop|code/i,
    reply:
      "Web Solutions: 3D interactive sites, web apps, e-commerce and dashboards — built fast, animated, and responsive. Want a quote for a site like this one?",
  },
  {
    match: /graphic|logo|brand|design|poster|3d/i,
    reply:
      "Graphic Solutions: logos, 3D chrome brand marks, packaging, social kits and motion graphics. I can mock up 3 concepts in 48 hours.",
  },
  {
    match: /market|seo|ads|social|campaign|growth/i,
    reply:
      "Marketing Solutions: SEO, paid ads, content engines and funnel analytics. Most clients see traffic lift within the first 6 weeks.",
  },
  {
    match: /price|cost|budget|quote|rate/i,
    reply:
      "Projects usually start around $900 for a landing page, $2.5k+ for a full 3D site, and monthly retainers for marketing. Tell me your scope and I'll narrow it.",
  },
  {
    match: /contact|call|email|meet|talk|hire/i,
    reply:
      "Head to the Contact page and drop your details — or tell me your name and project here and the team will reach out.",
  },
  {
    match: /portfolio|work|project|example|case/i,
    reply: "Check the Portfolio page — 3D tilt cards with our web, graphic and marketing work.",
  },
];

function botReply(input: string) {
  const hit = KB.find((k) => k.match.test(input));
  return (
    hit?.reply ??
    "I handle Web, Graphic and Marketing solutions. Which one are you exploring? You can also ask about pricing or timelines."
  );
}

export function AvatarChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hey! I'm SAIF Bot. Ask me about web, graphic or marketing solutions." },
  ]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text }]);
    window.setTimeout(() => setMsgs((m) => [...m, { role: "bot", text: botReply(text) }]), 450);
  };

  return (
    <Ctx.Provider value={value}>
      {children}

      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Chat with the SAIF avatar"
        className="glow-ring fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:scale-110"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="animate-pop-3d glass-card fixed bottom-24 right-6 z-50 flex h-[26rem] w-[min(22rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl">
          <header className="flex items-center gap-3 border-b border-border px-4 py-3">
            <img src={avatarImg} alt="" width={768} height={1024} loading="lazy" className="h-9 w-auto" />
            <div>
              <p className="font-display text-sm">SAIF BOT</p>
              <p className="text-xs text-accent">online · solutions assistant</p>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <p
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground"
                      : "max-w-[90%] text-foreground"
                  }
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a solution..."
              className="min-w-0 flex-1 rounded-full bg-secondary px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:brightness-125"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </Ctx.Provider>
  );
}
