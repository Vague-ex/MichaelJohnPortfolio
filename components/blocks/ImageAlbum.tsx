"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { Album, ImageAlbumBlock, ImageRef } from "@/lib/types";

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

function AlbumCard({
  album,
  onOpen,
}: {
  album: Album;
  onOpen: () => void;
}) {
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

      <div className="col-span-3 flex items-center justify-between pt-1">
        <h3 className="text-lg font-semibold transition group-hover:text-accent">
          {album.title}
        </h3>
        <span className="flex items-center gap-1 text-xs font-medium text-muted">
          <ImageCountIcon />
          {count}
        </span>
      </div>
    </div>
  );
}

function Lightbox({
  album,
  index,
  setIndex,
  onClose,
}: {
  album: Album;
  index: number;
  setIndex: (updater: (i: number) => number) => void;
  onClose: () => void;
}) {
  const total = album.images.length;
  const next = useCallback(
    () => setIndex((i) => (i + 1) % total),
    [setIndex, total],
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [setIndex, total],
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

  const img: ImageRef | undefined = album.images[index];
  if (!img) return null;
  const title = img.caption || img.alt || album.title;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-between text-white">
        <span className="text-sm font-medium">{album.title}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded-full px-3 py-1 text-sm hover:bg-white/15"
        >
          ✕ Close
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {total > 1 && (
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/25"
          >
            ‹
          </button>
        )}

        <div className="relative h-full max-h-[68vh] w-full max-w-4xl">
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
            className="absolute right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/25"
          >
            ›
          </button>
        )}
      </div>

      <div
        className="space-y-3 text-center text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="text-base font-medium">{title}</p>
          <p className="text-xs text-white/60">
            {index + 1} / {total}
          </p>
        </div>

        {total > 1 && (
          <div className="flex justify-center gap-2 overflow-x-auto pb-1">
            {album.images.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(() => i)}
                aria-label={`Go to image ${i + 1}`}
                className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-md ring-2 transition ${
                  i === index ? "ring-accent" : "ring-transparent opacity-60"
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
      </div>
    </div>
  );
}

export default function ImageAlbum({ block }: { block: ImageAlbumBlock }) {
  const [openAlbum, setOpenAlbum] = useState<number | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const albums = block.albums ?? [];

  const open = (i: number) => {
    setImageIndex(0);
    setOpenAlbum(i);
  };

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
          <AlbumCard key={album.id} album={album} onOpen={() => open(i)} />
        ))}
      </div>

      {openAlbum !== null && albums[openAlbum] && (
        <Lightbox
          album={albums[openAlbum]}
          index={imageIndex}
          setIndex={setImageIndex}
          onClose={() => setOpenAlbum(null)}
        />
      )}
    </section>
  );
}
