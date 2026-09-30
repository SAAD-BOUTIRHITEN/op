/**
 * Après `next build` en mode STATIC_EXPORT : fabrique les variantes WebP
 * redimensionnées lues par lib/images/static-loader.ts.
 *
 *   out/images/frames/x.jpg  ->  out/_img/{384,640,828,1200,1600}/images/frames/x.webp
 *
 * Une variante n'est jamais agrandie au-delà de la photo d'origine.
 */
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTHS = [384, 640, 828, 1200, 1600]; // = VARIANT_WIDTHS du chargeur
const OUT = path.resolve("out");
const SRC_DIR = path.join(OUT, "images");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) files.push(full);
  }
  return files;
}

const files = await walk(SRC_DIR);
let count = 0;
for (const file of files) {
  const rel = path.relative(OUT, file).replace(/\.[a-z0-9]+$/i, "");
  const meta = await sharp(file).metadata();
  for (const w of WIDTHS) {
    const dest = path.join(OUT, "_img", String(w), `${rel}.webp`);
    await mkdir(path.dirname(dest), { recursive: true });
    await sharp(file)
      .resize({ width: Math.min(w, meta.width ?? w), withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(dest);
    count += 1;
  }
}
console.log(`optimize-images : ${files.length} photos -> ${count} variantes`);
