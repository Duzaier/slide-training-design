import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '..');
const targetDir = 'D:\\ALL PROJECT\\OJT PROJECT\\figma-presentation-website';

console.log(`Source: ${sourceDir}`);
console.log(`Target: ${targetDir}`);

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function copyRecursive(src, dest, ignoreDirs = ['node_modules', '.git']) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    const base = path.basename(src);
    if (ignoreDirs.includes(base)) return;

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry), ignoreDirs);
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  console.log('Copying project files (excluding node_modules for high performance)...');
  copyRecursive(sourceDir, targetDir);
  console.log('✓ Project copied successfully to: ' + targetDir);

  // Check files in destination
  const copied = fs.readdirSync(targetDir);
  console.log('Files in destination:', copied.join(', '));
} catch (err) {
  console.error('Error copying project:', err);
}
