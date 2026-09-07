import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Mail, Trash2, CheckCheck, LogOut, RefreshCw, Inbox, Plus, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Reveal } from "@/components/Reveal";
import { fetchPortfolio, uploadCover, type PortfolioCategory, type PortfolioItem } from "@/lib/portfolio";

const SITE = "https://avatar-journey-web.lovable.app";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — SAIF Solutions" },
      { name: "description", content: "Private dashboard for SAIF Solutions enquiries and portfolio." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard — SAIF Solutions" },
      { property: "og:description", content: "Private dashboard for SAIF Solutions enquiries and portfolio." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/admin` },
    ],
  }),
  component: AdminPage,
});

type Submission = {
  id: string;
  name: string;
  email: string;
  service: string;
  brief: string;
  is_read: boolean;
  created_at: string;
};

const emptyItem = {
  category_id: "",
  title: "",
  description: "",
  result: "",
  cover_url: "",
  video_url: "",
  external_url: "",
};

function AdminPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "denied" | "ready">("loading");
  const [tab, setTab] = useState<"enquiries" | "portfolio">("enquiries");
  const [rows, setRows] = useState<Submission[]>([]);
  const [email, setEmail] = useState("");

  const [categories, setCategories] = useState<PortfolioCategory[]>([]);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [form, setForm] = useState({ ...emptyItem });
  const [uploading, setUploading] = useState(false);
  const [savingItem, setSavingItem] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Could not load enquiries.");
      return;
    }
    setRows((data ?? []) as Submission[]);
  }, []);

  const loadPortfolio = useCallback(async () => {
    const data = await fetchPortfolio();
    if (data.error) {
      toast.error("Could not load the portfolio.");
      return;
    }
    setCategories(data.categories);
    setItems(data.items);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        navigate({ to: "/auth" });
        return;
      }
      setEmail(session.user.email ?? "");
      await supabase.rpc("claim_admin");
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");
      if (cancelled) return;
      if (!roles || roles.length === 0) {
        setStatus("denied");
        return;
      }
      setStatus("ready");
      await Promise.all([load(), loadPortfolio()]);
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate, load, loadPortfolio]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  const markRead = async (row: Submission) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ is_read: !row.is_read })
      .eq("id", row.id);
    if (error) {
      toast.error("Update failed.");
      return;
    }
    setRows((r) => r.map((x) => (x.id === row.id ? { ...x, is_read: !x.is_read } : x)));
  };

  const remove = async (row: Submission) => {
    const { error } = await supabase.from("contact_submissions").delete().eq("id", row.id);
    if (error) {
      toast.error("Delete failed.");
      return;
    }
    setRows((r) => r.filter((x) => x.id !== row.id));
    toast.success("Enquiry deleted.");
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    const { error } = await supabase.from("portfolio_categories").insert({
      name: catName.trim(),
      description: catDesc.trim() || null,
      sort_order: categories.length,
    });
    if (error) {
      toast.error("Could not add the category.");
      return;
    }
    setCatName("");
    setCatDesc("");
    toast.success("Category added.");
    await loadPortfolio();
  };

  const removeCategory = async (id: string) => {
    const { error } = await supabase.from("portfolio_categories").delete().eq("id", id);
    if (error) {
      toast.error("Could not remove the category.");
      return;
    }
    toast.success("Category removed with its items.");
    await loadPortfolio();
  };

  const removeAllCategories = async () => {
    if (categories.length === 0) return;
    const { error } = await supabase
      .from("portfolio_categories")
      .delete()
      .in("id", categories.map((c) => c.id));
    if (error) {
      toast.error("Could not clear the categories.");
      return;
    }
    toast.success("All categories removed.");
    await loadPortfolio();
  };

  const onCoverPick = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadCover(file);
      setForm((f) => ({ ...f, cover_url: url }));
      toast.success("Cover uploaded.");
    } catch {
      toast.error("Upload failed. Try a smaller image.");
    } finally {
      setUploading(false);
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSavingItem(true);
    const { error } = await supabase.from("portfolio_items").insert({
      category_id: form.category_id || null,
      title: form.title.trim(),
      description: form.description.trim() || null,
      result: form.result.trim() || null,
      cover_url: form.cover_url || null,
      video_url: form.video_url.trim() || null,
      external_url: form.external_url.trim() || null,
      sort_order: items.length,
    });
    setSavingItem(false);
    if (error) {
      toast.error("Could not save the item.");
      return;
    }
    setForm({ ...emptyItem });
    toast.success("Portfolio item added.");
    await loadPortfolio();
  };

  const changeCover = async (item: PortfolioItem, file: File | undefined) => {
    if (!file) return;
    try {
      const url = await uploadCover(file);
      const { error } = await supabase.from("portfolio_items").update({ cover_url: url }).eq("id", item.id);
      if (error) throw error;
      toast.success("Cover updated.");
      await loadPortfolio();
    } catch {
      toast.error("Could not change the cover.");
    }
  };

  const removeItem = async (id: string) => {
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
    if (error) {
      toast.error("Could not remove the item.");
      return;
    }
    toast.success("Item removed.");
    await loadPortfolio();
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="chrome-text text-3xl">ADMIN ONLY</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          {email} does not have admin access. Sign in with the admin account to continue.
        </p>
        <button
          onClick={signOut}
          className="rounded-full border border-border px-5 py-2 font-semibold transition hover:bg-secondary"
        >
          Switch account
        </button>
      </div>
    );
  }

  const unread = rows.filter((r) => !r.is_read).length;
  const inputClass =
    "mt-1 w-full rounded-xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="px-4 pb-32 pt-28 md:px-6 md:pt-32">
      <Reveal>
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-xs tracking-[0.4em] text-accent">DASHBOARD</p>
            <h1 className="chrome-text mt-2 text-4xl md:text-5xl">CONTROL ROOM</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Signed in as {email} · {rows.length} enquiries · {unread} unread · {items.length} portfolio items
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                void load();
                void loadPortfolio();
              }}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:bg-secondary"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </Reveal>

      <div className="mx-auto mt-8 flex max-w-5xl gap-2">
        {(["enquiries", "portfolio"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
              tab === t ? "bg-primary text-primary-foreground" : "border border-border hover:bg-secondary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "enquiries" && (
        <div className="mx-auto mt-8 grid max-w-5xl gap-4">
          {rows.length === 0 && (
            <div className="glass-card flex flex-col items-center gap-3 rounded-3xl p-12 text-center text-muted-foreground">
              <Inbox className="h-8 w-8 text-accent" />
              No enquiries yet. Briefs sent from the contact page land here.
            </div>
          )}

          {rows.map((row, i) => (
            <Reveal key={row.id} delay={Math.min(i * 60, 240)}>
              <article className={`tilt-3d glass-card rounded-2xl p-6 ${row.is_read ? "opacity-70" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg">{row.name}</p>
                    <a
                      href={`mailto:${row.email}`}
                      className="mt-1 flex items-center gap-2 text-sm text-accent"
                    >
                      <Mail className="h-4 w-4" /> {row.email}
                    </a>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p className="font-display tracking-widest text-accent">{row.service}</p>
                    <p className="mt-1">{new Date(row.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">{row.brief}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => markRead(row)}
                    className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:scale-105"
                  >
                    <CheckCheck className="h-4 w-4" /> {row.is_read ? "Mark unread" : "Mark read"}
                  </button>
                  <button
                    onClick={() => remove(row)}
                    className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold transition hover:bg-secondary"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}

      {tab === "portfolio" && (
        <div className="mx-auto mt-8 grid max-w-5xl gap-6">
          <section className="glass-card rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl">Categories</h2>
              {categories.length > 0 && (
                <button
                  onClick={removeAllCategories}
                  className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold transition hover:bg-secondary"
                >
                  <Trash2 className="h-4 w-4" /> Remove all categories
                </button>
              )}
            </div>

            <form onSubmit={addCategory} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1.4fr_auto]">
              <input
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="Category name"
                className={inputClass}
              />
              <input
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                placeholder="Short description (optional)"
                className={inputClass}
              />
              <button
                type="submit"
                className="glow-ring mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-105"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {categories.length === 0 && (
                <p className="text-sm text-muted-foreground">No categories yet — add your first one above.</p>
              )}
              {categories.map((c) => (
                <span
                  key={c.id}
                  className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm"
                >
                  {c.name}
                  <button
                    onClick={() => removeCategory(c.id)}
                    aria-label={`Remove ${c.name}`}
                    className="text-muted-foreground transition hover:text-foreground"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </section>

          <section className="glass-card rounded-3xl p-6">
            <h2 className="font-display text-xl">Add portfolio item</h2>
            <form onSubmit={addItem} className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="text-sm">
                Title
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className={inputClass}
                />
              </label>
              <label className="text-sm">
                Category
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className={inputClass}
                >
                  <option value="">No category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm md:col-span-2">
                Description
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={inputClass}
                />
              </label>
              <label className="text-sm">
                Highlight / result
                <input
                  value={form.result}
                  onChange={(e) => setForm({ ...form, result: e.target.value })}
                  placeholder="+38% conversion"
                  className={inputClass}
                />
              </label>
              <label className="text-sm">
                Video link (YouTube, Vimeo…)
                <input
                  value={form.video_url}
                  onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                  placeholder="https://youtu.be/..."
                  className={inputClass}
                />
              </label>
              <label className="text-sm">
                External project link
                <input
                  value={form.external_url}
                  onChange={(e) => setForm({ ...form, external_url: e.target.value })}
                  placeholder="https://..."
                  className={inputClass}
                />
              </label>
              <label className="text-sm">
                Cover image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onCoverPick(e.target.files?.[0])}
                  className={`${inputClass} file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1 file:text-primary-foreground`}
                />
              </label>
              {(uploading || form.cover_url) && (
                <div className="md:col-span-2 flex items-center gap-3 text-sm text-muted-foreground">
                  <ImagePlus className="h-4 w-4 text-accent" />
                  {uploading ? "Uploading cover..." : "Cover ready"}
                  {form.cover_url && !uploading && (
                    <img src={form.cover_url} alt="" className="h-16 w-24 rounded-lg object-cover" />
                  )}
                </div>
              )}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={savingItem || uploading}
                  className="glow-ring rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-105 disabled:opacity-60"
                >
                  {savingItem ? "Saving..." : "Add item"}
                </button>
              </div>
            </form>
          </section>

          <section className="grid gap-4">
            {items.length === 0 && (
              <div className="glass-card rounded-3xl p-10 text-center text-muted-foreground">
                No portfolio items yet.
              </div>
            )}
            {items.map((item) => (
              <article key={item.id} className="glass-card flex flex-wrap gap-4 rounded-2xl p-5">
                {item.cover_url ? (
                  <img src={item.cover_url} alt="" className="h-24 w-36 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-24 w-36 items-center justify-center rounded-xl bg-secondary text-xs text-muted-foreground">
                    No cover
                  </div>
                )}
                <div className="min-w-[12rem] flex-1">
                  <p className="font-display text-lg">{item.title}</p>
                  <p className="text-xs text-accent">
                    {categories.find((c) => c.id === item.category_id)?.name ?? "No category"}
                    {item.result ? ` · ${item.result}` : ""}
                  </p>
                  {item.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                    <label className="cursor-pointer rounded-full border border-border px-4 py-2 font-semibold transition hover:bg-secondary">
                      Change cover
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => changeCover(item, e.target.files?.[0])}
                      />
                    </label>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="flex items-center gap-2 rounded-full border border-border px-4 py-2 font-semibold transition hover:bg-secondary"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                    {item.external_url && (
                      <a href={item.external_url} target="_blank" rel="noreferrer noopener" className="text-accent">
                        Link
                      </a>
                    )}
                    {item.video_url && (
                      <a href={item.video_url} target="_blank" rel="noreferrer noopener" className="text-accent">
                        Video
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}
