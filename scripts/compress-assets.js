const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

// ── 1. Hero images: PNG → WebP ───────────────────────────────────────────────
const heroPngs = [
  { src: "public/herosection/hero1.png",       dest: "public/herosection/hero1.webp",       q: 85 },
  { src: "public/herosection/hero_avatar.png", dest: "public/herosection/hero_avatar.webp", q: 85 },
];

async function convertHeroImages() {
  for (const { src, dest, q } of heroPngs) {
    const srcPath  = path.join(projectRoot, src);
    const destPath = path.join(projectRoot, dest);
    const before   = fs.statSync(srcPath).size;
    await sharp(srcPath).webp({ quality: q }).toFile(destPath);
    const after    = fs.statSync(destPath).size;
    console.log(`✅  ${src}  →  ${dest}  [${(before/1024).toFixed(0)} KB → ${(after/1024).toFixed(0)} KB]`);
  }
}

// ── 2. Sequence frames: re-compress JPEG in-place ────────────────────────────
const frameDir = path.join(projectRoot, "public/frame");

async function compressFrames() {
  const files = fs.readdirSync(frameDir).filter(f => f.endsWith(".jpg")).sort();
  let totalBefore = 0, totalAfter = 0;

  for (const file of files) {
    const filePath = path.join(frameDir, file);
    const tmpPath  = filePath + ".tmp";
    const before   = fs.statSync(filePath).size;
    totalBefore += before;

    await sharp(filePath)
      .jpeg({ quality: 72, progressive: true, mozjpeg: true })
      .toFile(tmpPath);

    const after = fs.statSync(tmpPath).size;
    totalAfter += after;

    // Only replace if actually smaller
    if (after < before) {
      fs.renameSync(tmpPath, filePath);
    } else {
      fs.unlinkSync(tmpPath);
    }
  }

  console.log(`\n✅  ${files.length} frames: ${(totalBefore/1024/1024).toFixed(2)} MB → ${(totalAfter/1024/1024).toFixed(2)} MB  (saved ${((1-totalAfter/totalBefore)*100).toFixed(1)}%)`);
}

(async () => {
  console.log("🔧  Compressing assets...\n");
  await convertHeroImages();
  await compressFrames();
  console.log("\n🎉  Done!");
})();
