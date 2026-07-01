"use client";

import { useEffect, useState } from "react";

export interface NavItem {
  title: string;
  href: string; // in-page anchor, e.g. "#about"
}

export default function SiteHeader({
  siteTitle,
  items,
  contactEmail,
  resumeUrl,
}: {
  siteTitle: string;
  items: NavItem[];
  contactEmail?: string;
  resumeUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Scroll-spy: highlight the nav item for the section currently in view.
  useEffect(() => {
    const ids = items.map((i) => i.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  const gmailHref = contactEmail
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        contactEmail,
      )}&su=${encodeURIComponent(
        `Project inquiry for ${siteTitle}`,
      )}&body=${encodeURIComponent(
        `Hi ${siteTitle},\n\nI came across your portfolio and I'd love to work with you on a project.\n\nHere are a few details:\n- What I need: \n- Timeline: \n- Budget: \n\nThanks!`,
      )}`
    : null;

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#home"
          className="font-display text-lg font-semibold tracking-tight transition hover:text-accent"
        >
          {siteTitle}
        </a>

        <div className="flex items-center gap-6">
          <nav className="hidden gap-6 text-sm sm:flex">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={
                  active === item.href.replace("#", "")
                    ? "font-medium text-accent"
                    : "text-muted transition hover:text-foreground"
                }
              >
                {item.title}
              </a>
            ))}
          </nav>

          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-foreground/20 px-5 py-2 text-sm font-medium transition hover:border-foreground sm:inline-block"
            >
              Résumé
            </a>
          )}

          {gmailHref && (
            <a
              href={gmailHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine hidden rounded-full bg-accent px-6 py-2 text-sm font-medium text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-[0_8px_24px_rgba(224,97,58,0.45)] sm:inline-block"
            >
              Hire me
            </a>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            className="sm:hidden"
            aria-label="Toggle menu"
          >
            <span className="block h-0.5 w-6 bg-foreground" />
            <span className="mt-1.5 block h-0.5 w-6 bg-foreground" />
            <span className="mt-1.5 block h-0.5 w-6 bg-foreground" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-line px-6 py-3 sm:hidden">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-1 text-sm text-foreground"
            >
              {item.title}
            </a>
          ))}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="py-1 text-sm font-medium text-accent"
            >
              Résumé
            </a>
          )}
        </nav>
      )}
    </header>
  );
}
