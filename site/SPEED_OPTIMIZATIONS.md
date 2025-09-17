# 🚀 Speed Optimization Guide for Guild Con Site

## Current Performance Issues
- **8.4MB of images** causing slow initial load
- No compression or minification
- Render-blocking CSS and JavaScript
- No browser caching configured

## Recommended Optimizations (Priority Order)

### 1. 🖼️ Image Optimization (HIGHEST IMPACT)
**Problem:** Images are 8.4MB total (banner: 2.1MB, ticket: 3.3MB, ctf_ticket: 2.5MB)

**Solution:**
```bash
# Convert PNGs to optimized JPEGs (80% size reduction)
convert img/banner.png -quality 85 -strip img/banner.jpg
convert img/ticket.png -quality 85 -strip img/ticket.jpg
convert img/ctf_ticket.png -quality 85 -strip img/ctf_ticket.jpg

# Use WebP for modern browsers (90% size reduction)
cwebp img/banner.png -q 80 -o img/banner.webp
cwebp img/ticket.png -q 80 -o img/ticket.webp
```

**Update HTML:**
```html
<picture>
  <source srcset="img/banner.webp" type="image/webp">
  <img src="img/banner.jpg" alt="Guild Con Banner">
</picture>
```

### 2. 🗜️ Enable Nginx Compression
Add to your nginx config:
```nginx
gzip on;
gzip_types text/plain text/css application/javascript application/json image/svg+xml;
gzip_min_length 1024;
gzip_comp_level 6;
```

### 3. ⚡ Inline Critical CSS
Add critical CSS directly in `<head>` to prevent render blocking:
```html
<style>
/* Contents of performance-critical.css */
</style>
<link rel="preload" href="css/modern-style.css" as="style">
<link rel="stylesheet" href="css/modern-style.css" media="print" onload="this.media='all'">
```

### 4. 📦 Minify Everything
Run the optimization script before deployment:
```bash
chmod +x optimize.sh
./optimize.sh
```

### 5. 🎯 Lazy Load Images
```html
<img src="img/placeholder.jpg" data-src="img/actual.jpg" loading="lazy">
```

### 6. 🔄 Set Browser Cache Headers
Use provided nginx-performance.conf:
```nginx
location ~* \.(jpg|jpeg|png|css|js)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

### 7. 🌐 Use CDN for External Resources
Replace:
```html
<!-- Old -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- New - with preconnect -->
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

### 8. 📱 Preload Key Resources
```html
<link rel="preload" href="fonts/Orbitron-Bold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="img/logo.png" as="image">
<link rel="dns-prefetch" href="https://events.humanitix.com">
```

### 9. 🔧 Remove Unused CSS/JS
Since you removed Font Awesome icons from sponsors page, consider:
- Loading Font Awesome only on pages that need it
- Or switching to inline SVGs for the few icons used

### 10. 📊 Progressive Enhancement
```javascript
// Load non-critical features after page load
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Load analytics, non-critical features
    });
}
```

## Expected Performance Gains

| Optimization | Size Reduction | Load Time Impact |
|-------------|---------------|------------------|
| Image optimization | 6-7MB saved | -3-4 seconds |
| Gzip compression | 60-70% reduction | -0.5-1 second |
| Minification | 20-30% reduction | -0.2-0.3 seconds |
| Browser caching | 0% (repeat visits) | -2-3 seconds (repeat) |
| Critical CSS | N/A | -0.3-0.5 seconds TTFB |

**Total Expected Improvement: 70-80% faster initial load**

## Quick Implementation

1. **Immediate (5 minutes):**
   - Enable gzip in nginx
   - Add cache headers

2. **Short term (30 minutes):**
   - Optimize images
   - Minify CSS/JS

3. **Long term (2 hours):**
   - Implement lazy loading
   - Inline critical CSS
   - Add service worker for offline support

## Monitoring
After implementation, test with:
- Google PageSpeed Insights
- GTmetrix
- WebPageTest.org

Target metrics:
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total page weight: < 1MB