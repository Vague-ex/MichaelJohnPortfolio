"use client";

import { useRef, useState } from "react";
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

      // Track the upload (best-effort; ignore failures).
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
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100 disabled:opacity-60"
          >
            {uploading ? "Uploading…" : value?.url ? "Replace image" : "Upload image"}
          </button>
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
    </div>
  );
}
