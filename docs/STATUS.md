# Project Status – Guild Con

Last updated: initial scaffold

What’s implemented
- Docker Compose: Postgres (`db`), Directus (`directus`), Next.js (`web`).
- Env templates: `.env.compose.example` with overridable ports and secrets.
- NGINX samples: `nginx/sample.conf` for site and Directus hosts.
- Next.js app with API routes:
  - `POST /api/cfp` → saves to Directus `cfp_submissions`.
  - `POST /api/ctf/register` → saves to Directus `ctf_players`.
  - `POST /api/ctf/randomize` (admin) → creates 8 teams of 3 from 24 checked‑in players.
  - `PATCH /api/ctf/teams` (admin) → rename team.
  - `POST /api/ctf/bracket` (admin) → generate QF/SF/Final bracket links.
- Admin UI: `/admin/ctf` page to perform randomize/rename/generate using `x-admin-token`.
- Public pages: `/cfp`, `/ctf` forms calling the APIs.

What’s pending (high‑priority)
- Directus schema snapshot (to auto‑create collections/fields).
- Score entry endpoint for matches and winner propagation.
- Public read‑only bracket view (projector page).
- Rate limiting + hCaptcha on public forms.
- Cloudflare/NGINX hardening docs (Access/IP allowlist for admin paths).

Notes
- Directus service token is required for the site to talk to the API; set `DIRECTUS_TOKEN` in `.env`.
- Admin token for site admin routes is `ADMIN_TOKEN`; also protect `/admin/*` and Directus `/admin` via Cloudflare/NGINX.

