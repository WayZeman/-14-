/**
 * Hero: native-resolution crop (no upscale) + high-quality encode.
 * Usage: node scripts/build-hero-image.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const src = path.join(ROOT, "public/brand/hero.jpg");
const outDir = path.join(ROOT, "public/images/sections");

if (!fs.existsSync(src)) {
  console.error("Missing", src);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

const meta = await sharp(src).metadata();
const w = meta.width ?? 1600;
const h = meta.height ?? 1600;
const cropH = Math.round(w * (9 / 16));
const top = Math.max(0, Math.round((h - cropH) / 2));

const pipeline = sharp(src).extract({
  left: 0,
  top,
  width: w,
  height: Math.min(cropH, h - top),
});

await pipeline
  .clone()
  .jpeg({ quality: 93, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toFile(path.join(outDir, "hero-home.jpg"));

await pipeline
  .clone()
  .webp({ quality: 90, effort: 6, smartSubsample: false })
  .toFile(path.join(outDir, "hero-home.webp"));

const jpg = fs.statSync(path.join(outDir, "hero-home.jpg"));
const webp = fs.statSync(path.join(outDir, "hero-home.webp"));
const outMeta = await sharp(path.join(outDir, "hero-home.jpg")).metadata();
console.log(`hero-home ${outMeta.width}x${outMeta.height} — jpg ${Math.round(jpg.size / 1024)} KB, webp ${Math.round(webp.size / 1024)} KB`);
