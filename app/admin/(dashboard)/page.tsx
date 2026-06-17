import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createPage, deletePage } from "@/lib/actions/pages";
import type { Page } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("pages")
    .select("id, slug, title, nav_order, published, show_in_nav, content, updated_at")
    .order("nav_order", { ascending: true });

  const list = (pages ?? []) as Page[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pages</h1>
          <p className="text-sm text-neutral-500">
            Edit, publish, or add pages to your portfolio.
          </p>
        </div>
        <form action={createPage}>
          <button
            type="submit"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700"
          >
            + New page
          </button>
        </form>
      </div>

      <ul className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        {list.length === 0 && (
          <li className="p-6 text-sm text-neutral-500">
            No pages yet. Create your first page.
          </li>
        )}
        {list.map((page) => (
          <li
            key={page.id}
            className="flex items-center justify-between gap-4 p-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium">{page.title}</span>
                {page.published ? (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    Published
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                    Draft
                  </span>
                )}
              </div>
              <p className="truncate text-xs text-neutral-500">
                /{page.slug === "home" ? "" : page.slug} ·{" "}
                {page.content?.length ?? 0} block
                {(page.content?.length ?? 0) === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/admin/pages/${page.id}/edit`}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100"
              >
                Edit
              </Link>
              <form action={deletePage}>
                <input type="hidden" name="id" value={page.id} />
                <button
                  type="submit"
                  className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
