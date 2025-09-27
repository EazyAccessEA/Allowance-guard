#!/bin/bash

# Compress blog post images to reasonable sizes
# These images are used in the blog and need to be optimized

echo "🗜️  Compressing blog post images..."

# Create backup directory
mkdir -p public/blog-backup
cp public/*.png public/blog-backup/ 2>/dev/null || true

# Blog images that need compression
BLOG_IMAGES=(
    "Staying Safe With DeFi Dapps.png"
    "Building Your Personal Web3 Security Routine.png"
    "Programmable Safety.png"
    "How to self audit.png"
    "What are token allowances.png"
    "Layer2.png"
    "Red_Team.png"
    "From Dapp User.png"
    "Hardware Wallets and Multisigs.png"
    "Gas.png"
    "AllowanceGuard_BG.png"
)

# Function to compress image
compress_blog_image() {
    local file="$1"
    local full_path="public/$file"
    
    if [ ! -f "$full_path" ]; then
        echo "⚠️  File not found: $file"
        return
    fi
    
    local size_before=$(stat -f%z "$full_path" 2>/dev/null || stat -c%s "$full_path" 2>/dev/null)
    local size_mb_before=$((size_before / 1024 / 1024))
    
    echo "📦 Compressing $file (${size_mb_before}MB)..."
    
    # Use ImageMagick if available
    if command -v magick &> /dev/null; then
        # Resize to max 1920px width and compress
        magick "$full_path" -resize 1920x1920\> -strip -quality 85 "$full_path"
        
        local size_after=$(stat -f%z "$full_path" 2>/dev/null || stat -c%s "$full_path" 2>/dev/null)
        local size_mb_after=$((size_after / 1024 / 1024))
        local reduction=$(( (size_before - size_after) * 100 / size_before ))
        
        echo "✅ $file: ${size_mb_before}MB → ${size_mb_after}MB (${reduction}% reduction)"
    else
        echo "⚠️  ImageMagick not found. Install with: brew install imagemagick"
        echo "💡 Manual optimization needed for: $file"
    fi
}

# Compress each blog image
for image in "${BLOG_IMAGES[@]}"; do
    compress_blog_image "$image"
done

echo ""
echo "✅ Blog image compression complete!"
echo "📁 Original images backed up to public/blog-backup/"
echo "🚀 Your blog images should now load much faster!"
echo ""
echo "💡 Next.js will further optimize these images automatically"
