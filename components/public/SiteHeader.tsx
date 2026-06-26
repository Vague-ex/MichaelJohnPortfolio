"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  title: string;
  href: string;
}

export default function SiteHeader({
  siteTitle,
  items,
  contactEmail,
}: {
  siteTitle: string;
  items: NavItem[];
  contactEmail?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const hasContact = items.some((i) => i.href === "/contact");

  // "Hire me" opens a pre-filled Gmail compose window when an email is set,
  // otherwise falls back to the contact page.
  const gmailHref = contactEmail
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        contactEmail,
      )}&su=${encodeURIComponent(
        `Project inquiry for ${siteTitle}`,
      )}&body=${encodeURIComponent(
        `Hi ${siteTitle},\n\nI came across your portfolio and I'd love to work with you on a project.\n\nHere are a few details:\n- What I need: \n- Timeline: \n- Budget: \n\nThanks!`,
      )}`
    : null;
  const hireHref = gmailHref ?? (hasContact ? "/contact" : null);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight transition hover:text-accent"
        >
          {siteTitle}
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden gap-6 text-sm sm:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href
                    ? "font-medium text-accent"
                    : "text-muted transition hover:text-foreground"
                }
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {hireHref && (
            <a
              href={hireHref}
              {...(gmailHref
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
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
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-1 text-sm text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
