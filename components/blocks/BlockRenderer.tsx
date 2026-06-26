import Image from "next/image";
import { Phone, Mail, MapPin, Globe } from "lucide-react";
import type {
  Block,
  BulletListBlock,
  ColumnsBlock,
  ContactBlock,
  ContactIcon,
  GalleryBlock,
  HeroBlock,
  ImageBlock,
  ImageRef,
  ProfileBlock,
  RichTextBlock,
  SiteSettings,
  TextAlign,
  TimelineBlock,
  VideoEmbedBlock,
} from "@/lib/types";
import { getEmbedUrl } from "@/lib/blocks";
import Reveal from "@/components/public/Reveal";
import SocialIcon, { type SocialName } from "@/components/public/SocialIcon";
import ImageAlbum from "@/components/blocks/ImageAlbum";

const alignClass: Record<TextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const gridColsClass: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-3 lg:grid-cols-5",
  6: "sm:grid-cols-3 lg:grid-cols-6",
};

// ---------------------------------------------------------------------------
// Small shared pieces
// ---------------------------------------------------------------------------

function SmartImage({
  image,
  sizes,
  className,
}: {
  image: ImageRef;
  sizes: string;
  className?: string;
}) {
  if (!image.url) return null;
  if (image.width && image.height) {
    return (
      <Image
        src={image.url}
        alt={image.alt ?? ""}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className={className ?? "h-auto w-full"}
      />
    );
  }
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden">
      <Image
        src={image.url}
        alt={image.alt ?? ""}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

function Paragraphs({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/).filter((p) => p.trim().length > 0);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i} className="whitespace-pre-line leading-relaxed">
          {p}
        </p>
      ))}
    </>
  );
}

