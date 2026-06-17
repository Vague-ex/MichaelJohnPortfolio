import type { SiteSettings } from "@/lib/types";

export default function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { facebook, instagram, email } = settings.socials ?? {};
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted sm:flex-row">
        <p>
          © {year} {settings.site_title}
        </p>
        <div className="flex gap-4">
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-accent"
            >
              Instagram
            </a>
          )}
          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-accent"
            >
              Facebook
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="hover:text-neutral-900">
              Email
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
