"use client";

import ImageInput from "@/components/admin/ImageInput";
import { getEmbedUrl, newId } from "@/lib/blocks";
import type {
  Album,
  Block,
  BulletColumn,
  ColumnItem,
  ContactIcon,
  ContactItem,
  ImageRef,
  ProfileDetail,
  TextAlign,
  TimelineEntry,
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
          <Field label="Eyebrow (small label above heading)">
            <input
              className={inputClass}
              placeholder="e.g. Hi, I'm"
              value={block.eyebrow ?? ""}
              onChange={(e) => onChange({ ...block, eyebrow: e.target.value })}
            />
          </Field>
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
          <Field label="Photo / image (optional, shown beside the text)">
            <ImageInput
              value={block.image}
              onChange={(image) => onChange({ ...block, image })}
            />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Button text">
              <input
                className={inputClass}
                placeholder="e.g. View work"
                value={block.ctaText ?? ""}
                onChange={(e) => onChange({ ...block, ctaText: e.target.value })}
              />
            </Field>
            <Field label="Button link">
              <input
                className={inputClass}
                placeholder="/contact or https://…"
                value={block.ctaUrl ?? ""}
                onChange={(e) => onChange({ ...block, ctaUrl: e.target.value })}
              />
            </Field>
            <Field label="Second button text (optional)">
              <input
                className={inputClass}
                value={block.cta2Text ?? ""}
                onChange={(e) =>
                  onChange({ ...block, cta2Text: e.target.value })
                }
              />
            </Field>
            <Field label="Second button link">
              <input
                className={inputClass}
                value={block.cta2Url ?? ""}
                onChange={(e) => onChange({ ...block, cta2Url: e.target.value })}
              />
            </Field>
          </div>
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

    case "image_album": {
      const updateAlbum = (ai: number, patch: Partial<Album>) => {
        const albums = block.albums.map((a, idx) =>
          idx === ai ? { ...a, ...patch } : a,
        );
        onChange({ ...block, albums });
      };
      const moveAlbum = (ai: number, dir: -1 | 1) => {
        const j = ai + dir;
        if (j < 0 || j >= block.albums.length) return;
        const albums = [...block.albums];
        [albums[ai], albums[j]] = [albums[j], albums[ai]];
        onChange({ ...block, albums });
      };
      const removeAlbum = (ai: number) =>
        onChange({
          ...block,
          albums: block.albums.filter((_, idx) => idx !== ai),
        });

      const updateImage = (
        ai: number,
        ii: number,
        img: ImageRef | undefined,
      ) => {
        const images = [...block.albums[ai].images];
        if (img) images[ii] = img;
        else images.splice(ii, 1);
        updateAlbum(ai, { images });
      };
      const moveImage = (ai: number, ii: number, dir: -1 | 1) => {
        const images = [...block.albums[ai].images];
        const j = ii + dir;
        if (j < 0 || j >= images.length) return;
        [images[ii], images[j]] = [images[j], images[ii]];
        updateAlbum(ai, { images });
      };

      return (
        <div className="space-y-4">
          <Field label="Section heading (optional)">
            <input
              className={inputClass}
              value={block.heading ?? ""}
              onChange={(e) => onChange({ ...block, heading: e.target.value })}
            />
          </Field>

          {block.albums.map((album, ai) => (
            <div
              key={album.id}
              className="space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Album {ai + 1}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveAlbum(ai, -1)}
                    className="rounded border border-neutral-300 px-1.5 text-xs"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveAlbum(ai, 1)}
                    className="rounded border border-neutral-300 px-1.5 text-xs"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAlbum(ai)}
                    className="rounded border border-neutral-300 px-2 text-xs text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <Field label="Album title">
                <input
                  className={inputClass}
                  value={album.title}
                  onChange={(e) => updateAlbum(ai, { title: e.target.value })}
                />
              </Field>

              <Field label="Cover image (optional, defaults to first image)">
                <ImageInput
                  value={album.cover}
                  onChange={(cover) => updateAlbum(ai, { cover })}
                />
              </Field>

              <div className="space-y-2">
                <span className="text-xs font-medium text-neutral-600">
                  Images (the caption is shown as each image&apos;s title)
                </span>
                {album.images.map((img, ii) => (
                  <div
                    key={ii}
                    className="rounded-md border border-neutral-200 bg-white p-2"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs text-neutral-500">
                        Image {ii + 1}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(ai, ii, -1)}
                          className="rounded border border-neutral-300 px-1.5 text-xs"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(ai, ii, 1)}
                          className="rounded border border-neutral-300 px-1.5 text-xs"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                    <ImageInput
                      value={img}
                      showCaption
                      onChange={(next) => updateImage(ai, ii, next)}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    updateAlbum(ai, { images: [...album.images, { url: "" }] })
                  }
                  className="rounded-md border border-dashed border-neutral-400 px-3 py-1.5 text-sm hover:bg-neutral-100"
                >
                  + Add image
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              onChange({
                ...block,
                albums: [
                  ...block.albums,
                  { id: newId(), title: "New album", images: [] },
                ],
              })
            }
            className="rounded-md border border-dashed border-neutral-400 px-3 py-1.5 text-sm hover:bg-neutral-100"
          >
            + Add album
          </button>
        </div>
      );
    }

    case "bullet_list": {
      const updateColumn = (ci: number, patch: Partial<BulletColumn>) => {
        const columns = block.columns.map((c, idx) =>
          idx === ci ? { ...c, ...patch } : c,
        );
        onChange({ ...block, columns });
      };
      const moveColumn = (ci: number, dir: -1 | 1) => {
        const j = ci + dir;
        if (j < 0 || j >= block.columns.length) return;
        const columns = [...block.columns];
        [columns[ci], columns[j]] = [columns[j], columns[ci]];
        onChange({ ...block, columns });
      };
      const removeColumn = (ci: number) =>
        onChange({
          ...block,
          columns: block.columns.filter((_, idx) => idx !== ci),
        });
      const updateItem = (ci: number, ii: number, value: string) => {
        const items = [...block.columns[ci].items];
        items[ii] = value;
        updateColumn(ci, { items });
      };
      const removeItem = (ci: number, ii: number) =>
        updateColumn(ci, {
          items: block.columns[ci].items.filter((_, idx) => idx !== ii),
        });

      return (
        <div className="space-y-4">
          <Field label="Section heading (optional)">
            <input
              className={inputClass}
              value={block.heading ?? ""}
              onChange={(e) => onChange({ ...block, heading: e.target.value })}
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {block.columns.map((col, ci) => (
              <div
                key={col.id}
                className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">Column {ci + 1}</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveColumn(ci, -1)}
                      className="rounded border border-neutral-300 px-1.5 text-xs"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => moveColumn(ci, 1)}
                      className="rounded border border-neutral-300 px-1.5 text-xs"
                    >
                      →
                    </button>
                    {block.columns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColumn(ci)}
                        className="rounded border border-neutral-300 px-1.5 text-xs text-red-600 hover:bg-red-50"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <input
                  className={inputClass}
                  placeholder="Column title (e.g. Creative)"
                  value={col.heading ?? ""}
                  onChange={(e) => updateColumn(ci, { heading: e.target.value })}
                />
                <div className="space-y-1.5">
                  {col.items.map((item, ii) => (
                    <div key={ii} className="flex items-center gap-1">
                      <input
                        className={inputClass}
                        placeholder="List item"
                        value={item}
                        onChange={(e) => updateItem(ci, ii, e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(ci, ii)}
                        className="shrink-0 rounded border border-neutral-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      updateColumn(ci, { items: [...col.items, ""] })
                    }
                    className="rounded-md border border-dashed border-neutral-400 px-2 py-1 text-xs hover:bg-neutral-100"
                  >
                    + Add item
                  </button>
                </div>
              </div>
            ))}
          </div>

          {block.columns.length < 3 && (
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...block,
                  columns: [
                    ...block.columns,
                    { id: newId(), heading: "", items: [""] },
                  ],
                })
              }
              className="rounded-md border border-dashed border-neutral-400 px-3 py-1.5 text-sm hover:bg-neutral-100"
            >
              + Add column (max 3)
            </button>
          )}
        </div>
      );
    }

    case "contact": {
      const updateItem = (i: number, patch: Partial<ContactItem>) => {
        const items = block.items.map((it, idx) =>
          idx === i ? { ...it, ...patch } : it,
        );
        onChange({ ...block, items });
      };
      const moveItem = (i: number, dir: -1 | 1) => {
        const j = i + dir;
        if (j < 0 || j >= block.items.length) return;
        const items = [...block.items];
        [items[i], items[j]] = [items[j], items[i]];
        onChange({ ...block, items });
      };
      const removeItem = (i: number) =>
        onChange({ ...block, items: block.items.filter((_, idx) => idx !== i) });

      return (
        <div className="space-y-3">
          <Field label="Heading (optional)">
            <input
              className={inputClass}
              value={block.heading ?? ""}
              onChange={(e) => onChange({ ...block, heading: e.target.value })}
            />
          </Field>
          <Field label="Intro text (optional)">
            <textarea
              className={`${inputClass} min-h-16`}
              value={block.intro ?? ""}
              onChange={(e) => onChange({ ...block, intro: e.target.value })}
            />
          </Field>

          <div className="space-y-2">
            <span className="text-xs font-medium text-neutral-600">
              Contact rows
            </span>
            {block.items.map((item, i) => (
              <div
                key={item.id}
                className="space-y-2 rounded-md border border-neutral-200 bg-neutral-50 p-2"
              >
                <div className="flex items-center gap-2">
                  <select
                    className={`${inputClass} max-w-36`}
                    value={item.icon}
                    onChange={(e) =>
                      updateItem(i, { icon: e.target.value as ContactIcon })
                    }
                  >
                    <option value="email">Email icon</option>
                    <option value="phone">Phone icon</option>
                    <option value="location">Location icon</option>
                    <option value="website">Website icon</option>
                  </select>
                  <input
                    className={`${inputClass} max-w-32`}
                    placeholder="Label"
                    value={item.label ?? ""}
                    onChange={(e) => updateItem(i, { label: e.target.value })}
                  />
                  <div className="ml-auto flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(i, -1)}
                      className="rounded border border-neutral-300 px-1.5 text-xs"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(i, 1)}
                      className="rounded border border-neutral-300 px-1.5 text-xs"
                    >
                      ↓
                    </button>
                    {block.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(i)}
                        className="rounded border border-neutral-300 px-1.5 text-xs text-red-600 hover:bg-red-50"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <input
                  className={inputClass}
                  placeholder="Value (e.g. name@email.com, 0945 386 9496, City)"
                  value={item.value}
                  onChange={(e) => updateItem(i, { value: e.target.value })}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...block,
                  items: [
                    ...block.items,
                    { id: newId(), icon: "email", label: "", value: "" },
                  ],
                })
              }
              className="rounded-md border border-dashed border-neutral-400 px-3 py-1.5 text-sm hover:bg-neutral-100"
            >
              + Add row
            </button>
          </div>
        </div>
      );
    }

    case "timeline": {
      const updateEntry = (i: number, patch: Partial<TimelineEntry>) => {
        const entries = block.entries.map((en, idx) =>
          idx === i ? { ...en, ...patch } : en,
        );
        onChange({ ...block, entries });
      };
      const moveEntry = (i: number, dir: -1 | 1) => {
        const j = i + dir;
        if (j < 0 || j >= block.entries.length) return;
        const entries = [...block.entries];
        [entries[i], entries[j]] = [entries[j], entries[i]];
        onChange({ ...block, entries });
      };
      const removeEntry = (i: number) =>
        onChange({
          ...block,
          entries: block.entries.filter((_, idx) => idx !== i),
        });

      return (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Label (e.g. Experience)">
              <input
                className={inputClass}
                value={block.heading ?? ""}
                onChange={(e) => onChange({ ...block, heading: e.target.value })}
              />
            </Field>
            <Field label="Subtitle (optional)">
              <input
                className={inputClass}
                value={block.subtitle ?? ""}
                onChange={(e) =>
                  onChange({ ...block, subtitle: e.target.value })
                }
              />
            </Field>
          </div>

          <p className="text-xs text-neutral-500">
            The top entry shows first, so put the most recent at the top.
          </p>

          {block.entries.map((en, i) => (
            <div
              key={en.id}
              className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Entry {i + 1}</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => moveEntry(i, -1)}
                    className="rounded border border-neutral-300 px-1.5 text-xs"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveEntry(i, 1)}
                    className="rounded border border-neutral-300 px-1.5 text-xs"
                  >
                    ↓
                  </button>
                  {block.entries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEntry(i)}
                      className="rounded border border-neutral-300 px-1.5 text-xs text-red-600 hover:bg-red-50"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="What he did (e.g. Data Encoder, Woflow Inc.)"
                  value={en.heading}
                  onChange={(e) => updateEntry(i, { heading: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="When (e.g. 2022 - 2026)"
                  value={en.time}
                  onChange={(e) => updateEntry(i, { time: e.target.value })}
                />
              </div>
              <textarea
                className={`${inputClass} min-h-20`}
                placeholder="Description (optional)"
                value={en.description ?? ""}
                onChange={(e) =>
                  updateEntry(i, { description: e.target.value })
                }
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              onChange({
                ...block,
                entries: [
                  ...block.entries,
                  { id: newId(), heading: "", time: "", description: "" },
                ],
              })
            }
            className="rounded-md border border-dashed border-neutral-400 px-3 py-1.5 text-sm hover:bg-neutral-100"
          >
            + Add entry
          </button>
        </div>
      );
    }

    case "profile": {
      const updateDetail = (i: number, patch: Partial<ProfileDetail>) => {
        const details = block.details.map((d, idx) =>
          idx === i ? { ...d, ...patch } : d,
        );
        onChange({ ...block, details });
      };
      const removeDetail = (i: number) =>
        onChange({
          ...block,
          details: block.details.filter((_, idx) => idx !== i),
        });
      return (
        <div className="space-y-3">
          <Field label="Photo">
            <ImageInput
              value={block.image}
              onChange={(image) => onChange({ ...block, image })}
            />
          </Field>
          <Field label="Eyebrow (small label)">
            <input
              className={inputClass}
              placeholder="e.g. My Biography"
              value={block.eyebrow ?? ""}
              onChange={(e) => onChange({ ...block, eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Heading">
            <input
              className={inputClass}
              value={block.heading}
              onChange={(e) => onChange({ ...block, heading: e.target.value })}
            />
          </Field>
          <Field label="Bio text">
            <textarea
              className={`${inputClass} min-h-28`}
              value={block.body ?? ""}
              onChange={(e) => onChange({ ...block, body: e.target.value })}
            />
          </Field>

          <div className="space-y-2">
            <span className="text-xs font-medium text-neutral-600">
              Details (Name, Email, Phone, Location…)
            </span>
            {block.details.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className={`${inputClass} max-w-32`}
                  placeholder="Label"
                  value={d.label}
                  onChange={(e) => updateDetail(i, { label: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="Value"
                  value={d.value}
                  onChange={(e) => updateDetail(i, { value: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => removeDetail(i)}
                  className="shrink-0 rounded border border-neutral-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...block,
                  details: [...block.details, { label: "", value: "" }],
                })
              }
              className="rounded-md border border-dashed border-neutral-400 px-3 py-1.5 text-sm hover:bg-neutral-100"
            >
              + Add detail
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Button text (optional)">
              <input
                className={inputClass}
                placeholder="e.g. Download CV"
                value={block.ctaText ?? ""}
                onChange={(e) => onChange({ ...block, ctaText: e.target.value })}
              />
            </Field>
            <Field label="Button link">
              <input
                className={inputClass}
                value={block.ctaUrl ?? ""}
                onChange={(e) => onChange({ ...block, ctaUrl: e.target.value })}
              />
            </Field>
          </div>
          <p className="text-xs text-neutral-500">
            Social icons (Instagram, Facebook, Email) come from{" "}
            <span className="font-medium">Site settings</span>.
          </p>
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
