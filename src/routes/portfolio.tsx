import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X, PlayCircle, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { AvatarGuide, type GuideStop } from "@/components/AvatarGuide";
import { useAvatarChat } from "@/components/AvatarChatProvider";
import {
  fetchPortfolio,
  toEmbedUrl,
  type PortfolioCategory,
  type PortfolioItem,
} from "@/lib/portfolio";

const SITE = "https://avatar-journey-web.lovable.app";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — SAIF Solutions 3D Web, Brand & Growth Work" },
      {
        name: "description",
        content:
          "Selected SAIF Solutions projects across 3D web builds, brand identity systems and performance marketing campaigns.",
      },
      { property: "og:title", content: "Portfolio — SAIF Solutions" },
      {
        property: "og:description",
        content: "3D web builds, brand identity systems and growth marketing campaigns by SAIF Solutions.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/portfolio` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/portfolio` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
            { "@type": "ListItem", position: 2, name: "Portfolio", item: `${SITE}/portfolio` },
          ],
        }),
      },
    ],
  }),
  component: Portfolio,
});

const stops: GuideStop[] = [
  { id: "work-top", line: "Here's the work — tap any card for the full case.", side: "right" },
];

function Portfolio() {
  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<PortfolioItem | null>(null);
  const { open } = useAvatarChat();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await fetchPortfolio();
      if (cancelled) return;
      setCategories(data.categories);
      setItems(data.items);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const uncategorised = items.filter((i) => !i.category_id);
  const groups = [
    ...categories.map((c) => ({
      id: c.id,
      label: c.name,
      description: c.description,
      projects: items.filter((i) => i.category_id === c.id),
    })),
    ...(uncategorised.length
      ? [{ id: "other", label: "More work", description: null, projects: uncategorised }]
      : []),
  ].filter((g) => g.projects.length > 0);

  const embed = active?.video_url ? toEmbedUrl(active.video_url) : null;

  return (
    <div className="px-6 pb-32 pt-32">
      <AvatarGuide stops={stops} />

      <Reveal>
        <div id="work-top" className="mx-auto max-w-5xl text-center">
          <p className="font-display text-xs tracking-[0.4em] text-accent">PORTFOLIO</p>
          <h1 className="chrome-text mt-4 text-5xl md:text-6xl">SELECTED WORK</h1>
        </div>
      </Reveal>

      {loading && <p className="mt-16 text-center text-muted-foreground">Loading work...</p>}

      {!loading && groups.length === 0 && (
        <div className="glass-card mx-auto mt-16 max-w-lg rounded-3xl p-10 text-center text-muted-foreground">
          New work is being added here shortly. Chat with the avatar in the meantime.
        </div>
      )}

      {groups.map((g) => (
        <section key={g.id} className="mx-auto mt-20 max-w-6xl">
          <Reveal>
            <h2 className="font-display text-2xl text-accent">{g.label}</h2>
            {g.description && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{g.description}</p>}
          </Reveal>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {g.projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <button
                  onClick={() => setActive(p)}
                  className="tilt-3d glass-card h-full w-full overflow-hidden rounded-2xl text-left transition-transform duration-300 hover:scale-105"
                >
                  {p.cover_url && (
                    <img
                      src={p.cover_url}
                      alt={p.title}
                      loading="lazy"
                      className="h-44 w-full object-cover"
                    />
                  )}
                  <div className="p-6">
                    <p className="font-display text-xl">{p.title}</p>
                    {p.result && <p className="mt-3 text-sm text-accent">{p.result}</p>}
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-accent">
                      {p.video_url && <PlayCircle className="h-4 w-4" />} View project
                    </span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </section>
      ))}

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-6 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="animate-pop-3d glass-card relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-2 transition hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>

            {embed ? (
              <div className="aspect-video w-full overflow-hidden rounded-2xl">
                <iframe
                  src={embed}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            ) : (
              active.cover_url && (
                <img src={active.cover_url} alt={active.title} className="w-full rounded-2xl object-cover" />
              )
            )}

            <h3 className="chrome-text mt-6 text-3xl">{active.title}</h3>
            {active.description && <p className="mt-4 text-muted-foreground">{active.description}</p>}
            {active.result && <p className="font-display mt-4 text-accent">{active.result}</p>}

            <div className="mt-8 flex flex-wrap gap-3">
              {active.external_url && (
                <a
                  href={active.external_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="glow-ring inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-semibold text-primary-foreground transition hover:scale-105"
                >
                  Open project <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {active.video_url && !embed && (
                <a
                  href={active.video_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 font-semibold transition hover:bg-secondary"
                >
                  Watch video <PlayCircle className="h-4 w-4" />
                </a>
              )}
              <button
                onClick={() => {
                  setActive(null);
                  open();
                }}
                className="rounded-full border border-border px-5 py-2 font-semibold transition hover:bg-secondary"
              >
                Ask the avatar about this
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
