# Handoff – Guild Con Web

This document brings the next dev up to speed so work can continue immediately. It covers architecture, current state, how to run locally, what to build next, and day‑of operations for the CTF.

Owner prefers: self‑hosted Docker, NGINX + Cloudflare in front, and a simple admin to edit pages. We selected Directus (self‑hosted headless CMS) to save dev time and handle content + submissions, while custom CTF tools live in the Next.js app.

## 1) Architecture
- Next.js 14 (App Router) + TypeScript – folder `src/`.
- Directus (Node) – admin UI + REST on top of Postgres.
- Postgres 16 – database for all content and submissions.
- Docker Compose – see `docker-compose.yml`.
- Reverse proxy: NGINX (samples in `nginx/sample.conf`), Cloudflare in front for SSL and Access.

Environment variables
- `.env.compose.example` → copy to `.env` and adjust.
- Important: `ADMIN_TOKEN` (site admin header), `DIRECTUS_TOKEN` (Directus service token for server‑side calls), `DIRECTUS_PORT`, `WEB_PORT` (change to avoid conflicts on host).

## 2) What’s implemented
- Public pages: `/`, `/cfp`, `/ctf` (simple forms wired to our API routes).
- API routes (Next.js):
  - `POST /api/cfp` → creates `cfp_submissions` in Directus.
  - `POST /api/ctf/register` → creates `ctf_players` in Directus.
  - `POST /api/ctf/randomize` [admin] → takes exactly 24 checked‑in players, shuffles to 8 teams of 3, writes teams and assigns player.team_id.
  - `PATCH /api/ctf/teams` [admin] → rename team by id.
  - `POST /api/ctf/bracket` [admin] → generates bracket: QF (4), SF (2), F (1) + links `next_match`/`next_slot`.
- Admin UI: `/admin/ctf` – enter ADMIN_TOKEN, buttons for Randomize 8×3, Generate Bracket, and inline team renaming.
- Directus client helper: `src/lib/directus.ts` (server‑side fetch with service token).
- Docs: `README.md` (setup), `docs/STATUS.md`, `docs/TASKS.md`.
- Docker Compose with `db`, `directus`, and `web` services.

## 3) What remains (prioritized)
1. Directus schema – create collections/fields or import a snapshot (see Section 4).
2. Match score entry + winner propagation:
   - Endpoint: `PATCH /api/ctf/match/:id` body `{ scoreA, scoreB }` → compute winner, set `winner`, and place into `next_match` in slot `next_slot`.
   - Simple admin UI to edit scores and auto‑advance.
3. Public bracket page:
   - Read‑only viewer for projector. Poll/SWR for live updates.
4. Rate limits + optional hCaptcha on `POST /api/cfp` and `POST /api/ctf/register`.
5. Cloudflare/NGINX hardening:
   - Cloudflare Access on Directus `/admin` and optionally site `/admin/*`.
   - NGINX IP allowlist or BasicAuth for Directus `/admin`.
6. Backups: nightly Postgres dump + `directus_uploads` volume snapshot.
7. Optional: Email notifications on new CFP/CTF submissions.

## 4) Directus – collections to create
Create via the admin UI (Settings → Data Model). Names below are the collection slugs used by the API code.

Content
- `settings` (single):
  - `hero_title` (string), `hero_subtitle` (text), `date` (datetime), `city` (string), `social_links` (JSON).
- `announcements`: title (string), type (string: General|CFP|CTF|Sponsors), body_md (text), publish_at (datetime), status (string), published (bool).
- `talks`: title (string), speaker (string), track (string: Talk|Workshop), abstract_md (text), level (string), duration (int), tags (JSON), published (bool).
- `workshops`: title (string), instructor (string), requirements_md (text), capacity (int), published (bool).
- `sponsor_tiers`: name (string), price_min (int), price_max (int), perks (JSON array), cta_url (string).
- `ctf_rules`: text (string).
- `schedule_items`: text (string), order (int).

Submissions + CTF
- `cfp_submissions`: name (string), email (string), title (string), abstract_md (text), track (string), status (string default=new), notes (text).
- `ctf_players`: name (string), email (string), handle (string), status (string default=registered), checked_in (bool default=false), team (M2O → `ctf_teams`).
- `ctf_teams`: name (string), seed (int, nullable).
- `ctf_matches`: round (string enum QF|SF|F), index_in_round (int), team_a (M2O → `ctf_teams`), team_b (M2O → `ctf_teams`), score_a (int), score_b (int), winner (M2O → `ctf_teams`), next_match (M2O → `ctf_matches`), next_slot (string enum A|B).

Permissions
- Public role: Create on `cfp_submissions` and `ctf_players` only.
- Service token role (used by Next.js): Read on content; Read/Write on CTF tables.
- Admins: full control. Also protect `/admin` via Cloudflare Access.

Service Token
- Directus → Settings → Access Tokens → New token (role with required permissions). Put value into `.env` as `DIRECTUS_TOKEN` and restart `web`.

Optional: schema snapshot
- Once the model is created, export with `npx directus schema snapshot schema.yaml` from inside the `directus` container and commit it to `directus/`.
- Later we can auto‑apply with `npx directus schema apply schema.yaml` on deploy.

## 5) Running locally
1. `cp .env.compose.example .env` and set strong secrets; default ports are 8080 (web) and 8055 (Directus).
2. `docker compose up -d` (first run pulls images; can take a minute).
3. Open Directus at `http://localhost:8055` and log in using `.env` credentials.
4. Create the Service Token; set `DIRECTUS_TOKEN` in `.env`; `docker compose restart web`.
5. Create collections (Section 4) or apply the schema snapshot if present.
6. Site at `http://localhost:8080`. Try `/cfp`, `/ctf`, and `/admin/ctf` (requires `x-admin-token: ADMIN_TOKEN`).

## 6) Deploy (self‑hosted)
- Reverse proxy NGINX in front of `web` and `directus`. Sample config in `nginx/sample.conf` (Cloudflare handles SSL).
- Restrict Directus `/admin` using Cloudflare Access and/or NGINX BasicAuth/IP allowlist.
- Backups: cron job for `pg_dump` and tar the `directus_uploads` volume.

## 7) API contracts (current)
- CFP `POST /api/cfp` body `{ name, email, title, abstract, track: 'Talk'|'Workshop' }` → `{ ok, id }`.
- CTF Register `POST /api/ctf/register` body `{ name, email, handle? }` → `{ ok, id }`.
- Randomize `POST /api/ctf/randomize` headers `{ 'x-admin-token': ADMIN_TOKEN }` → `{ ok, teams }`. Requires exactly 24 `ctf_players` with `checked_in = true`.
- Rename team `PATCH /api/ctf/teams` headers admin; body `{ id, name }` → `{ ok }`.
- Create bracket `POST /api/ctf/bracket` headers admin → `{ ok }`.

## 8) Next actions for you (today)
- Create Directus collections and set a Service Token.
- Test: submit a few CFP and CTF entries. Manually set 24 players to `checked_in = true` and test randomize + bracket.
- Confirm we want a public bracket screen and score entry UI → I’ll implement those next.

## 9) Troubleshooting
- 404s from APIs: ensure `DIRECTUS_TOKEN` is set and the role has permissions.
- Randomize fails with count error: verify exactly 24 players have `checked_in = true`.
- CORS errors in dev: Directus `CORS_ORIGIN` can be `*` locally.
- Port conflicts: change `WEB_PORT` and/or `DIRECTUS_PORT` in `.env` and restart.

---
Prepared by: previous shift
Contact: add your preferred Slack/Discord here
