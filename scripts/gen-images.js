const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

(async () => {
  try {
    const imgDir = path.resolve(__dirname, '..', 'images');
    const avifSrc = path.join(imgDir, 'mainimage.avif');
    const webpSrc = path.join(imgDir, 'mainimage.webp');

    const targets = [
      { width: 768, suffix: '-768' },
      { width: 1280, suffix: '-1280' }
    ];

    if (fs.existsSync(avifSrc)) {
      for (const t of targets) {
        const out = path.join(imgDir, `mainimage${t.suffix}.avif`);
        await sharp(avifSrc)
          .resize({ width: t.width, withoutEnlargement: true })
          .avif({ quality: 50 })
          .toFile(out);
        console.log('Wrote', out);
      }
    } else {
      console.warn('AVIF source not found:', avifSrc);
    }

    // Generate WEBP variants either from original WEBP or convert from AVIF if WEBP missing
    if (fs.existsSync(webpSrc)) {
      for (const t of targets) {
        const out = path.join(imgDir, `mainimage${t.suffix}.webp`);
        await sharp(webpSrc)
          .resize({ width: t.width, withoutEnlargement: true })
          .webp({ quality: 60 })
          .toFile(out);
        console.log('Wrote', out);
      }
    } else if (fs.existsSync(avifSrc)) {
      for (const t of targets) {
        const out = path.join(imgDir, `mainimage${t.suffix}.webp`);
        await sharp(avifSrc)
          .resize({ width: t.width, withoutEnlargement: true })
          .webp({ quality: 60 })
          .toFile(out);
        console.log('Wrote', out);
      }
    } else {
      console.warn('WEBP/AVIF sources missing; cannot create WEBP variants');
    }

    console.log('Done.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();