import fs from 'node:fs';
import path from 'node:path';

const MAX_BYTES = 1048576;
const sourcePath = new URL('./entry.png', import.meta.url);
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const outputPath = path.join(outputDir, 'entry.png');

const imageBytes = fs.readFileSync(sourcePath);
if (imageBytes.length === 0 || imageBytes.length > MAX_BYTES) {
  throw new Error(`Invalid entry.png size: ${imageBytes.length} bytes`);
}

const isPng =
  imageBytes.length >= 8 &&
  imageBytes[0] === 0x89 &&
  imageBytes[1] === 0x50 &&
  imageBytes[2] === 0x4e &&
  imageBytes[3] === 0x47;
const isJpeg =
  imageBytes.length >= 3 &&
  imageBytes[0] === 0xff &&
  imageBytes[1] === 0xd8 &&
  imageBytes[2] === 0xff;

if (!isPng && !isJpeg) {
  throw new Error('entry.png must start with valid PNG or JPEG magic bytes');
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true, mode: 0o755 });
}
try {
  process.umask(0o022);
} catch {
  // Ignore if umask cannot be changed in a restricted runtime.
}
fs.writeFileSync(outputPath, imageBytes, { mode: 0o644 });
try {
  fs.chmodSync(outputPath, 0o644);
} catch {
  // Ignore if chmod on output file is restricted by the sandbox.
}
