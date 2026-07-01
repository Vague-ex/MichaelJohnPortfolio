import type { SiteSettings } from "@/lib/types";
import type { NavItem } from "@/components/public/SiteHeader";
import SocialIcon, { type SocialName } from "@/components/public/SocialIcon";

export default function SiteFooter({
  settings,
  navItems = [],
}: {
  settings: SiteSettings;
  navItems?: NavItem[];
}) {
  const { facebook, instagram, email } = settings.socials ?? {};
  const year = new Date().getFullYear();

  const socials = (
    [
      { url: instagram, name: "instagram", label: "Instagram" },
      { url: facebook, name: "facebook", label: "Facebook" },
      {
        url: email ? `mailto:${email}` : undefined,
        name: "email",
        label: "Email",
      },
    ] satisfies { url?: string; name: SocialName; label: string }[]
  ).filter((s) => s.url);

  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm space-y-2">
            <p className="font-display text-lg font-semibold">
              {settings.site_title}
            </p>
            {settings.tagline && (
              <p className="text-sm text-muted">{settings.tagline}</p>
            )}
          </div>

          {navItems.length > 0 && (
            <nav className="flex flex-col gap-2 text-sm">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted transition hover:text-accent"
                >
                  {item.title}
                </a>
              ))}
            </nav>
          )}

          {socials.length > 0 && (
            <div className="flex gap-3">
              {socials.map(({ url, name, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition hover:border-accent hover:text-accent"
                >
                  <SocialIcon name={name} size={18} />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 border-t border-line pt-6 text-sm text-muted">
          © {year} {settings.site_title}
        </div>
      </div>
    </footer>
  );
}
