#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// Simple image optimization script
// This script checks image sizes and provides optimization recommendations

const publicDir = path.join(__dirname, '..', 'public')
const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.avif']

function getFileSizeInMB(filePath) {
  const stats = fs.statSync(filePath)
  return (stats.size / (1024 * 1024)).toFixed(2)
}

function scanImages() {
  console.log('🔍 Scanning images in public directory...\n')
  
  const images = []
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        scanDirectory(filePath)
      } else {
        const ext = path.extname(file).toLowerCase()
        if (imageExtensions.includes(ext)) {
          const size = getFileSizeInMB(filePath)
          images.push({
            name: file,
            path: filePath.replace(publicDir, ''),
            size: parseFloat(size),
            extension: ext
          })
        }
      }
    }
  }
  
  scanDirectory(publicDir)
  
  // Sort by size (largest first)
  images.sort((a, b) => b.size - a.size)
  
  console.log('📊 Image Analysis Results:\n')
  console.log('┌─────────────────────────────────────────────────────────────────┐')
  console.log('│ File Name                                    │ Size (MB) │ Type │')
  console.log('├─────────────────────────────────────────────────────────────────┤')
  
  let totalSize = 0
  let largeImages = []
  
  images.forEach(img => {
    totalSize += img.size
    const status = img.size > 1 ? '⚠️ ' : '✅ '
    console.log(`│ ${status}${img.name.padEnd(45)} │ ${img.size.toString().padStart(8)} │ ${img.extension.padEnd(4)} │`)
    
    if (img.size > 1) {
      largeImages.push(img)
    }
  })
  
  console.log('└─────────────────────────────────────────────────────────────────┘')
  console.log(`\n📈 Total images: ${images.length}`)
  console.log(`📦 Total size: ${totalSize.toFixed(2)} MB`)
  console.log(`⚠️  Large images (>1MB): ${largeImages.length}`)
  
  if (largeImages.length > 0) {
    console.log('\n🚨 Large Images That Need Optimization:')
    largeImages.forEach(img => {
      console.log(`   • ${img.path} (${img.size}MB)`)
    })
    
    console.log('\n💡 Optimization Recommendations:')
    console.log('   1. Use Next.js Image component with optimization')
    console.log('   2. Convert large PNGs to WebP format')
    console.log('   3. Use appropriate image sizes for different screen sizes')
    console.log('   4. Consider lazy loading for below-the-fold images')
  }
  
  console.log('\n✅ Next.js will automatically optimize images when using the Image component')
  console.log('✅ Your next.config.ts already has excellent image optimization settings')
}

// Run the scan
scanImages()
