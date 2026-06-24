import type { Block, BlockType } from "@/lib/types";

/** Short unique id for blocks (used as React keys and for reordering). */
export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** Human-friendly labels + descriptions for the "add block" menu. */
export const BLOCK_META: Record<
  BlockType,
  { label: string; description: string }
> = {
  hero: { label: "Hero banner", description: "Big heading over an image" },
  rich_text: { label: "Text", description: "A heading and paragraphs" },
  image: { label: "Single image", description: "One image with a caption" },
  gallery: {
    label: "Image gallery",
    description: "A grid of images — choose how many columns",
  },
  columns: {
    label: "Columns",
    description: "Side-by-side columns of text and images",
  },
  profile: {
    label: "Biography / profile",
    description: "Photo, bio, personal details, and social links",
  },
  video_embed: {
    label: "Video",
    description: "Embed a YouTube or Vimeo link",
  },
  divider: { label: "Divider", description: "A horizontal line / spacer" },
};

export const BLOCK_ORDER: BlockType[] = [
  "hero",
  "profile",
  "rich_text",
  "image",
  "gallery",
  "columns",
  "video_embed",
  "divider",
];

/** Create a new block of the given type with sensible defaults. */
export function createBlock(type: BlockType): Block {
  const id = newId();
  switch (type) {
    case "hero":
      return { id, type, heading: "Your name", subheading: "", align: "center" };
    case "rich_text":
      return { id, type, heading: "", text: "", align: "left" };
    case "image":
      return { id, type, image: { url: "", alt: "" } };
    case "gallery":
      return { id, type, heading: "", columns: 3, images: [] };
    case "columns":
      return { id, type, columns: [{ text: "" }, { text: "" }] };
    case "profile":
      return {
        id,
        type,
        eyebrow: "My Biography",
        heading: "About me",
        body: "",
        details: [
          { label: "Name", value: "" },
          { label: "Email", value: "" },
        ],
        ctaText: "",
        ctaUrl: "",
      };
    case "video_embed":
      return { id, type, url: "", caption: "" };
    case "divider":
      return { id, type };
  }
}

/**
 * Convert a YouTube or Vimeo share/watch URL into an embeddable URL.
 * Returns null if the URL is not recognised.
 */
export function getEmbedUrl(raw: string): string | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  // YouTube
  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (url.pathname.startsWith("/embed/")) return raw;
    if (url.pathname.startsWith("/shorts/")) {
      const id = url.pathname.split("/")[2];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  }

  // Vimeo
  if (host === "vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  }
  if (host === "player.vimeo.com") return raw;

  return null;
}
