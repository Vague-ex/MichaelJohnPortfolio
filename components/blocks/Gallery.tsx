"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryBlock } from "@/lib/types";
import Lightbox from "@/components/blocks/Lightbox";

const gridColsClass: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-3 lg:grid-cols-5",
  6: "sm:grid-cols-3 lg:grid-cols-6",
};

export default function Gallery({ block }: { block: GalleryBlock }) {
  const [open, setOpen] = useState<number | null>(null);
  const cols = gridColsClass[block.columns] ?? gridColsClass[3];
  const images = block.images.filter((img) => img.url);
  if (images.length === 0 && !block.heading) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      {block.heading && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">{block.heading}</h2>
          <span className="mt-3 block h-1 w-12 rounded-full bg-accent" />
        </div>
      )}
      <div className={`grid grid-cols-1 gap-5 ${cols}`}>
        {images.map((img, i) => (
          <figure
            key={i}
            onClick={() => setOpen(i)}
            className="group relative cursor-pointer overflow-hidden rounded-xl bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={img.url}
                alt={img.alt ?? ""}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            {(img.caption || img.date) && (
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                {img.caption && (
                  <span className="text-sm font-medium text-white">
                    {img.caption}
                  </span>
                )}
                {img.date && (
                  <span className="text-xs text-white/70">{img.date}</span>
                )}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {open !== null && (
        <Lightbox
          images={images}
          initialIndex={open}
          contextTitle={block.heading}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
