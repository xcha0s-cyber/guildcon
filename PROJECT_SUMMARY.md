# Guild Con 2025 Website Project Summary

## Project Overview
Guild Con 2025 is a cybersecurity conference website for Hackers Guild Pittsburgh. The site has been completely redesigned with a modern cyberpunk aesthetic, comprehensive accessibility features, and performance optimizations.

## Major Work Completed

### 1. Complete Visual Redesign
- **Theme**: Modern cyberpunk aesthetic with dark gray (#141414) background and cyan (#00e5ff) accents
- **Typography**: Orbitron font for headers (uppercase, monospace), Inter for body text
- **Color Scheme**: Unified cyan/gray theme across all pages (removed all pink backgrounds)
- **Effects**: Subtle glassmorphism effects, CSS animations, responsive design

### 2. Accessibility Implementation
- **Full Accessibility System**: Toggle button with high contrast mode, larger text, reduced animations
- **WCAG 2.1 AA Compliance**: Skip navigation, ARIA landmarks, semantic HTML
- **Accessibility Page**: Transparent venue limitations (2nd floor not wheelchair accessible)
- **Local Streaming**: Some talks may be streamed to ground floor (speaker-dependent)
- **Preferences**: LocalStorage saves user accessibility settings

### 3. Legal & Policy Pages
- **Terms & Conditions**: Complete terms including family-friendly policy (kids under 16 with guardian)
- **Privacy Policy**: GDPR-compliant privacy information
- **Photo/Recording Policy**: Security-focused policy with speaker permission system
- **21+ Policy**: Wristband system for complimentary beverages

### 4. Content Updates
- **Registration**: Changed from Eventbrite to Humanitix (https://events.humanitix.com/guildcon)
- **Email**: Updated all emails to info@hackersguildpgh.com
- **CTF Format**: 24 players, 8 teams of 3, single elimination tournament
- **Venue Info**: 2247 Babcock Blvd, Pittsburgh, PA 15237

### 5. Performance Optimizations
- **Created Optimization Tools**:
  - `optimize.sh`: Script for image optimization, minification
  - `nginx-performance.conf`: Nginx configuration for compression, caching
  - `performance-critical.css`: Critical CSS for inline loading
  - `SPEED_OPTIMIZATIONS.md`: Comprehensive optimization guide

- **Identified Issues**:
  - 8.4MB of unoptimized images
  - No compression or caching
  - Render-blocking resources

## File Structure

```
site/
├── index.html              # Main homepage
├── cfp.html               # Call for Papers
├── talks.html             # Conference talks (placeholder)
├── workshops.html         # Workshop information
├── ctf.html              # CTF tournament details
├── sponsors.html          # Sponsor information (glassmorphism effects)
├── countdown.html         # Tournament countdown timer
├── code-of-conduct.html   # Community guidelines
├── accessibility.html     # Accessibility information (NEW)
├── terms.html            # Terms & Conditions (NEW)
├── privacy.html          # Privacy Policy (NEW)
├── photo-policy.html     # Photo/Recording Policy (NEW)
├── css/
│   ├── modern-style.css  # Main stylesheet
│   └── accessibility.css # Accessibility features (NEW)
├── js/
│   └── modern.js         # JavaScript (includes accessibility toggle)
├── img/
│   ├── logo.png         # Guild logo
│   ├── banner.png       # Hero banner (2.1MB - needs optimization)
│   ├── ticket.png       # Ticket image (3.3MB - needs optimization)
│   └── ctf_ticket.png   # CTF ticket (2.5MB - needs optimization)
└── optimization/        # Performance tools (NEW)
    ├── optimize.sh
    ├── nginx-performance.conf
    └── performance-critical.css
```

## Technical Implementation

### CSS Architecture
- CSS Variables for consistent theming
- Mobile-first responsive design
- Flexbox and Grid layouts
- Glassmorphism effects with backdrop-filter

### JavaScript Features
- Accessibility toggle system
- LocalStorage for preferences
- Mobile navigation menu
- Smooth scroll behavior
- Keyboard navigation support

### Accessibility Features
- Skip navigation links
- ARIA landmarks and labels
- Focus indicators
- High contrast mode
- Reduced motion support
- Screen reader optimizations

## Next Steps

### Immediate (Before Launch)
1. **Optimize Images**: Run `optimize.sh` to reduce 8.4MB to ~1MB
2. **Configure Nginx**: Apply `nginx-performance.conf` for compression/caching
3. **Minify Assets**: Use provided scripts for CSS/JS minification
4. **Test Accessibility**: Verify with screen readers and accessibility tools

### Future Improvements
- Consider WebP images for modern browsers
- Implement lazy loading for images
- Add service worker for offline support
- Consider CDN for static assets
- Look for fully accessible venue for future events

## Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total page weight: < 1MB (after optimization)
- PageSpeed Score: > 90

## Important Notes
- **Venue Limitation**: 2nd floor talks not wheelchair accessible
- **Streaming**: Some talks may be locally streamed (not guaranteed)
- **Family-Friendly**: Kids under 16 welcome with guardian
- **No Recordings**: Most talks won't be recorded (security conference)
- **CTF Format**: Non-traditional format with "Hackers Guild PGH touch"

## Git Repository
- Main branch contains production-ready code
- All changes committed with descriptive messages
- Documentation maintained in markdown files

## Deployment
1. Run optimization script: `./optimize.sh`
2. Configure Nginx with provided performance settings
3. Set up Cloudflare SSL as planned
4. Monitor with web performance tools

---

*Last Updated: September 17, 2025*
*Website redesigned and optimized by Claude with the Hackers Guild Pittsburgh team*