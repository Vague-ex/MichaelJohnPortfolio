"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminHeader({ email }: { email?: string }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/admin" className="font-semibold">
            Dashboard
          </Link>
          <Link href="/admin/settings" className="text-neutral-500 hover:text-neutral-900">
            Site settings
          </Link>
          <Link
            href="/"
            target="_blank"
            className="text-neutral-500 hover:text-neutral-900"
          >
            View site ↗
          </Link>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {email && <span className="hidden text-neutral-400 sm:inline">{email}</span>}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 font-medium hover:bg-neutral-100"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
