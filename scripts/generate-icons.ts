/**
 * Generate PWA icons as simple PNG files.
 * Uses a minimal PNG encoder (no dependencies) to create solid icons
 * with the app's brand color and a terminal-style ">" prompt.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

// Minimal PNG encoder - creates valid PNG from raw RGBA pixel data
function createPng(width: number, height: number, pixels: Uint8Array): Buffer {
  const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf: Buffer): number {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type: string, data: Buffer): Buffer {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeB = Buffer.from(type, "ascii");
    const crcData = Buffer.concat([typeB, data]);
    const crcB = Buffer.alloc(4);
    crcB.writeUInt32BE(crc32(crcData));
    return Buffer.concat([len, crcData, crcB]);
  }

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT - raw pixel data with filter bytes
  const raw: number[] = [];
  for (let y = 0; y < height; y++) {
    raw.push(0); // filter: none
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      raw.push(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]);
    }
  }

  // Use Node's zlib for compression
  const zlib = require("zlib") as typeof import("zlib");
  const compressed = zlib.deflateSync(Buffer.from(raw));

  // IEND
  const iend = chunk("IEND", Buffer.alloc(0));

  return Buffer.concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    iend,
  ]);
}

function generateIcon(size: number): Buffer {
  const pixels = new Uint8Array(size * size * 4);

  // Background: GitHub dark (#0d1117)
  const bgR = 13, bgG = 17, bgB = 23;
  // Accent: terminal green
  const fgR = 63, fgG = 185, fgB = 80;

  // Fill background
  for (let i = 0; i < size * size; i++) {
    pixels[i * 4] = bgR;
    pixels[i * 4 + 1] = bgG;
    pixels[i * 4 + 2] = bgB;
    pixels[i * 4 + 3] = 255;
  }

  // Draw a rounded-corner rectangle effect (just round the corners)
  const radius = Math.floor(size * 0.15);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Check if pixel is outside rounded corners
      let outside = false;
      const corners = [
        [radius, radius],
        [size - 1 - radius, radius],
        [radius, size - 1 - radius],
        [size - 1 - radius, size - 1 - radius],
      ];
      for (const [cx, cy] of corners) {
        const inCornerRegion =
          (x < radius && y < radius) ||
          (x >= size - radius && y < radius) ||
          (x < radius && y >= size - radius) ||
          (x >= size - radius && y >= size - radius);
        if (inCornerRegion) {
          const dx = x - cx;
          const dy = y - cy;
          if (dx * dx + dy * dy > radius * radius) {
            outside = true;
          }
        }
      }
      if (outside) {
        const i = (y * size + x) * 4;
        pixels[i + 3] = 0; // transparent
      }
    }
  }

  // Draw ">" prompt symbol in center
  const promptSize = Math.floor(size * 0.35);
  const centerX = Math.floor(size / 2);
  const centerY = Math.floor(size / 2);
  const thickness = Math.max(Math.floor(size * 0.06), 2);

  // ">" is two lines meeting at a point on the right
  for (let i = 0; i <= promptSize; i++) {
    const t = i / promptSize; // 0 to 1
    // Top line: goes from top-left to center-right
    const topX = Math.floor(centerX - promptSize / 2 + t * promptSize);
    const topY = Math.floor(centerY - promptSize / 2 + t * promptSize / 2);
    // Bottom line: goes from center-right to bottom-left
    const botX = topX;
    const botY = Math.floor(centerY + promptSize / 2 - t * promptSize / 2);

    for (let dy = -thickness; dy <= thickness; dy++) {
      for (let dx = -thickness; dx <= thickness; dx++) {
        // Top stroke
        const px1 = topX + dx;
        const py1 = topY + dy;
        if (px1 >= 0 && px1 < size && py1 >= 0 && py1 < size) {
          const idx = (py1 * size + px1) * 4;
          if (pixels[idx + 3] > 0) {
            pixels[idx] = fgR;
            pixels[idx + 1] = fgG;
            pixels[idx + 2] = fgB;
          }
        }
        // Bottom stroke
        const px2 = botX + dx;
        const py2 = botY + dy;
        if (px2 >= 0 && px2 < size && py2 >= 0 && py2 < size) {
          const idx = (py2 * size + px2) * 4;
          if (pixels[idx + 3] > 0) {
            pixels[idx] = fgR;
            pixels[idx + 1] = fgG;
            pixels[idx + 2] = fgB;
          }
        }
      }
    }
  }

  return createPng(size, size, pixels);
}

// Generate icons
const outDir = join(process.cwd(), "public", "icons");
mkdirSync(outDir, { recursive: true });

for (const size of [192, 512]) {
  const png = generateIcon(size);
  const path = join(outDir, `icon-${size}.png`);
  writeFileSync(path, png);
  console.log(`✅ Generated ${path} (${png.length} bytes)`);
}
