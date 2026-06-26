// ---------------------------------------------------------------------------
// Shared data model for the portfolio.
//
// Pages store their content as an ordered array of "blocks". Each block is a
// small object with a `type` discriminator. New block types can be added here
// without any database migration, because the whole array lives in a single
// JSON column.
// ---------------------------------------------------------------------------

export interface ImageRef {
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export type TextAlign = "left" | "center" | "right";

export interface HeroBlock {
  id: string;
  type: "hero";
  eyebrow?: string;
  heading: string;
  subheading?: string;
  image?: ImageRef;
  align?: TextAlign;
  ctaText?: string;
  ctaUrl?: string;
  cta2Text?: string;
  cta2Url?: string;
}

export interface RichTextBlock {
  id: string;
  type: "rich_text";
  heading?: string;
  text: string; // plain text; blank lines become paragraphs
  align?: TextAlign;
}

export interface ImageBlock {
  id: string;
  type: "image";
  image: ImageRef;
}

export interface GalleryBlock {
  id: string;
  type: "gallery";
  heading?: string;
  columns: number; // how many columns on desktop (the "add columns" lever)
  images: ImageRef[];
}

export interface ColumnItem {
  heading?: string;
  text?: string;
  image?: ImageRef;
}

export interface ColumnsBlock {
  id: string;
  type: "columns";
  columns: ColumnItem[];
}

export interface VideoEmbedBlock {
  id: string;
  type: "video_embed";
  url: string; // YouTube or Vimeo watch/share URL
  caption?: string;
}

export interface DividerBlock {
  id: string;
  type: "divider";
}

export interface Album {
  id: string;
  title: string;
  cover?: ImageRef;
  images: ImageRef[]; // each image's `caption` is its title in the viewer
}

export interface TimelineEntry {
  id: string;
  heading: string; // what he did
  time: string; // e.g. "2022 - 2026" or "Dec 2020"
  description?: string;
}

export interface TimelineBlock {
  id: string;
  type: "timeline";
  heading?: string; // left-column label, e.g. "Experience"
  subtitle?: string; // small uppercase subtitle under the label
  entries: TimelineEntry[]; // ordered newest first (top = latest)
}

export interface BulletColumn {
  id: string;
  heading?: string;
  items: string[];
}

export interface BulletListBlock {
  id: string;
  type: "bullet_list";
  heading?: string;
  columns: BulletColumn[]; // up to 3
}

export interface ImageAlbumBlock {
  id: string;
  type: "image_album";
  heading?: string;
  albums: Album[];
}

export interface ProfileDetail {
  label: string;
  value: string;
}

export interface ProfileBlock {
  id: string;
  type: "profile";
  image?: ImageRef;
  eyebrow?: string;
  heading: string;
  body?: string;
  details: ProfileDetail[];
  ctaText?: string;
  ctaUrl?: string;
}

export type Block =
  | HeroBlock
  | RichTextBlock
  | ImageBlock
  | GalleryBlock
  | ColumnsBlock
  | VideoEmbedBlock
  | ProfileBlock
  | ImageAlbumBlock
  | TimelineBlock
  | BulletListBlock
  | DividerBlock;

export type BlockType = Block["type"];

// ---------------------------------------------------------------------------
// Database rows
// ---------------------------------------------------------------------------

export interface Page {
  id: string;
  slug: string;
  title: string;
  nav_order: number;
  published: boolean;
  show_in_nav: boolean;
  content: Block[];
  updated_at: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  email?: string;
  [key: string]: string | undefined;
}

export interface SiteSettings {
  id: string;
  site_title: string;
  tagline: string;
  socials: SocialLinks;
  updated_at: string;
}
