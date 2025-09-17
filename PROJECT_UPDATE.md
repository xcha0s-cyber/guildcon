# Guild Con 2025 - Project Update
## Date: September 17, 2025

## Project Decision: Using Simple HTML Site Only

### What We Did Today
1. **Analyzed the entire project structure** - Found multiple implementations including Next.js app, FastAPI backend, and static HTML site
2. **Created a complete backup** - Saved everything in `backup_old_project/` directory
3. **Cleaned up the project** - Removed unnecessary Next.js, backend, and Docker files
4. **Kept the essential parts**:
   - `/site` directory - Contains the complete HTML website
   - `/docs` directory - Original documentation
   - `/backup_old_project` - Complete backup of everything

### Current Project Structure
```
guildcon/
├── site/                  # Main HTML website (THIS IS WHAT WE'RE USING)
│   ├── index.html        # Homepage
│   ├── cfp.html          # Call for Papers
│   ├── ctf.html          # CTF information
│   ├── talks.html        # Talks page
│   ├── workshops.html    # Workshops page
│   ├── sponsors.html     # Sponsors page
│   ├── countdown.html    # Countdown page
│   ├── code-of-conduct.html # Code of Conduct
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   └── img/              # Images and logos
├── docs/                 # Documentation
└── backup_old_project/   # Full backup of original project
```

### Why This Approach
- **Simplicity**: Static HTML site is easy to deploy and maintain
- **Performance**: No server-side processing needed for the main site
- **Flexibility**: Can add CTF admin panel separately later without affecting the main site
- **Cost-effective**: Can be hosted on any static hosting service (GitHub Pages, Netlify, etc.)

### Next Steps: CTF Admin Panel
The plan is to add a separate CTF management/admin panel that will:
1. **Import players** from CSV (Eventbrite export)
2. **Create teams** - Randomize players into teams
3. **Manage tournament bracket** - Track matches and scores
4. **Display live results** - Show bracket on the website

This admin panel will be developed as a separate component that can integrate with the static site.

### Deployment Options
The simple HTML site can be deployed to:
- **GitHub Pages** - Free, easy setup with custom domain
- **Netlify** - Free tier available, automatic deploys
- **Vercel** - Great for static sites
- **Any web server** - Apache, Nginx, etc.
- **CDN** - CloudFlare Pages, AWS S3 + CloudFront

### Files Removed (but backed up)
- Next.js application files
- FastAPI backend
- Docker configuration
- Node.js dependencies
- Database models
- Complex build processes

### Current Site Features
The HTML site in `/site` includes:
- Modern design with hacker theme (neon green accents)
- Responsive layout
- Event information pages
- CFP and CTF information
- Workshop details
- Sponsor sections
- Countdown timer
- Professional styling

### Important Notes
- All removed files are safely stored in `backup_old_project/`
- The site is ready to deploy as-is
- External links (Eventbrite, Google Forms) need to be updated before going live
- CTF admin panel will be added as a separate feature later

---

## Summary
We've simplified the project to use only the static HTML site, which is complete and ready for deployment. The complex backend and Next.js components have been removed (but backed up). This approach provides a clean, maintainable solution that can be enhanced with a CTF admin panel when needed.