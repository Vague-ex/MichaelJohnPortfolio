import type { Metadata } from "next";
import BlockRenderer from "@/components/blocks/BlockRenderer";
import { getPublishedPages, getSiteSettings } from "@/lib/data";

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
  const [pages, settings] = await Promise.all([
    getPublishedPages(),
    getSiteSettings(),
  ]);

  if (pages.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center text-muted">
        <p>This portfolio is being set up. Please check back soon.</p>
      </main>
    );
  }

  // Single scrolling page: every published page becomes an anchored section.
  return (
    <main>
      {pages.map((page) => (
        <section key={page.id} id={page.slug} className="scroll-mt-20">
          <BlockRenderer blocks={page.content ?? []} settings={settings} />
        </section>
      ))}
    </main>
  );
}
