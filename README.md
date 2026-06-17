# Portfolio — Michael John Aguilar

A self-owned portfolio website with a **public, read-only site** and a private
**admin** where the owner logs in and edits everything through a block-based page
builder. Built to replace a hosted portfolio (Crevado) with something fully owned.

- **Public link** (shared with everyone): `/`
- **Admin login** (only the owner): `/admin/login`

## Tech stack

- **Next.js 16** (App Router, TypeScript) + **Tailwind CSS v4**
- **Supabase** — Postgres (content), Auth (admin login), Storage (image uploads)
- **Hosting:** Vercel
- Videos are **YouTube/Vimeo embeds** (no direct video upload)

## How editing works

The owner signs in at `/admin`, where each page is a list of **blocks** that can be
added, reordered, edited, and deleted:

| Block | What it does |
|-------|--------------|
| Hero banner | Big heading over an optional background image |
| Text | A heading + paragraphs |
| Single image | One image with a caption |
| Image gallery | A grid of images — choose 1–6 columns |
| Columns | Side-by-side columns of text/images |
| Video | Embed a YouTube or Vimeo link |
| Divider | A horizontal line |

Each page has a **Published** toggle (drafts are hidden from the public) and a
**Show in menu** toggle. New block types can be added in code without any database
migration, because a page's content is stored as JSON.

---

## Setup (one time)

### 1. Create a Supabase project
1. Go to <https://supabase.com>, create a free project. Pick a region near you
   (e.g. Singapore for the Philippines).
2. Wait for it to finish provisioning.

### 2. Create the database
1. In the Supabase dashboard: **SQL Editor → New query**.
2. Paste the entire contents of [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) and click **Run**.
   This creates the tables, security rules, the image storage bucket, and seed pages.
   (It is safe to run again later.)

### 3. Lock down auth and create the admin account
1. **Authentication → Providers → Email**: keep it enabled.
2. **Authentication → Sign In / Providers** (or **Settings**): **turn OFF "Allow new
   users to sign up"**. This is important — it means the only account that can ever
   log in is the one you create by hand.
3. **Authentication → Users → Add user → Create new user**: enter the owner's email
   and a password, and tick **Auto Confirm User**. This is the admin login.

### 4. Connect the app to Supabase
1. In Supabase: **Project Settings → API**. Copy the **Project URL** and the
   **anon / public** key.
2. In the project root, copy `.env.local.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 5. Run it locally
```bash
npm install
npm run dev
```
- Public site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin> (sign in with the account from step 3)

---

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to <https://vercel.com>, **Add New → Project**, and import the repo.
3. In the project's **Environment Variables**, add the same two variables from
   `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Deploy. The public site is the link you share; `/admin` is the private login.
5. (Optional) Add a custom domain under the Vercel project's **Domains** tab.

No extra Supabase configuration is needed for production — the same project powers
both local and deployed environments.

---

## Migrating the existing work

The old Crevado site has ~27 designs. To bring them over:
1. Collect the original image files (highest resolution available).
2. Sign in to `/admin`, open the **Work** (home) page, and use the **Image gallery**
   block — click **Add image** and upload each one. Set alt text/captions as desired.
3. Fill in the **About** page text and update **Site settings** (name, tagline,
   Instagram/Facebook/email).

---

## Security model

- The public (anonymous) role can **only read published content** — enforced by
  Postgres Row Level Security, not just the UI.
- Only an authenticated user (the single admin account) can write.
- Public sign-ups are disabled, so "authenticated" only ever means the owner.
- The browser only ever uses the public anon key; all access is gated by RLS.

## Project structure

```
app/(public)/            Public read-only site (home, /[slug]) + layout
app/admin/login/         Login page
app/admin/(dashboard)/   Protected admin: page list, page editor, settings
components/blocks/        Public block renderers
components/admin/         Block editors, image uploader, forms
components/public/        Site header & footer
lib/supabase/            Supabase client helpers (server, browser, proxy session)
lib/actions/             Server actions (save/create/delete pages, settings)
lib/types.ts             Block + data model types
lib/blocks.ts            Block factory + YouTube/Vimeo URL parsing
lib/data.ts              Public data fetching (settings, nav, pages)
supabase/migrations/     Database schema + RLS (run in Supabase SQL editor)
proxy.ts                 Auth session refresh + /admin guard
```
