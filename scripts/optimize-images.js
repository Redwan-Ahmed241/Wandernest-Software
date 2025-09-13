#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if sharp is available, if not install it
try {
    require('sharp');
} catch (error) {
    console.log('Installing sharp for image optimization...');
    execSync('npm install sharp --save-dev', { stdio: 'inherit' });
}

const sharp = require('sharp');

const publicDir = path.join(__dirname, '../public');
const figmaPhotosDir = path.join(publicDir, 'Figma_photos');

// Image extensions to convert
const imageExtensions = ['.jpg', '.jpeg', '.png'];

// Function to convert image to WebP
async function convertToWebP(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .webp({ quality: 80, effort: 6 })
            .toFile(outputPath);
        console.log(`✓ Converted: ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
    } catch (error) {
        console.error(`✗ Failed to convert ${inputPath}:`, error.message);
    }
}

// Function to process directory recursively
async function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await processDirectory(filePath);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (imageExtensions.includes(ext)) {
                const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

                // Only convert if WebP doesn't exist or is older
                if (!fs.existsSync(webpPath) || fs.statSync(filePath).mtime > fs.statSync(webpPath).mtime) {
                    await convertToWebP(filePath, webpPath);
                } else {
                    console.log(`- Skipped (up to date): ${path.basename(filePath)}`);
                }
            }
        }
    }
}

// Main execution
async function main() {
    console.log('🖼️  Starting image optimization...\n');

    if (!fs.existsSync(figmaPhotosDir)) {
        console.error('❌ Figma_photos directory not found!');
        process.exit(1);
    }

    await processDirectory(figmaPhotosDir);

    console.log('\n✅ Image optimization complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Update your image references to use .webp extensions where available');
    console.log('2. Add fallback support for browsers that don\'t support WebP');
    console.log('3. Consider using the <picture> element for better browser support');
}

main().catch(console.error);
