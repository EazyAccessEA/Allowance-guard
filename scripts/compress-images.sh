#!/bin/bash

# Simple image compression script
# This will compress your large images to reasonable sizes

echo "🗜️  Compressing large images..."

# Create a backup directory
mkdir -p public/backup
cp public/*.png public/backup/ 2>/dev/null || true
cp public/*.jpeg public/backup/ 2>/dev/null || true
cp public/*.jpg public/backup/ 2>/dev/null || true

# Function to compress image
compress_image() {
    local file="$1"
    local size_before=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    
    echo "Compressing $file..."
    
    # Use ImageMagick if available, otherwise skip
    if command -v magick &> /dev/null; then
        # Compress PNG files
        if [[ "$file" == *.png ]]; then
            magick "$file" -strip -quality 85 -define png:compression-level=9 "$file"
        fi
        
        # Compress JPEG files  
        if [[ "$file" == *.jpeg || "$file" == *.jpg ]]; then
            magick "$file" -strip -quality 85 -interlace Plane "$file"
        fi
    else
        echo "⚠️  ImageMagick not found. Install with: brew install imagemagick"
        return
    fi
    
    local size_after=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    local reduction=$(( (size_before - size_after) * 100 / size_before ))
    
    echo "✅ $file: $(($size_before / 1024 / 1024))MB → $(($size_after / 1024 / 1024))MB (${reduction}% reduction)"
}

# Compress large images
echo "📦 Compressing images larger than 1MB..."

for file in public/*.png public/*.jpeg public/*.jpg; do
    if [ -f "$file" ]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        if [ $size -gt 1048576 ]; then  # 1MB in bytes
            compress_image "$file"
        fi
    fi
done

echo ""
echo "✅ Image compression complete!"
echo "📁 Original images backed up to public/backup/"
echo "🚀 Your images should now load much faster!"
echo ""
echo "💡 Next.js will further optimize these images automatically when using the Image component"
