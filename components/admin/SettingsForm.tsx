"use client";

import { useRef, useState, useTransition } from "react";
import { saveSettings } from "@/lib/actions/settings";
import { createClient } from "@/lib/supabase/client";
import { newId } from "@/lib/blocks";
import type { SiteSettings } from "@/lib/types";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [siteTitle, setSiteTitle] = useState(settings.site_title);
  const [tagline, setTagline] = useState(settings.tagline);
  const [facebook, setFacebook] = useState(settings.socials?.facebook ?? "");
  const [instagram, setInstagram] = useState(settings.socials?.instagram ?? "");
  const [email, setEmail] = useState(settings.socials?.email ?? "");
  const [resume, setResume] = useState(settings.socials?.resume ?? "");

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const supabase = createClient();
      const path = `resume-${Date.now()}-${newId()}.pdf`;
      const { error } = await supabase.storage
        .from("media")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: "application/pdf",
        });
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(path);
      setResume(publicUrl);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await saveSettings({
        id: settings.id,
        site_title: siteTitle,
        tagline,
        socials: { facebook, instagram, email, resume },
      });
      setMessage(
        result.ok
          ? { type: "ok", text: "Saved." }
          : { type: "error", text: result.error ?? "Could not save." },
      );
    });
  }

  return (
    <div className="max-w-xl space-y-5 rounded-xl border border-neutral-200 bg-white p-6">
      <label className="block space-y-1">
        <span className="text-xs font-medium text-neutral-600">Site title</span>
        <input
          className={inputClass}
          value={siteTitle}
          onChange={(e) => setSiteTitle(e.target.value)}
        />
      </label>
      <label className="block space-y-1">
        <span className="text-xs font-medium text-neutral-600">
          Tagline / role
        </span>
        <input
          className={inputClass}
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />
      </label>

      <div className="border-t border-neutral-100 pt-4">
        <p className="mb-3 text-sm font-medium">Links</p>
        <div className="space-y-3">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-neutral-600">
              Instagram URL
            </span>
            <input
              className={inputClass}
              placeholder="https://instagram.com/…"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-neutral-600">
              Facebook URL
            </span>
            <input
              className={inputClass}
              placeholder="https://facebook.com/…"
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-medium text-neutral-600">
              Contact email
            </span>
            <input
              className={inputClass}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="border-t border-neutral-100 pt-4">
        <p className="mb-3 text-sm font-medium">Résumé (PDF)</p>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          onChange={handleResumeUpload}
          className="hidden"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-100 disabled:opacity-60"
          >
            {uploading ? "Uploading…" : resume ? "Replace PDF" : "Upload PDF"}
          </button>
          {resume && (
            <a
              href={resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              View current résumé
            </a>
          )}
          {resume && (
            <button
              type="button"
              onClick={() => setResume("")}
              className="text-xs text-red-600 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
        {uploadError && (
          <p className="mt-1 text-xs text-red-600">{uploadError}</p>
        )}
        <p className="mt-2 text-xs text-neutral-500">
          After uploading, click “Save settings”. A “Résumé” button then appears
          in the site header.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-60"
        >
          {isPending ? "Saving…" : "Save settings"}
        </button>
        {message && (
          <span
            className={`text-sm ${
              message.type === "ok" ? "text-green-700" : "text-red-600"
            }`}
          >
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}