function SectionHeading({
  title,
  align = "left",
}: {
  title: string;
  align?: TextAlign;
}) {
  return (
    <div className={`mb-8 ${alignClass[align]}`}>
      <h2 className="text-2xl font-semibold sm:text-3xl">{title}</h2>
      <span
        className={`mt-3 block h-1 w-12 rounded-full bg-accent ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
      {children}
    </p>
  );
}

function CtaButtons({
  primary,
  primaryUrl,
  secondary,
  secondaryUrl,
  align = "left",
}: {
  primary?: string;
  primaryUrl?: string;
  secondary?: string;
  secondaryUrl?: string;
  align?: TextAlign;
}) {
  const hasPrimary = primary && primaryUrl;
  const hasSecondary = secondary && secondaryUrl;
  if (!hasPrimary && !hasSecondary) return null;
  return (
    <div
      className={`flex flex-wrap gap-3 pt-2 ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      {hasPrimary && (
        <a
          href={primaryUrl}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-accent-dark"
        >
          {primary}
        </a>
      )}
      {hasSecondary && (
        <a
          href={secondaryUrl}
          className="rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium transition hover:border-foreground"
        >
          {secondary}
        </a>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Blocks
// ---------------------------------------------------------------------------

function Hero({ block }: { block: HeroBlock }) {
  const align = block.align ?? "center";
  const hasImage = !!block.image?.url;

  if (hasImage) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-accent-soft via-background to-background">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 sm:py-20 md:grid-cols-2">
          <div className="space-y-5">
            {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {block.heading}
            </h1>
            <span className="block h-1 w-16 rounded-full bg-accent" />
            {block.subheading && (
              <p className="max-w-md text-lg text-muted">{block.subheading}</p>
            )}
            <CtaButtons
              primary={block.ctaText}
              primaryUrl={block.ctaUrl}
              secondary={block.cta2Text}
              secondaryUrl={block.cta2Url}
            />
          </div>
          <div className="relative mx-auto w-full max-w-sm">
            {/* Coral accent block + a soft dark base so a dark/black-background
                portrait reads as an intentional framed photo on the light page. */}
            <div className="absolute -right-4 -top-4 h-full w-full rounded-[2rem] bg-accent/20" />
            <div className="absolute -bottom-3 -left-3 h-2/3 w-2/3 rounded-[2rem] bg-foreground/5" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-neutral-900 shadow-2xl ring-1 ring-black/10">
              <Image
                src={block.image!.url}
                alt={block.image!.alt ?? block.heading}
                fill
                priority
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-accent-soft via-background to-background">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
      <div
        className={`relative mx-auto flex max-w-3xl flex-col gap-5 px-6 py-28 ${
          alignClass[align]
        } ${align === "center" ? "items-center" : ""}`}
      >
        {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
        <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">
          {block.heading}
        </h1>
        <span className="block h-1 w-16 rounded-full bg-accent" />
        {block.subheading && (
          <p className="max-w-2xl text-lg text-muted">{block.subheading}</p>
        )}
        <CtaButtons
          primary={block.ctaText}
          primaryUrl={block.ctaUrl}
          secondary={block.cta2Text}
          secondaryUrl={block.cta2Url}
          align={align}
        />
      </div>
    </section>
  );
}

function RichText({ block }: { block: RichTextBlock }) {
  const align = block.align ?? "left";
  return (
    <section className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <div className={`space-y-4 ${alignClass[align]}`}>
        {block.heading && <SectionHeading title={block.heading} align={align} />}
        {block.text && <Paragraphs text={block.text} />}
      </div>
    </section>
  );
}

function SingleImage({ block }: { block: ImageBlock }) {
  if (!block.image.url) return null;
  return (
    <figure className="mx-auto max-w-4xl px-6 py-8">
      <SmartImage
        image={block.image}
        sizes="(max-width: 896px) 100vw, 896px"
        className="h-auto w-full rounded-xl"
      />
      {block.image.caption && (
        <figcaption className="mt-3 text-center text-sm text-muted">
          {block.image.caption}
        </figcaption>
      )}
    </figure>
  );
}

function Gallery({ block }: { block: GalleryBlock }) {
  const cols = gridColsClass[block.columns] ?? gridColsClass[3];
  const images = block.images.filter((img) => img.url);
  if (images.length === 0 && !block.heading) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      {block.heading && <SectionHeading title={block.heading} />}
      <div className={`grid grid-cols-1 gap-5 ${cols}`}>
        {images.map((img, i) => (
          <figure
            key={i}
            className="group relative overflow-hidden rounded-xl bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
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
            {img.caption && (
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/65 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">
                <span className="text-sm font-medium text-white">
                  {img.caption}
                </span>
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

function Columns({ block }: { block: ColumnsBlock }) {
  const count = Math.min(Math.max(block.columns.length, 1), 6);
  const cols = gridColsClass[count] ?? gridColsClass[3];
  return (
    <section className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      <div className={`grid grid-cols-1 gap-8 ${cols}`}>
        {block.columns.map((col, i) => (
          <div key={i} className="space-y-3">
            {col.image?.url && (
              <SmartImage
                image={col.image}
                sizes="(max-width: 640px) 100vw, 33vw"
                className="h-auto w-full rounded-xl"
              />
            )}
            {col.heading && (
              <h3 className="text-lg font-semibold">{col.heading}</h3>
            )}
            {col.text && <Paragraphs text={col.text} />}
          </div>
        ))}
      </div>
    </section>
  );
}

function Profile({
  block,
  settings,
}: {
  block: ProfileBlock;
  settings?: SiteSettings;
}) {
  const socials = settings?.socials ?? {};
  const socialLinks = (
    [
      { url: socials.instagram, name: "instagram", label: "Instagram" },
      { url: socials.facebook, name: "facebook", label: "Facebook" },
      {
        url: socials.email ? `mailto:${socials.email}` : undefined,
        name: "email",
        label: "Email",
      },
    ] satisfies { url?: string; name: SocialName; label: string }[]
  ).filter((s) => s.url);

  const details = block.details?.filter((d) => d.value.trim().length > 0) ?? [];

  return (
    <section className="bg-surface">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-16 sm:py-20 md:grid-cols-[0.8fr_1fr]">
        {block.image?.url && (
          <div className="relative mx-auto w-full max-w-xs">
            <div className="absolute -bottom-4 -left-4 h-full w-full rounded-2xl border-2 border-accent/40" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-900 shadow-xl ring-1 ring-black/10">
              <Image
                src={block.image.url}
                alt={block.image.alt ?? block.heading}
                fill
                sizes="(max-width: 768px) 80vw, 320px"
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="space-y-5">
          {block.eyebrow && <Eyebrow>{block.eyebrow}</Eyebrow>}
          <h2 className="text-2xl font-semibold sm:text-3xl">{block.heading}</h2>
          {block.body && (
            <div className="space-y-3 text-muted">
              <Paragraphs text={block.body} />
            </div>
          )}

          {details.length > 0 && (
            <dl className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
              {details.map((d, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <dt className="font-medium">{d.label}:</dt>
                  <dd className="text-muted">
                    {d.value.includes("@") && !d.value.includes(" ") ? (
                      <a
                        href={`mailto:${d.value}`}
                        className="transition hover:text-accent"
                      >
                        {d.value}
                      </a>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {socialLinks.length > 0 && (
            <div className="flex items-center gap-3 pt-1">
              <span className="text-sm font-medium">Follow me</span>
              {socialLinks.map(({ url, name, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-accent hover:text-accent"
                >
                  <SocialIcon name={name} size={16} />
                </a>
              ))}
            </div>
          )}

          {block.ctaText && block.ctaUrl && (
            <CtaButtons primary={block.ctaText} primaryUrl={block.ctaUrl} />
          )}
        </div>
      </div>
    </section>
  );
}

function Timeline({ block }: { block: TimelineBlock }) {
  const entries = block.entries.filter(
    (e) => e.heading.trim() || e.time.trim() || (e.description ?? "").trim(),
  );
  return (
    <section className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      {(block.heading || block.subtitle) && (
        <div className="mb-8">
          {block.heading && (
            <h2 className="text-2xl font-semibold sm:text-3xl">
              {block.heading}
            </h2>
          )}
          {block.subtitle && (
            <p className="mt-1 text-sm font-bold uppercase tracking-wider text-muted">
              {block.subtitle}
            </p>
          )}
          <span className="mt-3 block h-1 w-12 rounded-full bg-accent" />
        </div>
      )}

      <div className="relative pl-8">
        <span className="pointer-events-none absolute bottom-1 left-[7px] top-2 w-0.5 bg-accent/40" />
        <div className="space-y-8">
          {entries.map((e) => (
            <div key={e.id} className="relative">
              <span className="absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-[3px] bg-accent ring-4 ring-background" />
              <h4 className="text-lg font-semibold tracking-wide">
                {e.heading}
              </h4>
              {e.time && (
                <time className="block text-xs font-medium uppercase tracking-wide text-muted">
                  {e.time}
                </time>
              )}
              {e.description && (
                <p className="mt-2 leading-relaxed text-muted">
                  {e.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const contactIconMap = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  website: Globe,
} as const;

function contactHref(icon: ContactIcon, value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  if (icon === "email") return `mailto:${v}`;
  if (icon === "phone") return `tel:${v.replace(/[^\d+]/g, "")}`;
  if (icon === "website") return v.startsWith("http") ? v : `https://${v}`;
  return undefined; // location stays plain text
}

function Contact({ block }: { block: ContactBlock }) {
  const items = block.items?.filter((i) => i.value.trim().length > 0) ?? [];
  return (
    <section className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      {block.heading && <SectionHeading title={block.heading} />}
      {block.intro && (
        <p className="mb-8 max-w-2xl leading-relaxed text-muted">
          {block.intro}
        </p>
      )}
      <ul className="space-y-5">
        {items.map((item) => {
          const Icon = contactIconMap[item.icon];
          const href = contactHref(item.icon, item.value);
          return (
            <li key={item.id} className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Icon size={20} />
              </span>
              <div>
                {item.label && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {item.label}
                  </p>
                )}
                {href ? (
                  <a
                    href={href}
                    className="text-base font-medium transition hover:text-accent"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-base font-medium">{item.value}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function CheckMark() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function BulletList({ block }: { block: BulletListBlock }) {
  const count = Math.min(Math.max(block.columns.length, 1), 3);
  const cols =
    count === 1
      ? ""
      : count === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <section className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
      {block.heading && <SectionHeading title={block.heading} />}
      <div className={`grid grid-cols-1 gap-8 ${cols}`}>
        {block.columns.map((col) => (
          <div key={col.id}>
            <span className="mb-3 block h-2 w-10 rounded-md bg-accent" />
            {col.heading && (
              <h3 className="mb-3 text-lg font-semibold">{col.heading}</h3>
            )}
            <ul className="space-y-2.5">
              {col.items
                .filter((item) => item.trim().length > 0)
                .map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckMark />
                    <span className="text-muted">{item}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function VideoEmbed({ block }: { block: VideoEmbedBlock }) {
  const embed = getEmbedUrl(block.url);
  if (!embed) return null;
  return (
    <section className="mx-auto max-w-4xl px-6 py-10">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <iframe
          src={embed}
          title={block.caption || "Embedded video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      {block.caption && (
        <p className="mt-3 text-center text-sm text-muted">{block.caption}</p>
      )}
    </section>
  );
}

function renderBlock(block: Block, settings?: SiteSettings) {
  switch (block.type) {
    case "hero":
      return <Hero block={block} />;
    case "rich_text":
      return <RichText block={block} />;
    case "image":
      return <SingleImage block={block} />;
    case "gallery":
      return <Gallery block={block} />;
    case "columns":
      return <Columns block={block} />;
    case "image_album":
      return <ImageAlbum block={block} />;
    case "timeline":
      return <Timeline block={block} />;
    case "bullet_list":
      return <BulletList block={block} />;
    case "contact":
      return <Contact block={block} />;
    case "profile":
      return <Profile block={block} settings={settings} />;
    case "video_embed":
      return <VideoEmbed block={block} />;
    case "divider":
      return (
        <div className="mx-auto max-w-4xl px-6">
          <hr className="border-line" />
        </div>
      );
  }
}

export default function BlockRenderer({
  blocks,
  settings,
}: {
  blocks: Block[];
  settings?: SiteSettings;
}) {
  return (
    <>
      {blocks.map((block, i) => (
        <Reveal key={block.id} delay={Math.min(i, 3) * 0.04}>
          {renderBlock(block, settings)}
        </Reveal>
      ))}
    </>
  );
}
