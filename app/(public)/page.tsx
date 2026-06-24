import type { Metadata } from "next";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getPageBySlug, getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.site_title,
    description: settings.tagline,
    openGraph: {
      title: settings.site_title,
      description: settings.tagline,
      type: "website",
    },
  };
}

export default async function HomePage() {
  const [page, settings] = await Promise.all([
    getPageBySlug("home"),
    getSiteSettings(),
  ]);

  if (!page) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center text-muted">
        <p>This portfolio is being set up. Please check back soon.</p>
      </main>
    );
  }

  return (
    <main>
      <BlockRenderer blocks={page.content ?? []} settings={settings} />
    </main>
  );
}
