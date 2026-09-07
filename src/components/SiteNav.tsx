import { Link } from "@tanstack/react-router";
import logo from "@/assets/saif-logo.png.asset.json";

const links = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/contact", label: "Contact" },
  { to: "/admin", label: "Admin" },
] as const;


export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <nav className="glass-card mx-auto mt-4 flex w-[min(64rem,calc(100vw-2rem))] items-center justify-between rounded-full px-4 py-2">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo.url} alt="SAIF Solutions" width={40} height={40} className="h-9 w-9 object-contain" />
          <span className="font-display text-sm tracking-[0.2em] chrome-text">SAIF</span>
        </Link>
        <ul className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeProps={{ className: "bg-primary text-primary-foreground" }}
                className="rounded-full px-4 py-2 font-semibold transition hover:bg-secondary"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
