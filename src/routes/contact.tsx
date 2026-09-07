import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, MessageCircle, Globe2, Clock } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/Reveal";
import { AvatarGuide, type GuideStop } from "@/components/AvatarGuide";
import { useAvatarChat } from "@/components/AvatarChatProvider";
import { supabase } from "@/integrations/supabase/client";


const SITE = "https://avatar-journey-web.lovable.app";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SAIF Solutions — Start a Web, Design or Growth Project" },
      {
        name: "description",
        content:
          "Send SAIF Solutions your brief for 3D web development, graphic design or marketing, or chat live with our robot assistant.",
      },
      { property: "og:title", content: "Contact SAIF Solutions" },
      {
        property: "og:description",
        content: "Start a web, design or growth project with SAIF Solutions.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/contact` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/contact` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: `${SITE}/contact`,
          name: "Contact SAIF Solutions",
          about: {
            "@type": "Organization",
            name: "SAIF Solutions",
            areaServed: "Worldwide",
          },
        }),
      },
    ],
  }),
  component: Contact,
});


const stops: GuideStop[] = [
  { id: "contact-form", line: "Drop your brief here — or just chat with me instead.", side: "left" },
];

const services = ["Web Solutions", "Graphic Solutions", "Marketing Solutions"];

function Contact() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [service, setService] = useState(services[0]);
  const { open } = useAvatarChat();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setBusy(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      service: service ?? "Web Solutions",
      brief: String(fd.get("brief") ?? ""),
    });
    setBusy(false);
    if (error) {
      toast.error("Could not send your brief. Please try again.");
      return;
    }
    setSent(true);
    toast.success("Brief received — we'll reply within one business day.");
    form.reset();
  };


  return (
    <div className="px-6 pb-32 pt-32">
      <AvatarGuide stops={stops} />

      <Reveal>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-xs tracking-[0.4em] text-accent">CONTACT</p>
          <h1 className="chrome-text mt-4 text-5xl md:text-6xl">START A PROJECT</h1>
        </div>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-[1.4fr_1fr]">
        <Reveal>
          <form id="contact-form" onSubmit={submit} className="glass-card rounded-3xl p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                Name
                <input
                  required
                  name="name"
                  className="mt-1 w-full rounded-xl bg-secondary px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="text-sm">
                Email
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-1 w-full rounded-xl bg-secondary px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
            </div>

            <p className="mt-5 text-sm">Service</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {services.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setService(s)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    service === s
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-secondary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <label className="mt-5 block text-sm">
              Project brief
              <textarea
                required
                name="brief"
                rows={5}
                className="mt-1 w-full rounded-xl bg-secondary px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
              />
            </label>

            <button
              type="submit"
              disabled={busy}
              className="glow-ring disabled:opacity-60 mt-6 w-full rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:scale-[1.02]"
            >
              {busy ? "Sending..." : "Send brief"}
            </button>

            {sent && (
              <p className="animate-pop-3d mt-4 flex items-center gap-2 text-sm text-accent">
                <CheckCircle2 className="h-4 w-4" /> Received. We'll be in touch shortly.
              </p>
            )}
          </form>
        </Reveal>

        <Reveal delay={120}>
          <div className="tilt-3d glass-card h-full rounded-3xl p-8">
            <h2 className="font-display text-xl">Direct lines</h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent" /> hello@saifsolutions.com
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent" /> +1 (555) 018-4420
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-accent" /> Remote · worldwide
              </li>
            </ul>
            <button
              onClick={open}
              className="mt-8 w-full rounded-full border border-border px-5 py-3 font-semibold transition hover:bg-secondary"
            >
              Chat with the avatar
            </button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
