import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageEditorForm from "@/components/admin/PageEditorForm";
import type { Page } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select("id, slug, title, nav_order, published, show_in_nav, content, updated_at")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const page = data as Page;

  return (
    <div className="space-y-6">
      <Link href="/admin" className="text-sm text-neutral-500 hover:text-neutral-900">
        ← Back to pages
      </Link>
      <PageEditorForm page={page} />
    </div>
  );
}
