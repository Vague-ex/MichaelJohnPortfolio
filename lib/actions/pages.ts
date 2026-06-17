"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Block } from "@/lib/types";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

export interface SavePageInput {
  id: string;
  title: string;
  slug: string;
  nav_order: number;
  published: boolean;
  show_in_nav: boolean;
  content: Block[];
}

export async function savePage(
  input: SavePageInput,
): Promise<{ ok: boolean; error?: string; slug?: string }> {
  const supabase = await requireUser();

  const slug = slugify(input.slug || input.title || "page");
  if (!slug) return { ok: false, error: "A page needs a name or slug." };

  const { error } = await supabase
    .from("pages")
    .update({
      title: input.title,
      slug,
      nav_order: input.nav_order,
      published: input.published,
      show_in_nav: input.show_in_nav,
      content: input.content,
    })
    .eq("id", input.id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: `The address "/${slug}" is already used by another page.` };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  return { ok: true, slug };
}

export async function createPage() {
  const supabase = await requireUser();

  const suffix = Math.random().toString(36).slice(2, 6);
  const { data, error } = await supabase
    .from("pages")
    .insert({
      slug: `new-page-${suffix}`,
      title: "New page",
      published: false,
      content: [],
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not create page");
  }

  revalidatePath("/admin");
  redirect(`/admin/pages/${data.id}/edit`);
}

export async function deletePage(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));

  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
  revalidatePath("/admin");
}
