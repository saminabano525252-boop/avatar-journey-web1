import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Code2, Palette, Megaphone, ArrowRight, X, ExternalLink } from "lucide-react";
import { AvatarGuide, type GuideStop } from "@/components/AvatarGuide";
import { Reveal } from "@/components/Reveal";
import { useAvatarChat } from "@/components/AvatarChatProvider";
import logo from "@/assets/saif-logo.png.asset.json";

const SITE = "https://avatar-journey-web.lovable.app";
const OG_IMAGE = `${SITE}${logo.url}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAIF Solutions — 3D Web Design, Graphics & Digital Marketing" },
      {
        name: "description",
        content:
          "SAIF Solutions builds interactive 3D websites, brand graphics and growth marketing campaigns for businesses worldwide — online 24/7.",
      },
      { property: "og:title", content: "SAIF Solutions — 3D Web Design, Graphics & Digital Marketing" },
      {
        property: "og:description",
        content: "Interactive 3D web design, graphic design and digital marketing, delivered worldwide.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "SAIF Solutions",
          url: SITE,
          logo: OG_IMAGE,
          image: OG_IMAGE,
          description:
            "Digital studio for 3D web development, graphic design and growth marketing, serving clients worldwide.",
          areaServed: "Worldwide",
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "00:00",
            closes: "23:59",
          },
          priceRange: "$$",
          makesOffer: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Design & Development" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Graphic Design & Branding" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Digital Marketing & SEO" } },
          ],
        }),
      },
    ],
  }),
  component: Index,
});


const stops: GuideStop[] = [
  { id: "hero", line: "Welcome to SAIF Solutions! Scroll — I'll walk you through what we do.", side: "right" },
  { id: "web", line: "Web Solutions! 3D interactive sites and web apps, right this way.", side: "right" },
  { id: "graphic", line: "Graphic Solutions — chrome logos, 3D brand kits, motion design.", side: "left" },
  { id: "marketing", line: "Marketing Solutions: SEO, ads and funnels that actually convert.", side: "right" },
  { id: "projects", line: "Here's the work — hover a card, click to open the project.", side: "left" },
  { id: "cta", line: "Ready? Ping me in chat or hit the contact page.", side: "right" },
];

const services = [
  {
    id: "web",
    icon: Code2,
    title: "Web Solutions",
    tag: "01 / BUILD",
    copy: "Website design and development — interactive 3D sites, web apps, e-commerce stores and dashboards engineered for speed and motion.",
    items: ["3D & motion sites", "Web apps & portals", "E-commerce stores", "Performance tuning"],
  },
  {
    id: "graphic",
    icon: Palette,
    title: "Graphic Solutions",
    tag: "02 / DESIGN",
    copy: "Chrome-grade brand identities, 3D brand systems, packaging and social kits that stop the scroll.",
    items: ["Logo & identity", "3D product visuals", "Packaging", "Social kits"],
  },
  {
    id: "marketing",
    icon: Megaphone,
    title: "Marketing Solutions",
    tag: "03 / GROW",
    copy: "SEO, search visibility, paid media and content engines wired into one measurable growth loop.",
    items: ["SEO & search", "Paid ads", "Content engine", "Funnel analytics"],
  },
];

type Project = { title: string; category: string; result: string; detail: string; href: string };

const projects: Project[] = [
  {
    title: "Nova Commerce",
    category: "3D storefront",
    result: "+38% conversion",
    detail: "A WebGL-flavoured storefront with scroll-driven product reveals, instant search and a rebuilt checkout.",
    href: "/portfolio",
  },
  {
    title: "Orbit Dashboard",
    category: "Web app",
    result: "12k daily users",
    detail: "Realtime analytics console with role-based access, live charts and offline-tolerant sync.",
    href: "/portfolio",
  },
  {
    title: "Chrome Identity",
    category: "Brand system",
    result: "Full rebrand",
    detail: "3D chrome wordmark, motion logo, colour system and a 60-page brand book.",
    href: "/portfolio",
  },
  {
    title: "Ascend SEO",
    category: "Organic growth",
    result: "4x traffic",
    detail: "Technical fixes, topical clusters and digital PR over a six-month sprint.",
    href: "/portfolio",
  },
  {
    title: "Flux Ads",
    category: "Paid media",
    result: "2.7x ROAS",
    detail: "Creative testing engine across paid social and search with weekly iteration.",
    href: "/portfolio",
  },
];


function Index() {
  const { open } = useAvatarChat();
  const [active, setActive] = useState<Project | null>(null);

  return (
    <div className="relative">
      <AvatarGuide stops={stops} />

      <section id="hero" className="flex min-h-screen items-center px-6 pt-28">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2">
          <Reveal>
            <p className="font-display text-xs tracking-[0.4em] text-accent">SAIF SOLUTIONS · WEB · GRAPHIC · MARKETING</p>
            <h1 className="chrome-text mt-4 text-5xl leading-tight md:text-7xl">
              WE BUILD IN
              <br />
              3 DIMENSIONS
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              Web design, graphic design and digital marketing — engineered with motion, depth and a
              robot guide that walks you through every step. Online 24/7, worldwide.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={open}
                className="glow-ring rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:scale-105"
              >
                Chat with the avatar
              </button>
              <Link
                to="/portfolio"
                className="rounded-full border border-border px-6 py-3 font-semibold transition hover:bg-secondary"
              >
                See the work
              </Link>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="tilt-3d relative mx-auto w-full max-w-md">
              <img
                src={logo.url}
                alt="SAIF Solutions chrome circuit logo"
                width={840}
                height={779}
                fetchPriority="high"
                className="animate-float w-full object-contain drop-shadow-[0_0_60px_oklch(0.62_0.24_262/70%)]"
              />
            </div>
          </Reveal>
        </div>
      </section>


      {services.map((s, i) => (
        <section key={s.id} id={s.id} className="flex min-h-screen items-center px-6 py-24">
          <div className="mx-auto w-full max-w-5xl">
            <Reveal>
              <p className="font-display text-xs tracking-[0.4em] text-accent">{s.tag}</p>
              <h2 className="chrome-text mt-3 text-4xl md:text-6xl">{s.title}</h2>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground">{s.copy}</p>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {s.items.map((item, j) => (
                <Reveal key={item} delay={j * 90}>
                  <div className="tilt-3d glass-card h-full rounded-2xl p-5">
                    <s.icon className="h-6 w-6 text-accent" />
                    <p className="font-display mt-4 text-base">{item}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {["Strategy", "Design", "Build", "Launch"][j % 4]} handled end to end.
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200}>
              <button
                onClick={open}
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:gap-4"
              >
                Discuss {s.title.toLowerCase()} <ArrowRight className="h-4 w-4" />
              </button>
            </Reveal>
            <span className="sr-only">{i}</span>
          </div>
        </section>
      ))}

      <section id="projects" className="px-6 py-24">
        <Reveal>
          <div className="mx-auto max-w-6xl">
            <p className="font-display text-xs tracking-[0.4em] text-accent">04 / WORK</p>
            <h2 className="chrome-text mt-3 text-4xl md:text-6xl">FIVE PROJECTS</h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Tilted side by side — hover to zoom in, click any card to open the project.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 110}>
              <button
                onClick={() => setActive(p)}
                style={{ transform: `rotate(${i % 2 === 0 ? -2.5 : 2.5}deg)` }}
                className="glass-card h-full w-full rounded-2xl p-6 text-left transition-transform duration-300 hover:scale-110 hover:rotate-0 hover:shadow-[0_0_50px_oklch(0.62_0.24_262/45%)]"
              >
                <p className="font-display text-xs tracking-widest text-accent">{p.category}</p>
                <p className="font-display mt-3 text-lg">{p.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{p.result}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                  View project <ArrowRight className="h-3 w-3" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-6 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="animate-pop-3d glass-card relative w-full max-w-lg rounded-3xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Close project"
              className="absolute right-5 top-5 text-muted-foreground transition hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="font-display text-xs tracking-widest text-accent">{active.category}</p>
            <h3 className="chrome-text mt-3 text-3xl">{active.title}</h3>
            <p className="mt-4 text-muted-foreground">{active.detail}</p>
            <p className="font-display mt-4 text-accent">{active.result}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={active.href}
                onClick={() => setActive(null)}
                className="glow-ring inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 font-semibold text-primary-foreground transition hover:scale-105"
              >
                Open project <ExternalLink className="h-4 w-4" />
              </Link>
              <button
                onClick={open}
                className="rounded-full border border-border px-5 py-2 font-semibold transition hover:bg-secondary"
              >
                Ask the avatar about this
              </button>
            </div>
          </div>
        </div>
      )}

      <section id="cta" className="px-6 py-32">

        <Reveal>
          <div className="glass-card mx-auto max-w-3xl rounded-3xl p-10 text-center">
            <h2 className="chrome-text text-4xl">LET'S BUILD YOURS</h2>
            <p className="mt-4 text-muted-foreground">
              Tell the avatar what you need, or send a brief through the contact page.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={open}
                className="glow-ring rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:scale-105"
              >
                Chat now
              </button>
              <Link
                to="/contact"
                className="rounded-full border border-border px-6 py-3 font-semibold transition hover:bg-secondary"
              >
                Contact us
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
