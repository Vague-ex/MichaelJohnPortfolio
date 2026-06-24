"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { newId } from "@/lib/blocks";
import type { ImageRef } from "@/lib/types";

function readDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

function readDimensionsFromUrl(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = url;
  });
}

interface MediaRow {
  id: string;
  url: string;
  alt: string | null;
}

function MediaPicker({
  onPick,
  onClose,
}: {
  onPick: (row: MediaRow) => void;
  onClose: () => void;
}) {
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("media")
        .select("id, url, alt")
        .order("created_at", { ascending: false })
        .limit(120);
      setRows((data as MediaRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <h3 className="text-sm font-semibold">Choose an existing image</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-neutral-500 hover:bg-neutral-100"
          >
            Close
          </button>
        </div>
        <div className="overflow-y-auto p-4">
          {loading ? (
            <p className="py-8 text-center text-sm text-neutral-500">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500">
              No uploads yet. Use “Upload image” to add your first one.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {rows.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => onPick(row)}
                  className="relative aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 transition hover:ring-2 hover:ring-neutral-900"
                >
                  <Image
                    src={row.url}
                    alt={row.alt ?? ""}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ImageInput({
  value,
  onChange,
  showCaption = false,
}: {
  value?: ImageRef;
  onChange: (image: ImageRef | undefined) => void;
  showCaption?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${Date.now()}-${newId()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(path);

      const { width, height } = await readDimensions(file);

      await supabase.from("media").insert({ url: publicUrl, path, alt: "" });

      onChange({
        url: publicUrl,
        alt: value?.alt ?? "",
        caption: value?.caption,
        width: width || undefined,
        height: height || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handlePick(row: MediaRow) {
    setPickerOpen(false);
    const { width, height } = await readDimensionsFromUrl(row.url);
    onChange({
      url: row.url,
      alt: row.alt ?? value?.alt ?? "",
      caption: value?.caption,
      width: width || undefined,
      height: height || undefined,
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
          {value?.url ? (
            <Image
              src={value.url}
              alt={value.alt ?? ""}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
              No image
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100 disabled:opacity-60"
            >
              {uploading
                ? "Uploading…"
                : value?.url
                  ? "Replace image"
                  : "Upload image"}
            </button>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
            >
              Choose existing
            </button>
          </div>
          {value?.url && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="text-left text-xs text-red-600 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      {value?.url && (
        <input
          type="text"
          placeholder="Alt text (describe the image)"
          value={value.alt ?? ""}
          onChange={(e) => onChange({ ...value, alt: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-2 py-1 text-sm"
        />
      )}

      {value?.url && showCaption && (
        <input
          type="text"
          placeholder="Caption (optional)"
          value={value.caption ?? ""}
          onChange={(e) => onChange({ ...value, caption: e.target.value })}
          className="w-full rounded-md border border-neutral-300 px-2 py-1 text-sm"
        />
      )}

      {pickerOpen && (
        <MediaPicker onPick={handlePick} onClose={() => setPickerOpen(false)} />
      )}
    </div>
  );
}
