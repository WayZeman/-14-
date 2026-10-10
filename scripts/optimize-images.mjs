/**
 * Converts source JPG/PNG to optimized WebP in public/images/.
 * Usage: node scripts/optimize-images.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const ASSETS = path.join(ROOT, ".cursor/projects/Users-macbook-Desktop-14orb-website/assets");
const FALLBACK_ASSETS = "/Users/macbook/.cursor/projects/Users-macbook-Desktop-14orb-website/assets";

const srcDir = fs.existsSync(ASSETS) ? ASSETS : FALLBACK_ASSETS;

const jobs = [
  { in: "directions-field.jpg", out: "public/images/sections/directions-field.webp", w: 1920 },
  { in: "technology-uav.jpg", out: "public/images/sections/technology-uav.webp", w: 1200 },
  { in: "team-coordination.jpg", out: "public/images/sections/team-coordination.webp", w: 1200 },
  { in: "recruiting-path.jpg", out: "public/images/sections/recruiting-path.webp", w: 1920 },
  { in: "history-archive.jpg", out: "public/images/sections/history-archive.webp", w: 1200 },
  { in: "background-mist.jpg", out: "public/images/sections/background-mist.webp", w: 1920 },
  { in: "hero-atmosphere.jpg", out: "public/images/sections/hero-atmosphere.webp", w: 1920 },
  { in: "hero-home-hd.jpg", out: "public/images/sections/hero-home.webp", w: 2560, q: 90 },
  { in: "hero-home-hd.jpg", out: "public/images/sections/hero-home.jpg", w: 2560, q: 90, fmt: "jpeg" },
  { in: "technology-uav.jpg", out: "public/images/cards/technology-uav-card.webp", w: 640 },
  { in: "team-coordination.jpg", out: "public/images/cards/team-coordination-card.webp", w: 640 },
];

for (const job of jobs) {
  const input = path.join(srcDir, job.in);
  const output = path.join(ROOT, job.out);
  if (!fs.existsSync(input)) {
    console.warn("Skip (missing):", input);
    continue;
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  await sharp(input)
    .rotate()
    .resize({ width: job.w, withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(output);
  const stat = fs.statSync(output);
  console.log(`${job.out} (${Math.round(stat.size / 1024)} KB)`);
}

// Official hero — lighter copy for OG if huge
const heroIn = path.join(ROOT, "public/brand/hero.jpg");
if (fs.existsSync(heroIn)) {
  const heroOut = path.join(ROOT, "public/images/sections/hero-official.webp");
  await sharp(heroIn)
    .rotate()
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(heroOut);
  console.log(`public/images/sections/hero-official.webp`);
}

console.log("Done.");
