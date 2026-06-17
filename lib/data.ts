import { createClient } from "@/lib/supabase/server";
import type { NavItem } from "@/components/public/SiteHeader";
import type { Page, SiteSettings } from "@/lib/types";

const FALLBACK_SETTINGS: SiteSettings = {
  id: "",
  site_title: "Portfolio",
  tagline: "",
  socials: {},
  updated_at: "",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("id, site_title, tagline, socials, updated_at")
    .limit(1)
    .maybeSingle();
  return (data as SiteSettings) ?? FALLBACK_SETTINGS;
}

/** Published pages that opt into the menu, ordered for the nav bar. */
export async function getNavItems(): Promise<NavItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select("slug, title, nav_order, published, show_in_nav")
    .eq("published", true)
    .eq("show_in_nav", true)
    .order("nav_order", { ascending: true });

  return (data ?? []).map((p) => ({
    title: p.title,
    href: p.slug === "home" ? "/" : `/${p.slug}`,
  }));
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select("id, slug, title, nav_order, published, show_in_nav, content, updated_at")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Page) ?? null;
}

/** Published, non-home slugs — used to pre-render dynamic pages. */
export async function getPublishedSlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select("slug")
    .eq("published", true)
    .neq("slug", "home");
  return (data ?? []).map((p) => p.slug);
}
