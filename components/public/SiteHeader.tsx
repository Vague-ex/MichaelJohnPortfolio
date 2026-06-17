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
}: {
  siteTitle: string;
  items: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          {siteTitle}
        </Link>

        <nav className="hidden gap-6 text-sm sm:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? "font-medium text-neutral-900"
                  : "text-neutral-500 transition hover:text-neutral-900"
              }
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="sm:hidden"
          aria-label="Toggle menu"
        >
          <span className="block h-0.5 w-6 bg-neutral-900" />
          <span className="mt-1.5 block h-0.5 w-6 bg-neutral-900" />
          <span className="mt-1.5 block h-0.5 w-6 bg-neutral-900" />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-neutral-200 px-6 py-3 sm:hidden">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-1 text-sm text-neutral-700"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
