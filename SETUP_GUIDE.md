# Guild Con 2025 - Complete Setup Guide

## Overview
Guild Con 2025 is a conference website for Hackers Guild Pittsburgh's 1st birthday celebration (November 22, 2025). The site serves as an information hub with all registrations handled through external services (Eventbrite, Google Forms), while maintaining internal CTF tournament management tools.

## Architecture
- **Frontend/Backend**: Next.js 14 (App Router) with TypeScript
- **CMS**: Directus (headless CMS for content management)
- **Database**: PostgreSQL 16
- **Containerization**: Docker Compose
- **Reverse Proxy**: NGINX + Cloudflare

## Features

### Public Pages
- **Home** (`/`) - Hero section with time-based announcements
- **Info** (`/info`) - Event details, schedule, venue information
- **Talks** (`/talks`) - List of conference talks
- **Workshops** (`/workshops`) - Workshop descriptions with Eventbrite links
- **CTF** (`/ctf`) - CTF information with Eventbrite registration link
- **CFP** (`/cfp`) - Call for Papers info with Google Form link
- **Sponsors** (`/sponsors`) - Thank you page for current sponsors
- **Become a Sponsor** (`/become-a-sponsor`) - Sponsorship tiers and benefits
- **CTF Bracket** (`/ctf/bracket`) - Live tournament bracket (auto-refreshes)
- **CTF Results** (`/ctf/results`) - Tournament standings and match results

### Admin Features
- **CTF Admin** (`/admin/ctf`) - Protected admin panel for:
  - CSV import of players from Eventbrite
  - Team randomization (24 players → 8 teams of 3)
  - Team renaming
  - Bracket generation
  - Match score entry with auto-advancement

## Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development without Docker)
- Git

### Step 1: Clone and Configure

```bash
# Clone the repository
git clone <repository-url>
cd guildcon

# Copy environment template
cp .env.compose.example .env

# Edit .env file with your values
nano .env
```

### Step 2: Environment Variables

Required variables in `.env`:

```env
# Database
POSTGRES_USER=guildcon
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=guildcon

# Directus Admin
DIRECTUS_ADMIN_EMAIL=admin@guildcon.org
DIRECTUS_ADMIN_PASSWORD=<strong-password>
DIRECTUS_KEY=<random-uuid>
DIRECTUS_SECRET=<random-string>

# Directus Service Token (set after first run)
DIRECTUS_TOKEN=<will-be-set-later>

# Ports
WEB_PORT=8080
DIRECTUS_PORT=8055
DB_PORT=5432

# Admin Token for site admin features
ADMIN_TOKEN=<strong-random-token>

# External Links (Update these!)
EVENTBRITE_URL=https://www.eventbrite.com/e/your-event
GOOGLE_FORM_URL=https://docs.google.com/forms/d/your-form
```

### Step 3: Start Docker Stack

```bash
# Start all services
docker compose up -d

# Check logs
docker compose logs -f

# Services will be available at:
# - Website: http://localhost:8080
# - Directus: http://localhost:8055
```

### Step 4: Configure Directus

1. Open Directus admin: `http://localhost:8055`
2. Login with `DIRECTUS_ADMIN_EMAIL` and `DIRECTUS_ADMIN_PASSWORD`
3. Create collections (see below)
4. Create a Service Token:
   - Go to Settings → Access Tokens
   - Create new token with appropriate permissions
   - Copy the token
5. Add token to `.env` as `DIRECTUS_TOKEN`
6. Restart web service: `docker compose restart web`

### Step 5: Directus Collections Setup

Create these collections in Directus Admin (Settings → Data Model):

#### Content Collections

**settings** (Singleton)
- `hero_title` (String)
- `hero_subtitle` (Text)
- `date` (DateTime)
- `city` (String)
- `social_links` (JSON)

**announcements**
- `title` (String)
- `type` (String) - Options: General, CFP, CTF, Sponsors
- `body_md` (Text)
- `publish_at` (DateTime)
- `status` (String)
- `published` (Boolean)
- `priority` (String) - Options: normal, info, urgent

**talks**
- `title` (String)
- `speaker` (String)
- `track` (String) - Options: Talk, Workshop
- `abstract_md` (Text)
- `level` (String)
- `duration` (Integer)
- `tags` (JSON)
- `published` (Boolean)

**workshops**
- `title` (String)
- `instructor` (String)
- `requirements_md` (Text)
- `capacity` (Integer)
- `published` (Boolean)

**sponsor_tiers**
- `name` (String)
- `price_min` (Integer)
- `price_max` (Integer)
- `perks` (JSON Array)
- `cta_url` (String)

#### CTF Collections

**ctf_players**
- `name` (String)
- `email` (String)
- `handle` (String)
- `status` (String) - Default: registered
- `checked_in` (Boolean) - Default: false
- `team` (Many-to-One → ctf_teams)

**ctf_teams**
- `name` (String)
- `seed` (Integer, nullable)

**ctf_matches**
- `round` (String) - Options: QF, SF, F
- `index_in_round` (Integer)
- `team_a` (Many-to-One → ctf_teams)
- `team_b` (Many-to-One → ctf_teams)
- `score_a` (Integer)
- `score_b` (Integer)
- `winner` (Many-to-One → ctf_teams)
- `next_match` (Many-to-One → ctf_matches)
- `next_slot` (String) - Options: A, B

### Step 6: Permissions Setup

In Directus, configure these permissions:

**Public Role**:
- Read: settings, announcements, talks, workshops, sponsor_tiers
- No write permissions

**Service Token Role** (for Next.js):
- Read: All content collections
- Create/Update/Delete: ctf_players, ctf_teams, ctf_matches

## External Services Setup

