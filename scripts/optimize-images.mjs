/**
 * One-off asset pass: cap source screenshots at 1600px and re-encode to
 * WebP, then rewrite the paths in the content file.
 *
 * Source weight doesn't reach visitors (next/image re-encodes on the
 * way out), but 9MB of PNGs in the repo slows every clone, build and
 * deploy. Run again after dropping new screenshots in.
 */
import { readdir, readFile, stat, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIR = "public/images";
const MAX_WIDTH = 1600;
/** Portraits and logos keep their original format and size. */
const KEEP = new Set(["rivael.png", "rivaell.jpg"]);

const dataPath = "src/data/portfolio.json";
let data = await readFile(dataPath, "utf8");

for (const file of await readdir(DIR)) {
  if (KEEP.has(file)) continue;
  const from = path.join(DIR, file);
  const before = (await stat(from)).size;
  const image = sharp(from);
  const { width = 0, height = 0 } = await image.metadata();

  // Logos are small already; re-encoding them buys nothing.
  if (before < 60_000) continue;

  const target = Math.min(width, MAX_WIDTH);
  const to = path.join(DIR, `${path.parse(file).name}.webp`);

  await image.resize({ width: target }).webp({ quality: 84 }).toFile(to);

  const after = (await stat(to)).size;
  const newHeight = Math.round((height * target) / width);

  data = data
    .replaceAll(`/images/${file}`, `/images/${path.parse(file).name}.webp`)
    .replaceAll(`"width": ${width}`, `"width": ${target}`)
    .replaceAll(`"height": ${height}`, `"height": ${newHeight}`);

  await unlink(from);
  console.log(
    `${file.padEnd(22)} ${width}px ${(before / 1024 / 1024).toFixed(2)}MB` +
      ` → ${target}px ${(after / 1024).toFixed(0)}KB`,
  );
}

await writeFile(dataPath, data);
console.log("content paths rewritten");
