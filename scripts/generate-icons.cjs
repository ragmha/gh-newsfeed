// Generate minimal valid PNG icons for PWA manifest
const { writeFileSync, mkdirSync } = require("fs");
const { join } = require("path");
const zlib = require("zlib");

function createPng(size, pixels) {
  const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeB = Buffer.from(type, "ascii");
    const crcData = Buffer.concat([typeB, data]);
    const crcB = Buffer.alloc(4);
    crcB.writeUInt32BE(crc32(crcData));
    return Buffer.concat([len, crcData, crcB]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  const raw = [];
  for (let y = 0; y < size; y++) {
    raw.push(0);
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      raw.push(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]);
    }
  }

  const compressed = zlib.deflateSync(Buffer.from(raw));
  return Buffer.concat([
    SIGNATURE,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function generateIcon(size) {
  const pixels = new Uint8Array(size * size * 4);
  // Background: #0d1117
  for (let i = 0; i < size * size; i++) {
    pixels[i * 4] = 13;
    pixels[i * 4 + 1] = 17;
    pixels[i * 4 + 2] = 23;
    pixels[i * 4 + 3] = 255;
  }

  // Round corners
  const r = Math.floor(size * 0.15);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let cx, cy;
      if (x < r && y < r) { cx = r; cy = r; }
      else if (x >= size - r && y < r) { cx = size - 1 - r; cy = r; }
      else if (x < r && y >= size - r) { cx = r; cy = size - 1 - r; }
      else if (x >= size - r && y >= size - r) { cx = size - 1 - r; cy = size - 1 - r; }
      else continue;
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy > r * r) {
        pixels[(y * size + x) * 4 + 3] = 0;
      }
    }
  }

  // Draw ">" in terminal green (#3fb950)
  const fgR = 63, fgG = 185, fgB = 80;
  const ps = Math.floor(size * 0.3);
  const cx = Math.floor(size / 2);
  const cy = Math.floor(size / 2);
  const th = Math.max(Math.floor(size * 0.05), 2);

  for (let i = 0; i <= ps; i++) {
    const t = i / ps;
    const lx = Math.floor(cx - ps / 2 + t * ps);
    const ty = Math.floor(cy - ps / 2 + t * ps / 2);
    const by = Math.floor(cy + ps / 2 - t * ps / 2);

    for (let dy = -th; dy <= th; dy++) {
      for (let dx = -th; dx <= th; dx++) {
        for (const py of [ty, by]) {
          const px = lx + dx, qy = py + dy;
          if (px >= 0 && px < size && qy >= 0 && qy < size) {
            const idx = (qy * size + px) * 4;
            if (pixels[idx + 3] > 0) {
              pixels[idx] = fgR;
              pixels[idx + 1] = fgG;
              pixels[idx + 2] = fgB;
            }
          }
        }
      }
    }
  }

  return createPng(size, pixels);
}

const outDir = join(__dirname, "..", "public", "icons");
mkdirSync(outDir, { recursive: true });

[192, 512].forEach((size) => {
  const png = generateIcon(size);
  const p = join(outDir, `icon-${size}.png`);
  writeFileSync(p, png);
  console.log(`icon-${size}.png: ${png.length} bytes`);
});
