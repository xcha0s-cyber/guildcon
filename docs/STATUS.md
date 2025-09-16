# Project Status – Guild Con

Last updated: 2025‑09‑15

Summary
- Local stack runs via Docker Compose: Postgres (`db`), Directus (`directus`), Next.js (`web`).
- Site now has a mobile‑first cyberpunk theme, header/footer, and CMS‑backed pages (Home/Talks/Sponsors), plus styled CFP/CTF forms and a public bracket page.
- CTF admin includes team randomization, team rename, bracket generation, and match scoring with automatic winner propagation.

How to run (dev)
1) `cp .env.compose.example .env` and adjust ports/secrets.
2) `docker compose up -d`
3) Directus first‑run: open `http://localhost:8055`, log in with `DIRECTUS_ADMIN_EMAIL` / `DIRECTUS_ADMIN_PASSWORD` from `.env`.
4) Either:
   - Set a service token in `.env` as `DIRECTUS_TOKEN` (recommended), or
   - For local dev only, grant the Public role the minimal reads/writes below.
5) Create the collections/fields in Directus as per README/HANDOFF. Restart `web` if you set a token: `docker compose restart web`.
6) Open the site: `http://localhost:8080`.

Directus auth (dev)
- If `DIRECTUS_TOKEN` is not set (or placeholder), the site omits the Authorization header. In that case, grant the Public role:
  - Read: `settings`, `announcements`, `talks`, `workshops`, `sponsor_tiers`, `ctf_rules`, `schedule_items`.
  - Create: `cfp_submissions`, `ctf_players`.
  - Read/Write/Create (for admin tools to work): `ctf_teams`, `ctf_matches`.
- For production, revoke Public writes, use a dedicated Service role + token with least‑privilege.

Implemented
- Docker + env templates + NGINX samples.
- Theme + layout: `src/app/globals.css`, updated `src/app/layout.tsx`.
- Public pages:
  - `/` Home (hero + CTAs, announcements, quick links) – pulls from Directus with fallbacks.
  - `/talks` – lists talks + workshops from Directus.
  - `/sponsors` – tier cards with perks and CTA.
  - `/cfp`, `/ctf` – styled forms.
  - `/ctf/bracket` – read‑only live bracket.
- Admin:
  - `/admin/ctf` – admin token input, randomize teams, rename teams, generate bracket, enter scores (auto‑advance winners).
- APIs:
  - `POST /api/cfp` – create CFP submission.
  - `POST /api/ctf/register` – create player.
  - `POST /api/ctf/randomize` – 24 checked‑in players → 8×3 teams.
  - `PATCH /api/ctf/teams` – rename team.
  - `POST /api/ctf/bracket` – generate QF/SF/F and link progressions.
  - `GET /api/ctf/matches` – list matches.
  - `PATCH /api/ctf/match/:id` – save scores, set winner, propagate to next.
  - `GET /api/health` – health probe.

Known gaps / next tasks
- Directus schema snapshot and apply script to automate setup.
- Public content formatting (Markdown render) and richer page content (Info page: venue, schedule, socials).
- Rate limiting + hCaptcha on public POSTs.
- Cloudflare Access/NGINX hardening for `/admin/*` and Directus `/admin`.
- Optional: Email notifications on new CFP/CTF submissions.

Known issues
- Without a valid `DIRECTUS_TOKEN`, any CMS reads/writes require the Public role permissions listed above; otherwise you’ll see 401/403 in logs.
- Lists will show “No … yet” until content exists in Directus.

Admin tokens
- Site admin routes require header `x-admin-token: $ADMIN_TOKEN` (set in `.env`).
- Still protect `/admin/*` path via Cloudflare Access/NGINX.

Quick test flow (CTF)
- Create/mark exactly 24 `ctf_players` as `checked_in=true` and `status=registered` in Directus.
- `/admin/ctf` → enter admin token → Randomize 8×3 → Generate Bracket.
- Enter QF/SF/F scores; winners advance automatically. View at `/ctf/bracket`.

Contact / handoff
- See `docs/HANDOFF.md` for architecture overview and API contracts.
