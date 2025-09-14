

# Admin/CMS PRD (Guild Con)

## Objectives

* Non-devs can update all visible copy, schedules, rules, sponsor tiers, and announcement cards without redeploys.
* Moderate CFP/CTF submissions and export lists fast.
* Maintain brand consistency and auditability.

## Roles & Auth

* **Owner** (you): full access, settings, theming.
* **Editor**: create/edit content, approve posts, view/export submissions.
* **Reviewer**: view-only, leave notes.
* **Auth**: email+password + WebAuthn (security keys). Optional SSO (Google/Microsoft). **2FA required**.

## Content Types

* **Site Settings**: event date, city, format, hero text, CFP open/close, social links, logo/image assets.
* **Pages**:

  * **Talks** (title, abstract, speaker, track, duration, level, tags, publish flag).
  * **Workshops** (title, instructor, requirements, capacity, price/waiver flag).
  * **Announcements** (General, CFP, CTF, Sponsors) with schedule for auto-publish.
  * **CTF Rules** (ordered list), **Schedule** (ordered list), **Venue** (rich text + map).
  * **Sponsor Tiers** (name, price range, perks\[], CTA link/email).
* **Submissions**:

  * **CFP Submissions** (name, email, title, abstract, track, status: new|review|accepted|waitlist|rejected, notes).
  * **CTF Registrations** (name, email, handle, status: registered|waitlist|withdrawn, notes).

## Editing Features

* Inline WYSIWYG (Markdown + limited embeds).
* Reorder lists via drag-and-drop (rules, schedule, perks).
* Media library (logo, background, speaker photos) with automatic web-friendly variants.
* Preview before publish; scheduled publishing.
* **Audit log** (who changed what, when). Version history + revert.

## Workflows

* **CFP**: submit → triage → reviewer notes → accept/waitlist/reject → auto-populate “Talks” when accepted.
* **CTF**: register → capacity cap at 24 → waitlist → bulk email templates (confirmations).
* **Sponsors**: capture inquiries → pipeline status (interested|negotiating|won|lost).

## Data Model (relational sketch)

* `settings(id, hero_title, hero_subtitle, date, city, format, cfp_note, social_links_json, theme_json)`
* `announcement(id, type, title, body_md, publish_at, status)`
* `talk(id, title, abstract_md, speaker, track ENUM('Talk','Workshop'), level, duration_min, tags[], published BOOL)`
* `workshop(id, title, abstract_md, instructor, requirements_md, capacity, published BOOL)`
* `sponsor_tier(id, name, price_min, price_max, perks[], cta_url)`
* `ctf_rule(id, order, text_md)`
* `schedule_item(id, order, text)`
* `cfp_submission(id, name, email, title, abstract_md, track, status, notes_md, created_at)`
* `ctf_registration(id, name, email, handle, status, notes_md, created_at)`
* `media(id, url, alt, width, height, kind, created_at)`
* `audit_log(id, actor, action, entity, entity_id, before_json, after_json, ts)`

## Tech Options

1. **Headless CMS** (fastest to production)

   * **Strapi** / **Payload** / **Directus** (Postgres).
   * Pros: Roles, media, REST/GraphQL, webhooks, versioning.
   * Cons: Custom deploy + patching.

2. **Custom Next.js Admin**

   * Next.js (App Router) + **Prisma + Postgres** + next-auth (Email/Google/Passkeys).
   * Pros: Total control, seamless with site.
   * Cons: More eng time (1–2 days to MVP).

## APIs (if custom)

* `GET /api/public/content` → all public content (cached).
* `POST /api/admin/settings` (Owner/Editor).
* `POST /api/admin/talks`, `PATCH /api/admin/talks/:id`, etc.
* `POST /api/public/cfp` → create submission (spam-protected with hCaptcha).
* `POST /api/public/ctf` → create registration (rate-limited).
* `GET /api/admin/export/cfp|ctf.csv` → CSV export.

## Security & Ops

* Rate-limit public forms; hCaptcha.
* Email verification + 2FA.
* RBAC on every admin route.
* Audit log on mutations.
* Backups: daily DB snapshot + object storage for media.
* CDN for images; stale-while-revalidate for public content.

## Implementation Plan (quick)

* **Day 1:** Pick **Strapi** or **Next.js+Prisma**; scaffold schema; auth; seed content; connect Admin UI.
* **Day 2:** Wire forms (CFP/CTF), exports, audit log, media, and deploy (Vercel + Supabase/Render).

---


