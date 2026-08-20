/**
 * Generates the PWA / home-screen icons from a single vector definition.
 *
 * Run with `node scripts/generate-icons.js` after changing the mark.
 * Output is committed, so this is not part of the build.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const BG = "#18181b";
const FG = "#fafafa";

/**
 * Dumbbell mark, drawn as five bars sharing one horizontal axis.
 *
 * `span` is the mark's total width as a fraction of the canvas. Maskable icons
 * pass a smaller span because a launcher may crop the outer 20% to fit its
 * own mask shape.
 */
function markSvg(size, { rounded = false, span = 0.72 } = {}) {
  const c = size / 2;
  const w = span * size;

  // Widths as fractions of the mark; they sum to 1.
  const parts = [
    { width: 0.115, height: 0.22 }, // outer cap
    { width: 0.155, height: 0.34 }, // inner plate
    { width: 0.46, height: 0.085 }, // bar
    { width: 0.155, height: 0.34 },
    { width: 0.115, height: 0.22 },
  ];

  const radius = 0.03 * w;
  let x = c - w / 2;

  const bars = parts
    .map(({ width, height }) => {
      const bw = width * w;
      const bh = height * w;
      const rect = `<rect x="${(x).toFixed(2)}" y="${(c - bh / 2).toFixed(2)}" width="${bw.toFixed(2)}" height="${bh.toFixed(2)}" rx="${radius.toFixed(2)}" fill="${FG}"/>`;
      x += bw;
      return rect;
    })
    .join("");

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      `<rect width="${size}" height="${size}"${rounded ? ` rx="${size * 0.22}"` : ""} fill="${BG}"/>` +
      bars +
      `</svg>`
  );
}

const targets = [
  { file: "src/app/icon.png", size: 512 },
  // iOS applies its own rounding but does not composite a background, so the
  // Apple icon needs its corners baked in.
  { file: "src/app/apple-icon.png", size: 180, opts: { rounded: true } },
  { file: "public/icon-192.png", size: 192 },
  { file: "public/icon-512.png", size: 512 },
  { file: "public/icon-maskable.png", size: 512, opts: { span: 0.5 } },
];

(async () => {
  for (const { file, size, opts } of targets) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    await sharp(markSvg(size, opts)).png().toFile(file);
    console.log("wrote", file, `${size}x${size}`);
  }
})();
