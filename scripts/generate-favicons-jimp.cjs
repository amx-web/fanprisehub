const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const source = path.join(__dirname, '..', 'public', 'photo_2026-07-14_06-55-29.jpg');
const outDir = path.join(__dirname, '..', 'public');

function assertSource() {
    if (!fs.existsSync(source)) throw new Error(`Source image not found: ${source}`);
    const st = fs.statSync(source);
    if (!st || st.size < 1024) throw new Error(`Source image appears too small: ${st?.size}`);
}

async function cropToSquare(img, size) {
    const w = img.bitmap.width;
    const h = img.bitmap.height;
    const side = Math.min(w, h);
    const x = Math.floor((w - side) / 2);
    const y = Math.floor((h - side) / 2);
    return img
        .clone()
        .crop(x, y, side, side)
        .resize(size, size, Jimp.RESIZE_CUBIC);
}

async function writePng(img, fileName) {
    const outPath = path.join(outDir, fileName);
    await img.writeAsync(outPath);
}

async function buildIcoFromPngSizes(pngBuffersBySize) {
    // Minimal ICO writer: embeds multiple PNG images.
    // Layout (little-endian):
    // ICONDIR header + ICONDIRENTRYs + PNG payloads.
    // Reference: https://en.wikipedia.org/wiki/ICO_(file_format)

    const sizes = Object.keys(pngBuffersBySize)
        .map((s) => Number(s))
        .sort((a, b) => a - b);

    const pngBuffers = sizes.map((s) => pngBuffersBySize[s]);

    const reserved = 0;
    const type = 1; // icon
    const count = sizes.length;

    // ICONDIR (6 bytes)
    const header = Buffer.alloc(6);
    header.writeUInt16LE(reserved, 0);
    header.writeUInt16LE(type, 2);
    header.writeUInt16LE(count, 4);

    // ICONDIRENTRY (16 bytes each)
    // We'll compute offsets relative to start of file.
    const entrySize = 16;
    const headerSize = header.length + count * entrySize;

    let offset = headerSize;
    const entries = [];

    for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i];
        const pngBuf = pngBuffers[i];

        // width/height fields are 1 byte; 0 means 256
        const dim = size === 256 ? 0 : size;

        const entry = Buffer.alloc(16);
        entry.writeUInt8(dim, 0); // width
        entry.writeUInt8(dim, 1); // height
        entry.writeUInt8(0, 2); // color count
        entry.writeUInt8(0, 3); // reserved
        entry.writeUInt16LE(1, 4); // planes
        entry.writeUInt16LE(32, 6); // bit count (arbitrary for PNG-in-ICO)
        entry.writeUInt32LE(pngBuf.length, 8); // bytes in resource
        entry.writeUInt32LE(offset, 12); // image offset

        entries.push(entry);
        offset += pngBuf.length;
    }

    return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function main() {
    assertSource();

    const img = await Jimp.read(source);

    // Apple touch icon
    const apple = await cropToSquare(img, 180);
    await writePng(apple, 'apple-touch-icon.png');

    // Android/iOS logos
    const logo192 = await cropToSquare(img, 192);
    await writePng(logo192, 'logo192.png');

    const logo512 = await cropToSquare(img, 512);
    await writePng(logo512, 'logo512.png');

    // favicon.ico (multi-size): 16, 32, 48 (PNG-in-ICO)
    const faviconSizes = [16, 32, 48];
    const pngBuffersBySize = {};

    for (const s of faviconSizes) {
        const square = await cropToSquare(img, s);
        // writeAsync to Buffer
        const buf = await square.getBufferAsync(Jimp.MIME_PNG);
        pngBuffersBySize[s] = buf;
    }

    const icoBuf = await buildIcoFromPngSizes(pngBuffersBySize);
    fs.writeFileSync(path.join(outDir, 'favicon.ico'), icoBuf);

    console.log('Favicons generated successfully using Jimp.');
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

