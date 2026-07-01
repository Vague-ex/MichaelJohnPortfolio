"use client";

import { useState } from "react";
import Image from "next/image";
import type { Album, ImageAlbumBlock } from "@/lib/types";
import Lightbox from "@/components/blocks/Lightbox";

function ImageCountIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function AlbumCard({ album, onOpen }: { album: Album; onOpen: () => void }) {
  const cover = album.cover?.url ? album.cover : album.images[0];
  const thumbs = (album.cover?.url ? album.images : album.images.slice(1)).slice(
    0,
    3,
  );
  const count = album.images.length;
  const clickable = count > 0;

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? onOpen : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen();
              }
            }
          : undefined
      }
      className={`group grid grid-cols-3 gap-3 rounded-3xl bg-card p-4 shadow-sm transition ${
        clickable
          ? "cursor-pointer hover:-translate-y-1 hover:shadow-lg"
          : "opacity-90"
      }`}
    >
      <div className="relative col-span-3 aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
        {cover?.url ? (
          <Image
            src={cover.url}
            alt={cover.alt ?? album.title}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 320px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-sm text-muted">
            No images yet
          </span>
        )}
      </div>

      {[0, 1, 2].map((i) => {
        const t = thumbs[i];
        return (
          <div
            key={i}
            className="relative h-16 overflow-hidden rounded-xl bg-surface"
          >
            {t?.url && (
              <Image
                src={t.url}
                alt={t.alt ?? ""}
                fill
                sizes="120px"
                className="object-cover"
              />
            )}
          </div>
        );
      })}

      <div className="col-span-3 flex items-start justify-between pt-1">
        <div>
          <h3 className="text-lg font-semibold transition group-hover:text-accent">
            {album.title}
          </h3>
          {album.date && (
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {album.date}
            </p>
          )}
        </div>
        <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-muted">
          <ImageCountIcon />
          {count}
        </span>
      </div>
    </div>
  );
}

export default function ImageAlbum({ block }: { block: ImageAlbumBlock }) {
  const [openAlbum, setOpenAlbum] = useState<number | null>(null);
  const albums = block.albums ?? [];

  if (albums.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      {block.heading && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold sm:text-3xl">{block.heading}</h2>
          <span className="mt-3 block h-1 w-12 rounded-full bg-accent" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album, i) => (
          <AlbumCard key={album.id} album={album} onOpen={() => setOpenAlbum(i)} />
        ))}
      </div>

      {openAlbum !== null && albums[openAlbum] && (
        <Lightbox
          images={albums[openAlbum].images}
          contextTitle={albums[openAlbum].title}
          onClose={() => setOpenAlbum(null)}
        />
      )}
    </section>
  );
}
