/**
 * One-time / maintenance: writes valid PNG placeholders into public/images/
 * so the site never 404s before real photography is copied in (replace files, same names).
 */
const sharp = require("sharp");
const path = require("path");

const outDir = path.join(__dirname, "../public/images");

const FILES = [
  "AllCaseBoxesChops.png",
  "1gCasePassionFruitChops.png",
  "1gCasePineappleChops.png",
  "1gCaseVanillaChops.png",
  "1gIcedWatermelonChopsCase.png",
  "2gCasePassionFruitChops.png",
  "2gCasePineappleChops.png",
  "2gCaseVanillaChops.png",
  "2gIcedWatermelonChopsCase.png",
  "IcedWatermelonChops.png",
  "PassionFruitChops.png",
  "PineappleChops.png",
  "VanillaChops.png",
];

async function main() {
  for (const name of FILES) {
    const outPath = path.join(outDir, name);
    await sharp({
      create: {
        width: 900,
        height: 900,
        channels: 3,
        background: { r: 18, g: 18, b: 22 },
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
