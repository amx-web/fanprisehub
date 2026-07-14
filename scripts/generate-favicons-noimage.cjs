/*
  Pure-JS fallback favicon generator.
  - Does NOT attempt to re-encode the source JPG (tooling/image libs may be unavailable).
  - Generates valid placeholder assets so browser favicons are not broken.

  Generated files in public/:
    - favicon.ico (16/32/48)
    - apple-touch-icon.png (180x180)
    - logo192.png (192x192)
    - logo512.png (512x512)

  Note: These placeholders ensure the UI works even if resizing libraries fail.
*/

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public');

function ensureDir() {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
}

// Prebuilt 1x1 PNG (transparent) then expanded by nearest-neighbor is not possible without image libs.
// Instead, we embed simple PNGs at required sizes as data URIs is too large.
// Therefore, create a minimal valid PNG using IHDR/IDAT with a solid color.
// We'll generate grayscale solid PNGs using zlib (built-in).

const zlib = require('zlib');

function crc32(buf) {
    // Simple CRC32 implementation.
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
        c ^= buf[i];
        for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & (-(c & 1)));
    }
    return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const t = Buffer.from(type);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
    return Buffer.concat([len, t, data, crc]);
}

function makeSolidPng(width, height, rgba) {
    const { r, g, b, a } = rgba;

    // Raw scanlines: filter byte 0 + RGBA per pixel.
    const rowBytes = 1 + width * 4;
    const raw = Buffer.alloc(rowBytes * height);

    for (let y = 0; y < height; y++) {
        const rowStart = y * rowBytes;
        raw[rowStart] = 0; // filter type 0
        for (let x = 0; x < width; x++) {
            const i = rowStart + 1 + x * 4;
            raw[i] = r;
            raw[i + 1] = g;
            raw[i + 2] = b;
            raw[i + 3] = a;
        }
    }

    const compressed = zlib.deflateSync(raw);

    // PNG signature
    const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // color type RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace

    const parts = [
        signature,
        pngChunk('IHDR', ihdr),
        pngChunk('IDAT', compressed),
        pngChunk('IEND', Buffer.alloc(0)),
    ];

    return Buffer.concat(parts);
}

function write(fileName, buf) {
    fs.writeFileSync(path.join(outDir, fileName), buf);
}

function makeIcoFromPngSizes(pngBySize) {
    const sizes = Object.keys(pngBySize).map((n) => Number(n)).sort((a, b) => a - b);
    const reserved = 0;
    const type = 1;
    const count = sizes.length;
    const header = Buffer.alloc(6);
    header.writeUInt16LE(reserved, 0);
    header.writeUInt16LE(type, 2);
    header.writeUInt16LE(count, 4);

    const entrySize = 16;
    const headerSize = header.length + count * entrySize;

    let offset = headerSize;
    const entries = [];
    const payloads = [];

    for (const s of sizes) {
        const png = pngBySize[s];
        const dim = s === 256 ? 0 : s;

        const entry = Buffer.alloc(16);
        entry.writeUInt8(dim, 0);
        entry.writeUInt8(dim, 1);
        entry.writeUInt8(0, 2);
        entry.writeUInt8(0, 3);
        entry.writeUInt16LE(1, 4);
        entry.writeUInt16LE(32, 6);
        entry.writeUInt32LE(png.length, 8);
        entry.writeUInt32LE(offset, 12);

        entries.push(entry);
        payloads.push(png);
        offset += png.length;
    }

    return Buffer.concat([header, ...entries, ...payloads]);
}

function main() {
    ensureDir();

    // Use a simple brand-like color.
    const brand = { r: 18, g: 18, b: 18, a: 255 };

    const apple = makeSolidPng(180, 180, brand);
    const logo192 = makeSolidPng(192, 192, brand);
    const logo512 = makeSolidPng(512, 512, brand);

    write('apple-touch-icon.png', apple);
    write('logo192.png', logo192);
    write('logo512.png', logo512);

    // favicon.ico multi-size embedded PNG.
    const icoPngBySize = {
        16: makeSolidPng(16, 16, brand),
        32: makeSolidPng(32, 32, brand),
        48: makeSolidPng(48, 48, brand),
    };
    const ico = makeIcoFromPngSizes(icoPngBySize);
    write('favicon.ico', ico);

    console.log('Generated fallback favicon assets (no external image libs).');
}

main();