### 1. Google Form for CFP
1. Create a Google Form with fields:
   - Name (Short answer, required)
   - Email (Short answer, email validation, required)
   - Talk Title (Short answer, required)
   - Talk Type (Multiple choice: Full Presentation, Lightning Talk)
   - Abstract (Paragraph, required)
   - Bio (Paragraph)

2. Update `/src/app/cfp/page.tsx` with your form URL

### 2. Eventbrite Setup
1. Create event on Eventbrite
2. Set up ticket types:
   - General Admission
   - Workshop Add-ons (separate tickets)
3. Update links in:
   - `/src/app/ctf/page.tsx`
   - `/src/app/workshops/page.tsx`
   - `/src/app/info/page.tsx`

## Day-of-Event Operations

### CTF Tournament Setup

#### Before the Event
1. Export attendee list from Eventbrite as CSV
2. Format CSV with columns: name, email, handle (optional)

#### Day of Event
1. Access admin panel: `/admin/ctf`
2. Enter admin token
3. Import players:
   - Click "Choose File" and select CSV
   - Click "Import Players"
   - Verify import success
4. Check-in players in Directus:
   - Open Directus admin
   - Go to ctf_players collection
   - Set `checked_in = true` for present players
   - Must have exactly 24 checked-in players
5. Generate teams:
   - Click "Randomize 8×3" button
   - Teams will be created automatically
6. Rename teams (optional):
   - Click on team names to edit
   - Press Enter or click outside to save
7. Generate bracket:
   - Click "Generate Bracket" button
   - Creates QF, SF, and Finals matches

#### During Tournament
1. Enter scores as matches complete
2. Winners auto-advance to next round
3. Public can view live bracket at `/ctf/bracket`
4. Results page updates automatically at `/ctf/results`

## Production Deployment

### 1. Server Requirements
- Ubuntu 20.04+ or similar
- Docker & Docker Compose
- NGINX
- SSL certificate (via Cloudflare or Let's Encrypt)

### 2. NGINX Configuration

Create `/etc/nginx/sites-available/guildcon`:

```nginx
upstream web_backend {
    server 127.0.0.1:8080;
}

upstream directus_backend {
    server 127.0.0.1:8055;
}

server {
    listen 80;
    server_name guildcon.org www.guildcon.org;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name guildcon.org www.guildcon.org;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Main site
    location / {
        proxy_pass http://web_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Directus admin
    location /cms {
        # Add IP restrictions or basic auth
        auth_basic "Admin Access";
        auth_basic_user_file /etc/nginx/.htpasswd;

        rewrite ^/cms(.*)$ $1 break;
        proxy_pass http://directus_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Protect admin routes
    location /admin {
        # Add IP restrictions
        allow 192.168.1.0/24;
        deny all;

        proxy_pass http://web_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Security Hardening

#### Cloudflare Setup
1. Enable Cloudflare proxy
2. Set up Cloudflare Access for `/admin` and `/cms` paths
3. Enable rate limiting
4. Configure firewall rules

#### Environment Security
```bash
# Generate strong passwords
openssl rand -base64 32

# Set proper permissions
chmod 600 .env
chmod 755 docker-compose.yml
```

### 4. Backup Strategy

Create backup script `/home/guildcon/backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/guildcon"

# Backup database
docker exec guildcon-db-1 pg_dump -U $POSTGRES_USER $POSTGRES_DB > $BACKUP_DIR/db_$DATE.sql

# Backup Directus uploads
docker run --rm -v guildcon_directus_uploads:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/uploads_$DATE.tar.gz -C /data .

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Add to crontab:
```bash
0 2 * * * /home/guildcon/backup.sh
```

### 5. Monitoring

Set up monitoring with:
- Uptime monitoring (Pingdom, UptimeRobot)
- Log aggregation (docker compose logs)
- Resource monitoring (htop, docker stats)

## Testing Checklist

### Pre-Launch
- [ ] All pages load correctly
- [ ] External links work (Eventbrite, Google Forms)
- [ ] Time-based announcements display correctly
- [ ] Directus content appears on site
- [ ] Mobile responsive design works
- [ ] CTF admin functions work
- [ ] CSV import successfully imports players

### CTF Testing
- [ ] Import test CSV with 24 players
- [ ] Mark all as checked_in
- [ ] Randomize teams successfully
- [ ] Rename teams
- [ ] Generate bracket
- [ ] Enter scores and verify advancement
- [ ] Public bracket updates
- [ ] Results page shows standings

### Performance
- [ ] Page load times < 3 seconds
- [ ] Images optimized
- [ ] Database queries optimized
- [ ] Caching headers set correctly

## Troubleshooting

### Common Issues

**Directus connection fails**
- Check DIRECTUS_TOKEN is set correctly
- Verify service token permissions
- Check Docker network connectivity

**CSV import fails**
- Ensure CSV has required columns: name, email
- Check for special characters in CSV
- Verify admin token is correct

**Teams randomization fails**
- Must have exactly 24 players with checked_in = true
- Check Directus for duplicate entries

**Bracket not displaying**
- Ensure matches exist in database
- Check browser console for errors
- Verify API endpoints return data

### Debug Commands

```bash
# View logs
docker compose logs -f web
docker compose logs -f directus

# Enter container
docker exec -it guildcon-web-1 sh

# Check database
docker exec -it guildcon-db-1 psql -U guildcon -d guildcon

# Restart services
docker compose restart web
docker compose restart directus

# Full restart
docker compose down && docker compose up -d
```

## Support

For issues or questions:
- GitHub Issues: [repository-issues-url]
- Email: tech@hackersguildpgh.org
- Discord: [discord-invite-link]

## License

© 2025 Hackers Guild PGH. All rights reserved.