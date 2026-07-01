import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * The public site is a single scrolling page, so old per-page URLs (e.g.
 * /about, /contact) just redirect to the matching section anchor on "/".
 */
export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(slug === "home" ? "/" : `/#${slug}`);
}
