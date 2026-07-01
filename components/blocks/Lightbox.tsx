"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { ImageRef } from "@/lib/types";

/**
 * Shared image viewer: picture on the left, an info panel on the right showing
 * the piece's title, date, and description (Facebook / Shopee style). Used by
 * both the gallery and album blocks.
 */
export default function Lightbox({
  images,
  initialIndex = 0,
  contextTitle,
  onClose,
}: {
  images: ImageRef[];
  initialIndex?: number;
  contextTitle?: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const total = images.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, next, prev]);

  const img = images[index];
  if (!img) return null;
  const title = img.caption || img.alt || contextTitle || "Untitled";

  return (
    <div
      className="fixed inset-0 z-50 flex bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex h-full w-full flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image stage */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center p-4 md:p-8">
          {total > 1 && (
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/25 md:left-4"
            >
              ‹
            </button>
          )}
          <div className="relative h-full max-h-[55vh] w-full md:max-h-[85vh]">
            <Image
              src={img.url}
              alt={img.alt ?? title}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
          {total > 1 && (
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/25 md:right-4"
            >
              ›
            </button>
          )}
        </div>

        {/* Info panel */}
        <aside className="w-full shrink-0 overflow-y-auto bg-background p-6 md:h-full md:w-[360px]">
          <button
            type="button"
            onClick={onClose}
            className="mb-4 rounded-md px-2 py-1 text-sm text-muted hover:bg-neutral-100"
          >
            ✕ Close
          </button>

          {contextTitle && (
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">
              {contextTitle}
            </p>
          )}
          <h3 className="mt-1 text-xl font-semibold">{title}</h3>
          {img.date && <p className="mt-1 text-sm text-muted">{img.date}</p>}
          {img.description && (
            <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">
              {img.description}
            </p>
          )}

          <p className="mt-6 text-xs text-muted">
            {index + 1} / {total}
          </p>

          {total > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {images.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-md ring-2 transition ${
                    i === index ? "ring-accent" : "opacity-60 ring-transparent"
                  }`}
                >
                  <Image
                    src={t.url}
                    alt={t.alt ?? ""}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
