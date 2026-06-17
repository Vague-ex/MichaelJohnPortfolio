import Image from "next/image";
import type {
  Block,
  ColumnsBlock,
  GalleryBlock,
  HeroBlock,
  ImageBlock,
  ImageRef,
  RichTextBlock,
  TextAlign,
  VideoEmbedBlock,
} from "@/lib/types";
import { getEmbedUrl } from "@/lib/blocks";

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

/** A single image that respects its natural aspect ratio when known. */
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
  // Unknown dimensions: fill a 4:3 box.
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

function Hero({ block }: { block: HeroBlock }) {
  const align = block.align ?? "center";
  const hasImage = !!block.image?.url;
  return (
    <section
      className={`relative isolate overflow-hidden ${
        hasImage
          ? ""
          : "bg-gradient-to-br from-accent/15 via-background to-accent/5"
      }`}
    >
      {hasImage && (
        <>
          <Image
            src={block.image!.url}
            alt={block.image!.alt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
        </>
      )}
      <div
        className={`relative mx-auto flex max-w-5xl flex-col gap-4 px-6 ${
          hasImage ? "min-h-[60vh] justify-end pb-16 text-white" : "py-24"
        } ${alignClass[align]} ${align === "center" ? "items-center" : ""}`}
      >
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {block.heading}
        </h1>
        <span className="h-1 w-16 rounded-full bg-accent" />
        {block.subheading && (
          <p
            className={`max-w-2xl text-lg ${
              hasImage ? "opacity-90" : "text-muted"
            }`}
          >
            {block.subheading}
          </p>
        )}
      </div>
    </section>
  );
}

function RichText({ block }: { block: RichTextBlock }) {
  const align = block.align ?? "left";
  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <div className={`space-y-4 ${alignClass[align]}`}>
        {block.heading && (
          <h2 className="inline-block border-b-2 border-accent pb-1 text-2xl font-semibold">
            {block.heading}
          </h2>
        )}
        {block.text && <Paragraphs text={block.text} />}
      </div>
    </section>
  );
}

function SingleImage({ block }: { block: ImageBlock }) {
  if (!block.image.url) return null;
  return (
    <figure className="mx-auto max-w-4xl px-6 py-6">
      <SmartImage
        image={block.image}
        sizes="(max-width: 896px) 100vw, 896px"
        className="h-auto w-full rounded-lg"
      />
      {block.image.caption && (
        <figcaption className="mt-2 text-center text-sm text-muted">
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
    <section className="mx-auto max-w-6xl px-6 py-10">
      {block.heading && (
        <h2 className="mb-6 inline-block border-b-2 border-accent pb-1 text-2xl font-semibold">
          {block.heading}
        </h2>
      )}
      <div className={`grid grid-cols-1 gap-4 ${cols}`}>
        {images.map((img, i) => (
          <figure key={i} className="group">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-card shadow-sm transition duration-300 group-hover:shadow-md">
              <Image
                src={img.url}
                alt={img.alt ?? ""}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
            {img.caption && (
              <figcaption className="mt-2 text-sm text-muted">
                {img.caption}
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
    <section className="mx-auto max-w-6xl px-6 py-10">
      <div className={`grid grid-cols-1 gap-8 ${cols}`}>
        {block.columns.map((col, i) => (
          <div key={i} className="space-y-3">
            {col.image?.url && (
              <SmartImage
                image={col.image}
                sizes="(max-width: 640px) 100vw, 33vw"
                className="h-auto w-full rounded-lg"
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

function VideoEmbed({ block }: { block: VideoEmbedBlock }) {
  const embed = getEmbedUrl(block.url);
  if (!embed) return null;
  return (
    <section className="mx-auto max-w-4xl px-6 py-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={embed}
          title={block.caption || "Embedded video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      {block.caption && (
        <p className="mt-2 text-center text-sm text-muted">{block.caption}</p>
      )}
    </section>
  );
}

function renderBlock(block: Block) {
  switch (block.type) {
    case "hero":
      return <Hero key={block.id} block={block} />;
    case "rich_text":
      return <RichText key={block.id} block={block} />;
    case "image":
      return <SingleImage key={block.id} block={block} />;
    case "gallery":
      return <Gallery key={block.id} block={block} />;
    case "columns":
      return <Columns key={block.id} block={block} />;
    case "video_embed":
      return <VideoEmbed key={block.id} block={block} />;
    case "divider":
      return (
        <div key={block.id} className="mx-auto max-w-5xl px-6">
          <hr className="border-line" />
        </div>
      );
  }
}

export default function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map(renderBlock)}</>;
}
