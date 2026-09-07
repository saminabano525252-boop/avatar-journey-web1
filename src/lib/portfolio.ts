import { supabase } from "@/integrations/supabase/client";

export type PortfolioCategory = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type PortfolioItem = {
  id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  result: string | null;
  cover_url: string | null;
  video_url: string | null;
  external_url: string | null;
  sort_order: number;
};

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

export async function fetchPortfolio() {
  const [cats, items] = await Promise.all([
    supabase
      .from("portfolio_categories")
      .select("id, name, description, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("portfolio_items")
      .select("id, category_id, title, description, result, cover_url, video_url, external_url, sort_order")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);

  return {
    categories: (cats.data ?? []) as PortfolioCategory[],
    items: (items.data ?? []) as PortfolioItem[],
    error: cats.error ?? items.error ?? null,
  };
}

/** Uploads a cover image to the private bucket and returns a long-lived signed URL. */
export async function uploadCover(file: File) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `covers/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("portfolio").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from("portfolio")
    .createSignedUrl(path, TEN_YEARS);
  if (signErr || !data) throw signErr ?? new Error("Could not create image link");
  return data.signedUrl;
}

/** Turns a YouTube/Vimeo/other link into something embeddable, when possible. */
export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed${u.pathname}`;
    if (u.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video${u.pathname}`;
    return null;
  } catch {
    return null;
  }
}
