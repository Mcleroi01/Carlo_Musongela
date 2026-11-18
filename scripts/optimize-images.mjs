// Convert the raw photos in photos-originals/ (kept out of git and the build) into web-ready WebP files in public/images.
import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const src = "photos-originals";
const out = "public/images";
await mkdir(out, { recursive: true });

for (const file of await readdir(src)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;
  const base = path.parse(file).name.toLowerCase();
  for (const width of [800, 1600]) {
    const target = path.join(out, `${base}-${width}.webp`);
    const info = await sharp(path.join(src, file))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(target);
    console.log(target, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)} KB`);
  }
}
