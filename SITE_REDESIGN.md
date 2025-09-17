# Guild Con 2025 - Site Redesign Documentation
## Date: September 17, 2025

## Overview
Complete redesign of the Guild Con 2025 website with a modern, professional cyberpunk theme that aligns with the Humanitix event page for consistency.

## Major Changes Implemented

### 1. **Visual Theme Overhaul**
- **Color Scheme**: Switched from purple tones to professional gray palette
  - Primary background: `#141414` (dark gray)
  - Section backgrounds: `#1a1a1a` (slightly lighter gray)
  - Card backgrounds: `rgba(30, 30, 30, 0.8)`
  - Accent color: Cyan `#00e5ff` (used sparingly)
  - Secondary accent: Pink `#ff00aa` (minimal use)

### 2. **New Assets Added**
- `guildcon_logo.png` - New castle/shield logo design
- `guildcon_banner.png` - Cyberpunk city banner for hero section
- `guildcon_ticket.png` - General admission ticket design
- `CTF_ticket_guild_con.png` - CTF elimination ticket design

### 3. **CSS Architecture**
- Created `modern-style.css` replacing the old `style.css`
- Implemented CSS variables for consistent theming
- Added responsive design improvements
- Removed aggressive neon effects for subtler styling

### 4. **Typography & Spacing**
- Primary font: System fonts (-apple-system, BlinkMacSystemFont, etc.)
- Heading font: Orbitron (for tech/cyberpunk feel)
- Improved spacing with CSS variables (--space-xs through --space-2xl)
- Better text contrast for readability

### 5. **Component Updates**

#### **Navigation**
- Fixed header with blur backdrop
- Subtle borders instead of thick neon lines
- Mobile-responsive burger menu
- Consistent hover effects

#### **Hero Section**
- Full-width banner image with 85% opacity
- Text positioned at bottom with shadow for readability
- Reduced hero height to show more banner
- Gradient overlay for text contrast

#### **Buttons**
- All buttons now start transparent with cyan border
- Unified hover effect: cyan fill with black text
- Removed polygon clip-path for standard border-radius
- Consistent styling across primary and secondary buttons

#### **Cards**
- Dark glass morphism effect
- Subtle borders with hover glow
- Better content hierarchy
- Rounded corners for modern look

#### **Footer**
- Fixed positioning issues (stays at bottom)
- Uses flexbox layout
- Consistent dark background
- Social links with hover animations

### 6. **Content Updates**

#### **Ticket Information**
- Clear distinction between General Admission and CTF tickets
- CTF ticket includes general admission (highlighted)
- 24-player limit for CTF clearly stated
- Notification requirement if unable to attend

#### **Registration Links**
- All links updated to Humanitix: `https://events.humanitix.com/guildcon`
- Removed Eventbrite references
- Consistent call-to-action buttons

#### **Professional Touches**
- Removed emoji (⚡ and ⚠️) for cleaner look
- Improved link colors (gray instead of blue)
- Better email/text link visibility
- Subtle animations instead of aggressive effects

### 7. **Page-Specific Fixes**

#### **Countdown Page**
- Updated to match main site theme
- Dark gray background
- Cyan timer units with hover effects
- Consistent typography

#### **Talks & Workshops Pages**
- Fixed footer floating issue
- Added min-height to content sections
- Proper flexbox layout implementation

### 8. **JavaScript Enhancements**
- Created `modern.js` for interactions
- Mobile menu toggle
- Parallax scrolling on hero banner
- Typing effect for tagline
- Smooth hover interactions

## Technical Implementation

### **File Structure**
```
site/
├── css/
│   ├── style.css (old - kept for reference)
│   └── modern-style.css (new - active)
├── js/
│   ├── main.js (old)
│   └── modern.js (new - active)
├── img/
│   ├── logo.png (updated)
│   ├── banner.png (new)
│   ├── ticket.png (new)
│   └── ctf_ticket.png (new)
└── [HTML files - all updated]
```

### **Browser Compatibility**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (iOS and Android)
- Fallback fonts for system compatibility
- CSS Grid and Flexbox for layout

### **Performance Considerations**
- Optimized image sizes
- Minimal JavaScript
- CSS animations use transform/opacity for GPU acceleration
- Efficient selector usage

## Deployment Notes

### **Required Assets**
All new images must be deployed:
- `/site/img/banner.png` - Hero background
- `/site/img/logo.png` - Updated logo
- `/site/img/ticket.png` - General ticket design
- `/site/img/ctf_ticket.png` - CTF ticket design

### **CSS/JS Updates**
- All HTML files now reference `modern-style.css` and `modern.js`
- Old files can be removed after confirming deployment

### **Testing Checklist**
- [ ] Mobile responsiveness
- [ ] Button hover effects
- [ ] Footer positioning on all pages
- [ ] Image loading
- [ ] Registration links functional
- [ ] Navigation menu on mobile
- [ ] Countdown timer functionality

## Future Enhancements

### **Potential Improvements**
1. Add loading animations
2. Implement smooth scroll between sections
3. Add micro-interactions for cards
4. Consider adding particle effects (subtle)
5. Optimize images further with WebP format

### **CTF Admin Panel**
- To be developed separately
- Will maintain consistent theme
- Authentication system needed
- Database integration for player management

## Summary
The redesign successfully modernizes the Guild Con 2025 website with a professional cyberpunk aesthetic that aligns with the Humanitix event page. The site now features improved readability, better user experience, and consistent branding throughout. All critical functionality has been preserved while significantly enhancing the visual appeal and professional appearance.