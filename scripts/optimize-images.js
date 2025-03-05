const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

/**
 * Process a single image file
 * @param {string} filePath - Path to the image file
 * @param {string} outputDir - Directory to save optimized images
 */
async function processImage(filePath, outputDir) {
  try {
    const ext = path.extname(filePath).toLowerCase().substring(1);
    const fileNameWithoutExt = path.basename(filePath, path.extname(filePath));
    
    console.log(`⚙️ Optimizing: ${filePath}`);
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Create WebP version
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(path.join(outputDir, `${fileNameWithoutExt}.webp`));
      
    // Create AVIF version (better compression but less support)
    await sharp(filePath)
      .avif({ quality: 65 })
      .toFile(path.join(outputDir, `${fileNameWithoutExt}.avif`));
      
    // Optimize original
    if (ext !== 'webp' && ext !== 'avif') {
      const optimized = await sharp(filePath)
        .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
        .toBuffer();
        
      fs.writeFileSync(filePath, optimized);
    }
    
    console.log(`✅ Optimized: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${filePath}:`, error);
  }
}

/**
 * Recursively process all images in a directory
 * @param {string} dir - Directory to process
 */
async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively process subdirectories
      await processDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase().substring(1);
      
      if (FORMATS.includes(ext)) {
        await processImage(fullPath, path.dirname(fullPath));
      }
    }
  }
}

async function optimizeImages() {
  console.log('🔍 Scanning for images to optimize...');
  
  try {
    await processDirectory(PUBLIC_DIR);
    console.log('🎉 All images optimized successfully!');
  } catch (error) {
    console.error('❌ Error optimizing images:', error);
  }
}

optimizeImages(); 