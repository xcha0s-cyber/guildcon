#!/usr/bin/env python3
"""
Image optimization script for Guild Con website
Converts large PNGs to optimized JPEGs and creates WebP versions
"""

from PIL import Image
import os
from pathlib import Path

def optimize_images():
    img_dir = Path("img")

    # Images to optimize (excluding logo which should stay PNG)
    images_to_optimize = [
        ("banner.png", 85),
        ("ticket.png", 85),
        ("ctf_ticket.png", 85)
    ]

    print("🖼️  Starting image optimization...")
    print("-" * 50)

    for img_name, quality in images_to_optimize:
        img_path = img_dir / img_name

        if not img_path.exists():
            print(f"⚠️  {img_name} not found, skipping...")
            continue

        # Open the image
        img = Image.open(img_path)

        # Get original size
        original_size = img_path.stat().st_size / 1024 / 1024  # MB

        # Convert to RGB if necessary (for JPEG)
        if img.mode in ('RGBA', 'P'):
            # Create a white background
            background = Image.new('RGB', img.size, (20, 20, 20))  # Dark background for dark theme
            if img.mode == 'RGBA':
                background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
            else:
                background.paste(img)
            img = background

        # Save as optimized JPEG
        jpg_path = img_dir / img_name.replace('.png', '.jpg')
        img.save(jpg_path, 'JPEG', quality=quality, optimize=True)
        jpg_size = jpg_path.stat().st_size / 1024 / 1024  # MB

        # Save as WebP for modern browsers
        webp_path = img_dir / img_name.replace('.png', '.webp')
        img.save(webp_path, 'WEBP', quality=quality, optimize=True)
        webp_size = webp_path.stat().st_size / 1024 / 1024  # MB

        print(f"\n✅ {img_name}")
        print(f"   Original PNG: {original_size:.2f} MB")
        print(f"   Optimized JPG: {jpg_size:.2f} MB ({(1 - jpg_size/original_size)*100:.0f}% reduction)")
        print(f"   WebP: {webp_size:.2f} MB ({(1 - webp_size/original_size)*100:.0f}% reduction)")

    # Optimize logo (keep as PNG but compress)
    logo_path = img_dir / "logo.png"
    if logo_path.exists():
        logo = Image.open(logo_path)
        original_size = logo_path.stat().st_size / 1024  # KB

        # Save with optimization
        logo.save(logo_path, 'PNG', optimize=True)
        new_size = logo_path.stat().st_size / 1024  # KB

        print(f"\n✅ logo.png")
        print(f"   Original: {original_size:.0f} KB")
        print(f"   Optimized: {new_size:.0f} KB ({(1 - new_size/original_size)*100:.0f}% reduction)")

    print("\n" + "-" * 50)
    print("🎉 Image optimization complete!")

    # Calculate total savings
    total_before = sum((img_dir / name).stat().st_size for name, _ in images_to_optimize if (img_dir / name).exists())
    total_after = sum((img_dir / name.replace('.png', '.jpg')).stat().st_size for name, _ in images_to_optimize if (img_dir / name.replace('.png', '.jpg')).exists())

    print(f"\n📊 Total size reduction: {(total_before - total_after) / 1024 / 1024:.2f} MB")
    print(f"   ({(1 - total_after/total_before)*100:.0f}% reduction)")

if __name__ == "__main__":
    optimize_images()