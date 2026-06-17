"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { SocialLinks } from "@/lib/types";

export interface SaveSettingsInput {
  id: string;
  site_title: string;
  tagline: string;
  socials: SocialLinks;
}

export async function saveSettings(
  input: SaveSettingsInput,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const payload = {
    site_title: input.site_title,
    tagline: input.tagline,
    socials: input.socials,
  };

  // Update the existing singleton row, or insert one if it's missing.
  const query = input.id
    ? supabase.from("site_settings").update(payload).eq("id", input.id)
    : supabase.from("site_settings").insert(payload);

  const { error } = await query;
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  return { ok: true };
}
