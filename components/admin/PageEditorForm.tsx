"use client";

import { useState, useTransition } from "react";
import BlockEditor from "@/components/admin/BlockEditor";
import { BLOCK_META, BLOCK_ORDER, createBlock } from "@/lib/blocks";
import { savePage } from "@/lib/actions/pages";
import type { Block, BlockType, Page } from "@/lib/types";

export default function PageEditorForm({ page }: { page: Page }) {
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [published, setPublished] = useState(page.published);
  const [showInNav, setShowInNav] = useState(page.show_in_nav);
  const [navOrder, setNavOrder] = useState(page.nav_order);
  const [blocks, setBlocks] = useState<Block[]>(page.content ?? []);
  const [addOpen, setAddOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);

  const isHome = page.slug === "home";

  function updateBlock(index: number, next: Block) {
    setBlocks((prev) => prev.map((b, i) => (i === index ? next : b)));
  }
  function addBlock(type: BlockType) {
    setBlocks((prev) => [...prev, createBlock(type)]);
    setAddOpen(false);
  }
  function removeBlock(index: number) {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  }
  function moveBlock(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= blocks.length) return;
    setBlocks((prev) => {
      const next = [...prev];
      [next[index], next[j]] = [next[j], next[index]];
      return next;
    });
  }
  function toggleCollapse(id: string) {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await savePage({
        id: page.id,
        title,
        slug,
        nav_order: navOrder,
        published,
        show_in_nav: showInNav,
        content: blocks,
      });
      if (result.ok) {
        if (result.slug) setSlug(result.slug);
        setMessage({ type: "ok", text: "Saved." });
      } else {
        setMessage({ type: "error", text: result.error ?? "Could not save." });
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Page settings */}
      <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Page settings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-neutral-600">
              Page name
            </span>
            <input
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-neutral-600">
              Address (slug)
            </span>
            <input
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm disabled:bg-neutral-100"
              value={slug}
              disabled={isHome}
              onChange={(e) => setSlug(e.target.value)}
            />
            <span className="text-xs text-neutral-400">
              {isHome ? "This is the home page." : `Shown at /${slug}`}
            </span>
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-neutral-600">
              Menu order
            </span>
            <input
              type="number"
              className="w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
              value={navOrder}
              onChange={(e) => setNavOrder(Number(e.target.value))}
            />
          </label>
          <div className="flex items-end gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showInNav}
                onChange={(e) => setShowInNav(e.target.checked)}
              />
              Show in menu
            </label>
          </div>
        </div>
      </div>

      {/* Blocks */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Content blocks</h2>

        {blocks.length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
            No blocks yet. Add one below to start building this page.
          </p>
        )}

        {blocks.map((block, i) => (
          <div
            key={block.id}
            className="rounded-xl border border-neutral-200 bg-white"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2">
              <button
                type="button"
                onClick={() => toggleCollapse(block.id)}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <span className="text-neutral-400">
                  {collapsed[block.id] ? "▸" : "▾"}
                </span>
                {BLOCK_META[block.type].label}
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => moveBlock(i, -1)}
                  className="rounded border border-neutral-300 px-2 py-0.5 text-xs hover:bg-neutral-100"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(i, 1)}
                  className="rounded border border-neutral-300 px-2 py-0.5 text-xs hover:bg-neutral-100"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeBlock(i)}
                  className="rounded border border-neutral-300 px-2 py-0.5 text-xs text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
            {!collapsed[block.id] && (
              <div className="p-4">
                <BlockEditor
                  block={block}
                  onChange={(next) => updateBlock(i, next)}
                />
              </div>
            )}
          </div>
        ))}

        {/* Add block */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAddOpen((v) => !v)}
            className="w-full rounded-xl border border-dashed border-neutral-400 px-4 py-3 text-sm font-medium hover:bg-neutral-100"
          >
            + Add a block
          </button>
          {addOpen && (
            <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
              {BLOCK_ORDER.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="flex w-full flex-col items-start gap-0.5 border-b border-neutral-100 px-4 py-3 text-left hover:bg-neutral-50"
                >
                  <span className="text-sm font-medium">
                    {BLOCK_META[type].label}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {BLOCK_META[type].description}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save bar */}
      <div className="sticky bottom-0 flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white/95 p-4 shadow-lg backdrop-blur">
        <div className="text-sm">
          {message && (
            <span
              className={
                message.type === "ok" ? "text-green-700" : "text-red-600"
              }
            >
              {message.text}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
