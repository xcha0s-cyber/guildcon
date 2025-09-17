# Cloudflare SSL & Configuration Setup

## 1. Cloudflare SSL Settings

In your Cloudflare dashboard for guildcon.org:

### SSL/TLS Settings
1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **"Full (strict)"** or **"Full"**
   - Use "Full (strict)" if you have a valid SSL cert on your server
   - Use "Full" if you're using a self-signed cert on your server

### Edge Certificates
- **Always Use HTTPS**: ON
- **Automatic HTTPS Rewrites**: ON
- **Minimum TLS Version**: 1.2

### Page Rules (for clean URLs)
Create these page rules:

1. **Rule 1: Remove trailing slashes**
   - URL: `*guildcon.org/*/ `
   - Setting: Forwarding URL (301)
   - Destination: `https://$1guildcon.org/$2`

2. **Rule 2: Force HTTPS**
   - URL: `http://*guildcon.org/*`
   - Setting: Always Use HTTPS

## 2. Cloudflare Performance Settings

### Speed → Optimization
- **Auto Minify**: Check all (JavaScript, CSS, HTML)
- **Brotli**: ON
- **Rocket Loader**: ON (test first, may break JS)
- **Mirage**: ON (if on Pro plan)
- **Polish**: Lossy (if on Pro plan)

### Caching → Configuration
- **Caching Level**: Standard
- **Browser Cache TTL**: Respect Existing Headers
- **Always Online**: ON

## 3. Nginx Installation & Setup

```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Copy the configuration
sudo cp nginx.conf /etc/nginx/sites-available/guildcon
sudo ln -s /etc/nginx/sites-available/guildcon /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Copy site files
sudo mkdir -p /var/www/guildcon
sudo cp -r site/* /var/www/guildcon/site/

# Set permissions
sudo chown -R www-data:www-data /var/www/guildcon
sudo chmod -R 755 /var/www/guildcon

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## 4. Testing Clean URLs

After setup, test these URLs (they should all work without .html):

- `https://guildcon.org` → Homepage
- `https://guildcon.org/cfp` → Call for Papers
- `https://guildcon.org/talks` → Talks page
- `https://guildcon.org/workshops` → Workshops
- `https://guildcon.org/ctf` → CTF Tournament
- `https://guildcon.org/sponsors` → Sponsors
- `https://guildcon.org/accessibility` → Accessibility
- `https://guildcon.org/privacy` → Privacy Policy
- `https://guildcon.org/terms` → Terms & Conditions
- `https://guildcon.org/photo-policy` → Photo Policy

## 5. Update Internal Links (Already Done)

All internal links in HTML files should NOT include .html:
```html
<!-- Good -->
<a href="/cfp">Call for Papers</a>

<!-- Bad -->
<a href="/cfp.html">Call for Papers</a>
```

## 6. Monitoring

### In Cloudflare Analytics, monitor:
- **Cache hit ratio** (should be > 90%)
- **Bandwidth saved**
- **Threats blocked**
- **Page load time**

### In Nginx logs, check:
```bash
# Access logs
tail -f /var/log/nginx/guildcon_access.log

# Error logs
tail -f /var/log/nginx/guildcon_error.log
```

## 7. Troubleshooting

### If clean URLs don't work:
1. Check nginx error log: `sudo tail -f /var/log/nginx/error.log`
2. Verify file exists: `ls /var/www/guildcon/site/cfp.html`
3. Test nginx config: `sudo nginx -t`

### If getting 502 errors with Cloudflare:
1. Check if your server is accessible
2. Verify SSL mode in Cloudflare matches your server setup
3. Check if Cloudflare IPs are whitelisted in firewall

### Cache not working:
1. Check response headers: `curl -I https://guildcon.org`
2. Look for `CF-Cache-Status: HIT`
3. Purge cache in Cloudflare if needed

## 8. Final Performance Tips

1. **Enable HTTP/2** in Cloudflare (automatic with SSL)
2. **Use Cloudflare's CDN** for all static assets
3. **Set up a 404.html page** for better UX
4. **Monitor Core Web Vitals** in Google PageSpeed Insights

With this setup, your site should:
- Load in < 1 second globally
- Have clean URLs (no .html)
- Be fully secured with SSL
- Score 90+ on PageSpeed Insights