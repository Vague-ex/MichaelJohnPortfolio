"use client";

import ImageInput from "@/components/admin/ImageInput";
import { getEmbedUrl } from "@/lib/blocks";
import type {
  Block,
  ColumnItem,
  ImageRef,
  TextAlign,
} from "@/lib/types";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm focus:border-neutral-900 focus:outline-none";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  );
}

function AlignField({
  value,
  onChange,
}: {
  value: TextAlign;
  onChange: (v: TextAlign) => void;
}) {
  return (
    <Field label="Alignment">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TextAlign)}
        className={inputClass}
      >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>
    </Field>
  );
}

export default function BlockEditor({
  block,
  onChange,
}: {
  block: Block;
  onChange: (block: Block) => void;
}) {
  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-3">
          <Field label="Heading">
            <input
              className={inputClass}
              value={block.heading}
              onChange={(e) => onChange({ ...block, heading: e.target.value })}
            />
          </Field>
          <Field label="Subheading">
            <input
              className={inputClass}
              value={block.subheading ?? ""}
              onChange={(e) =>
                onChange({ ...block, subheading: e.target.value })
              }
            />
          </Field>
          <AlignField
            value={block.align ?? "center"}
            onChange={(align) => onChange({ ...block, align })}
          />
          <Field label="Background image (optional)">
            <ImageInput
              value={block.image}
              onChange={(image) => onChange({ ...block, image })}
            />
          </Field>
        </div>
      );

    case "rich_text":
      return (
        <div className="space-y-3">
          <Field label="Heading (optional)">
            <input
              className={inputClass}
              value={block.heading ?? ""}
              onChange={(e) => onChange({ ...block, heading: e.target.value })}
            />
          </Field>
          <Field label="Text">
            <textarea
              className={`${inputClass} min-h-32`}
              value={block.text}
              placeholder="Leave a blank line between paragraphs."
              onChange={(e) => onChange({ ...block, text: e.target.value })}
            />
          </Field>
          <AlignField
            value={block.align ?? "left"}
            onChange={(align) => onChange({ ...block, align })}
          />
        </div>
      );

    case "image":
      return (
        <Field label="Image">
          <ImageInput
            value={block.image}
            showCaption
            onChange={(image) =>
              onChange({ ...block, image: image ?? { url: "" } })
            }
          />
        </Field>
      );

    case "gallery": {
      const updateImage = (i: number, img: ImageRef | undefined) => {
        const images = [...block.images];
        if (img) images[i] = img;
        else images.splice(i, 1);
        onChange({ ...block, images });
      };
      const move = (i: number, dir: -1 | 1) => {
        const j = i + dir;
        if (j < 0 || j >= block.images.length) return;
        const images = [...block.images];
        [images[i], images[j]] = [images[j], images[i]];
        onChange({ ...block, images });
      };
      return (
        <div className="space-y-3">
          <Field label="Heading (optional)">
            <input
              className={inputClass}
              value={block.heading ?? ""}
              onChange={(e) => onChange({ ...block, heading: e.target.value })}
            />
          </Field>
          <Field label="Columns (desktop)">
            <select
              className={inputClass}
              value={block.columns}
              onChange={(e) =>
                onChange({ ...block, columns: Number(e.target.value) })
              }
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>

          <div className="space-y-3">
            {block.images.map((img, i) => (
              <div
                key={i}
                className="rounded-md border border-neutral-200 bg-neutral-50 p-2"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    Image {i + 1}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      className="rounded border border-neutral-300 px-1.5 text-xs"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      className="rounded border border-neutral-300 px-1.5 text-xs"
                    >
                      ↓
                    </button>
                  </div>
                </div>
                <ImageInput
                  value={img}
                  showCaption
                  onChange={(next) => updateImage(i, next)}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              onChange({ ...block, images: [...block.images, { url: "" }] })
            }
            className="rounded-md border border-dashed border-neutral-400 px-3 py-1.5 text-sm hover:bg-neutral-100"
          >
            + Add image
          </button>
        </div>
      );
    }

    case "columns": {
      const updateCol = (i: number, patch: Partial<ColumnItem>) => {
        const columns = block.columns.map((c, idx) =>
          idx === i ? { ...c, ...patch } : c,
        );
        onChange({ ...block, columns });
      };
      const removeCol = (i: number) =>
        onChange({
          ...block,
          columns: block.columns.filter((_, idx) => idx !== i),
        });
      return (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {block.columns.map((col, i) => (
              <div
                key={i}
                className="space-y-2 rounded-md border border-neutral-200 bg-neutral-50 p-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-500">
                    Column {i + 1}
                  </span>
                  {block.columns.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCol(i)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  className={inputClass}
                  placeholder="Heading (optional)"
                  value={col.heading ?? ""}
                  onChange={(e) => updateCol(i, { heading: e.target.value })}
                />
                <textarea
                  className={`${inputClass} min-h-20`}
                  placeholder="Text (optional)"
                  value={col.text ?? ""}
                  onChange={(e) => updateCol(i, { text: e.target.value })}
                />
                <ImageInput
                  value={col.image}
                  onChange={(image) => updateCol(i, { image })}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              onChange({ ...block, columns: [...block.columns, { text: "" }] })
            }
            className="rounded-md border border-dashed border-neutral-400 px-3 py-1.5 text-sm hover:bg-neutral-100"
          >
            + Add column
          </button>
        </div>
      );
    }

    case "video_embed": {
      const valid = !block.url || getEmbedUrl(block.url) !== null;
      return (
        <div className="space-y-3">
          <Field label="YouTube or Vimeo link">
            <input
              className={inputClass}
              placeholder="https://www.youtube.com/watch?v=…"
              value={block.url}
              onChange={(e) => onChange({ ...block, url: e.target.value })}
            />
          </Field>
          {!valid && (
            <p className="text-xs text-red-600">
              That doesn&apos;t look like a YouTube or Vimeo link.
            </p>
          )}
          <Field label="Caption (optional)">
            <input
              className={inputClass}
              value={block.caption ?? ""}
              onChange={(e) => onChange({ ...block, caption: e.target.value })}
            />
          </Field>
        </div>
      );
    }

    case "divider":
      return (
        <p className="text-sm text-neutral-500">
          A horizontal divider. Nothing to configure.
        </p>
      );
  }
}
