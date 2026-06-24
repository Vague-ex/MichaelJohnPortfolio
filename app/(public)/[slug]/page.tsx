import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getPageBySlug, getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [page, settings] = await Promise.all([
    getPageBySlug(slug),
    getSiteSettings(),
  ]);
  if (!page) return {};
  return {
    title: `${page.title} — ${settings.site_title}`,
    description: settings.tagline,
    openGraph: {
      title: `${page.title} — ${settings.site_title}`,
      description: settings.tagline,
      type: "website",
    },
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // "home" is served at "/" — don't duplicate it here.
  if (slug === "home") notFound();

  const [page, settings] = await Promise.all([
    getPageBySlug(slug),
    getSiteSettings(),
  ]);
  if (!page) notFound();

  return (
    <main>
      <BlockRenderer blocks={page.content ?? []} settings={settings} />
    </main>
  );
}
