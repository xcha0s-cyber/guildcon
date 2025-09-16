# Guild Con 2025 Website

Simple, maintainable conference website for Guild Con 2025 - Hackers Guild Pittsburgh's 1st Birthday Conference.

## Structure

```
guildcon/
├── site/                  # Static HTML website
│   ├── index.html        # Main page
│   ├── cfp.html          # Call for Papers (links to Google Form)
│   ├── talks.html        # Talk schedule
│   ├── workshops.html    # Workshop listings
│   ├── ctf.html          # CTF info page
│   ├── sponsors.html     # Sponsor page
│   ├── css/style.css     # All styles
│   └── js/main.js        # Simple JavaScript
│
└── ctf-backend/          # Minimal CTF tournament backend
    ├── app.py            # Flask application
    ├── requirements.txt  # Python dependencies
    └── templates/        # HTML templates for bracket
```

## Quick Start

### Static Website

The main site is just static HTML - no build process needed!

1. **To view locally:**
   ```bash
   cd site
   python3 -m http.server 8000
   # Visit http://localhost:8000
   ```

2. **To edit pages:**
   - Just edit the HTML files directly with vim/nano/your editor
   - No compilation or build needed
   - Changes are instant

3. **To deploy:**
   - Site will be hosted at: **https://guildcon.hackersguildpgh.com**
   - Upload the `site/` folder to your web host
   - For GitHub Pages: Push to gh-pages branch with CNAME file included
   - Or use any static hosting (Netlify, Vercel, etc.)

### CTF Backend (Tournament Day Only)

The CTF backend is only needed on tournament day for bracket management.

1. **Setup:**
   ```bash
   cd ctf-backend
   pip3 install -r requirements.txt
   ```

2. **Run:**
   ```bash
   python3 app.py
   # Visit http://localhost:5000
   # Admin at http://localhost:5000/admin
   ```

3. **Admin password:**
   Default: `ctfadmin2025`
   Change by setting environment variable: `ADMIN_PASSWORD=yourpassword`

## Editing Content

### Adding Talks/Workshops

Edit `site/talks.html` or `site/workshops.html` directly:

```html
<div class="talk-item">
    <div class="talk-time">10:15 AM - 11:00 AM</div>
    <div class="talk-details">
        <h3>Your Talk Title</h3>
        <p class="speaker">Speaker Name - Title</p>
        <p class="description">Talk description...</p>
    </div>
</div>
```

### Adding Sponsors

Edit `site/sponsors.html` and replace the placeholder divs:

```html
<div class="sponsor-grid large">
    <div class="sponsor-item">
        <img src="sponsor-logo.png" alt="Sponsor Name">
        <h4>Sponsor Name</h4>
        <p>Brief description</p>
    </div>
</div>
```

### Updating Announcements

Edit `site/index.html` in the announcements section:

```html
<article class="announcement">
    <span class="date">Dec 20, 2024</span>
    <h3>Your Announcement</h3>
    <p>Announcement details...</p>
</article>
```

## CTF Tournament Management

1. **Before the event:**
   - Export registrations from Eventbrite as CSV
   - Start the CTF backend

2. **Day of event:**
   - Login to admin panel
   - Import CSV of registered players
   - Check in players as they arrive
   - When ready: Randomize teams (24 → 8 teams)
   - Generate bracket
   - Update scores as matches complete
   - Public bracket auto-updates at `/`

## External Services

- **CFP**: Google Forms (linked in cfp.html)
- **Registration**: Eventbrite (linked throughout)
- **CTF Registration**: Eventbrite (separate ticket type)
- **Workshop Registration**: Eventbrite (separate tickets)

## Notes

- All registration is external (Eventbrite/Google Forms)
- No database needed for main site
- CTF backend uses simple JSON file storage
- Site is mobile-responsive
- Clean, modern hacker theme
- Easy to maintain with basic HTML/CSS knowledge

## Support

Contact: info@hackersguildpgh.com
