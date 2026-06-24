import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";
import { getNavItems, getSiteSettings } from "@/lib/data";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, navItems] = await Promise.all([
    getSiteSettings(),
    getNavItems(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader siteTitle={settings.site_title} items={navItems} />
      <div className="flex-1">{children}</div>
      <SiteFooter settings={settings} navItems={navItems} />
    </div>
  );
}
