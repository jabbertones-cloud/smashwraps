/**
 * Dev-only: writes neutral PNG placeholders into public/images/.
 * Do NOT run in a repo that already has real brand PNGs — back up first.
 */
const sharp = require("sharp");
const path = require("path");

const outDir = path.join(__dirname, "../public/images");

const FILES = [
  "AllCaseBoxesChops.jpg",
  "1gCasePassionFruitChops.jpg",
  "1gCasePineappleChops.jpg",
  "1gCaseVanillaChops.jpg",
  "1gIcedWatermelonChopsCase.jpg",
  "2gCasePassionFruitChops.jpg",
  "2gCasePineappleChops.jpg",
  "2gCaseVanillaChops.jpg",
  "2gIcedWatermelonChopsCase.jpg",
  "IcedWatermelonChops.png",
  "PassionFruitChops.png",
  "PineappleChops.png",
  "VanillaChops.png",
];

async function main() {
  for (const name of FILES) {
    const outPath = path.join(outDir, name);
    // Visible on dark UI (#050505): old r:18 was nearly invisible — reads as “broken”
    await sharp({
      create: {
        width: 900,
        height: 900,
        channels: 3,
        background: { r: 58, g: 58, b: 66 },
      },
    })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    process.stdout.write(`wrote ${name}\n`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
