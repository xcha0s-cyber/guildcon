# Current Tasks

Must‑do before production
- Create Directus collections/fields (or import schema snapshot once provided).
- Configure service token and set `DIRECTUS_TOKEN` in `.env` for the `web` container.
- Protect admin surfaces: Cloudflare Access + NGINX BasicAuth/IP allowlist for Directus `/admin` and site `/admin/*`.
- Add rate limiting for `POST /api/cfp` and `POST /api/ctf/register` at NGINX.
- Implement match score entry API and auto‑advance winners; add UI.
- Public read‑only bracket view for projector.
- Backups: nightly Postgres dump and `directus_uploads` snapshot.

Nice‑to‑have
- hCaptcha on public forms.
- Directus schema snapshot + apply command wired to Compose.
- Email notifications for CFP/CTF submissions.
- Styling polish and logo assets.

Day‑of runbook (CTF)
- In Directus, mark `checked_in = true` for present players.
- Open `/admin/ctf`, enter admin token, click “Randomize 8×3”.
- Rename teams as needed; optionally adjust seeds.
- Click “Generate Bracket”.
- Use score entry page (to be added) to advance winners.
- Show public bracket page on projector.

