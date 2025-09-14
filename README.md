# Guild Con Web (Self‑Hosted)

Node.js + Next.js 14 with Directus CMS and Postgres via Docker. Designed for NGINX + Cloudflare in front. Includes CFP + CTF registration and day‑of tools (randomize 24 players into 8×3 teams, rename teams, and generate an 8‑team bracket).

## Stack
- Next.js 14 (App Router) in Docker (`web`)
- Directus (headless CMS/admin) in Docker (`directus`)
- Postgres 16 in Docker (`db`)
- NGINX reverse proxy in front of both (samples in `nginx/sample.conf`)

## What’s Included
- API routes
  - `POST /api/cfp` → save CFP submissions to Directus
  - `POST /api/ctf/register` → save CTF registrations to Directus
  - `POST /api/ctf/randomize` (admin) → shuffle 24 checked‑in players → create 8 teams and assign players
  - `PATCH /api/ctf/teams` (admin) → rename team
  - `POST /api/ctf/bracket` (admin) → generate QF/SF/Final bracket and link progressions
- Admin UI
  - `/admin/ctf` → enter admin token, randomize teams, rename teams, build bracket
- Directus client helper in `src/lib/directus.ts`

## Quick Start (local)
1. Copy env template: `cp .env.compose.example .env` and edit values.
2. Start stack: `docker compose up -d` (or `docker-compose up -d`).
3. Directus first‑run:
   - Open `http://localhost:${DIRECTUS_PORT}`.
   - Login with `DIRECTUS_ADMIN_EMAIL` / `DIRECTUS_ADMIN_PASSWORD`.
   - Create a Service Token (Settings → Access Tokens). Put it in `.env` as `DIRECTUS_TOKEN`.
4. Create the collections in Directus (see below).
5. Open site: `http://localhost:${WEB_PORT}`.

## Directus Collections (create via Admin)
Single: `settings`
- hero_title (string), hero_subtitle (string), date (datetime), city (string), social_links (json)

Collections:
- `announcements` (title string, type string [General|CFP|CTF|Sponsors], body_md text, publish_at datetime, status string, published bool)
- `talks` (title string, speaker string, track string [Talk|Workshop], abstract_md text, level string, duration int, tags json, published bool)
- `workshops` (title string, instructor string, requirements_md text, capacity int, published bool)
- `sponsor_tiers` (name string, price_min int, price_max int, perks json, cta_url string)
- `ctf_rules` (text string)
- `schedule_items` (text string, order int)

Submissions:
- `cfp_submissions` (name string, email string, title string, abstract_md text, track string, status string default=new, notes text)
- `ctf_players` (name string, email string, handle string, status string default=registered, checked_in bool default=false, team_id relation → `ctf_teams`)
- `ctf_teams` (name string, seed int nullable)
- `ctf_matches` (round string enum: QF|SF|F, index_in_round int, team_a relation → `ctf_teams`, team_b relation → `ctf_teams`, score_a int, score_b int, winner relation → `ctf_teams`, next_match relation → `ctf_matches`, next_slot string enum: A|B)

Permissions:
- Public role: `create` on `cfp_submissions`, `ctf_players` (rate‑limit via NGINX/Cloudflare; add hCaptcha later).
- Service token role (used by the web app): `read` on content collections; `read/write` on CTF admin tables if you’ll use site admin tools.

## Admin Token
- Set `ADMIN_TOKEN` in `.env`.
- Admin API routes expect header `x-admin-token: $ADMIN_TOKEN`.
- Protect `/admin/*` path and the Directus admin with Cloudflare Access and/or NGINX BasicAuth/IP allowlist.

## Deployment
- Bind mount the repo to the `web` container; restarts pick up your code after `npm run build`.
- Reverse proxy samples in `nginx/sample.conf`. Put Cloudflare in front for SSL.
- Backups: nightly Postgres dump and `directus_uploads` volume snapshot.

## Day‑of Checklist (CTF)
- Mark present players in Directus (`checked_in = true`).
- `/admin/ctf` → Randomize 8×3 teams.
- Rename teams if desired.
- Generate bracket.
- Enter scores (endpoint for score updates can be added next).

## Next Improvements
- Score entry and winner propagation endpoint (PATCH `/api/ctf/match/:id`).
- Public read‑only bracket view.
- hCaptcha + rate‑limits on public forms.
- Directus schema snapshot to automate setup.

