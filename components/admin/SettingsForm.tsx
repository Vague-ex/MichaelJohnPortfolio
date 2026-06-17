"use client";

import { useState, useTransition } from "react";
import { saveSettings } from "@/lib/actions/settings";
import type { SiteSettings } from "@/lib/types";

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [siteTitle, setSiteTitle] = useState(settings.site_title);
  const [tagline, setTagline] = useState(settings.tagline);
  const [facebook, setFacebook] = useState(settings.socials?.facebook ?? "");
  const [instagram, setInstagram] = useState(settings.socials?.instagram ?? "");
  const [email, setEmail] = useState(settings.socials?.email ?? "");

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await saveSettings({
        id: settings.id,
        site_title: siteTitle,
        tagline,
        socials: { facebook, instagram, email },
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
