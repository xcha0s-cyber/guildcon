#!/bin/bash

# Speed optimization script for Guild Con site
# Run this before deployment for blazing fast loading

echo "🚀 Starting optimization..."

# 1. Image Optimization (requires imagemagick and optipng)
echo "📸 Optimizing images..."
if command -v convert &> /dev/null; then
    # Convert large PNGs to optimized JPEGs where appropriate
    convert img/banner.png -quality 85 -strip img/banner.jpg
    convert img/ticket.png -quality 85 -strip img/ticket.jpg
    convert img/ctf_ticket.png -quality 85 -strip img/ctf_ticket.jpg

    # Keep logo as PNG but optimize it
    if command -v optipng &> /dev/null; then
        optipng -o5 img/logo.png
    fi

    echo "✅ Images optimized"
else
    echo "⚠️  Install imagemagick for image optimization: sudo apt-get install imagemagick"
fi

# 2. CSS Minification (requires cssnano or clean-css)
echo "🎨 Minifying CSS..."
if command -v cleancss &> /dev/null; then
    cleancss -o css/modern-style.min.css css/modern-style.css
    cleancss -o css/accessibility.min.css css/accessibility.css
    echo "✅ CSS minified"
else
    echo "⚠️  Install clean-css for CSS minification: npm install -g clean-css-cli"
fi

# 3. JavaScript Minification (requires uglify-js)
echo "📦 Minifying JavaScript..."
if command -v uglifyjs &> /dev/null; then
    uglifyjs js/modern.js -o js/modern.min.js -c -m
    echo "✅ JavaScript minified"
else
    echo "⚠️  Install uglify-js for JS minification: npm install -g uglify-js"
fi

# 4. HTML Minification (requires html-minifier)
echo "📄 Minifying HTML..."
if command -v html-minifier &> /dev/null; then
    for file in *.html; do
        html-minifier --collapse-whitespace --remove-comments --minify-css true --minify-js true "$file" -o "$file.tmp"
        mv "$file.tmp" "$file"
    done
    echo "✅ HTML minified"
else
    echo "⚠️  Install html-minifier: npm install -g html-minifier"
fi

echo "✨ Optimization complete!"
echo ""
echo "📊 Size comparison:"
echo "Before: $(du -sh . | cut -f1)"
echo ""
echo "🔧 Don't forget to:"
echo "1. Update HTML files to use .min.css and .min.js versions"
echo "2. Configure nginx with gzip compression"
echo "3. Set proper cache headers"
echo "4. Use a CDN for static assets"