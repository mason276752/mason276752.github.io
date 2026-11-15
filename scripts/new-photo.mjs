// npm run photo <相簿> <圖片...>
// Adds the images to the album at src/content/albums/<相簿>/, creating it if needed: each image is shrunk to MAX px
// on the long edge with its metadata (GPS included) stripped, so the public repo stays small, and appended to the
// `photos:` list in the album's index.md.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, extname, join } from 'node:path';
import sharp from 'sharp';
import { isSeq, parseDocument } from 'yaml';

const MAX = 2560;
const [album, ...files] = process.argv.slice(2);

if (!album || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(album) || files.length === 0) {
  console.error('用法：npm run photo <相簿> <圖片...>');
  console.error('  相簿是網址和資料夾名稱，用英文小寫、數字和 -；還沒有的話會新建。例如：');
  console.error('  npm run photo 2026-kyoto ~/Pictures/DSC0*.JPG');
  console.error('  JPG、PNG、WebP、AVIF、HEIC／HEIF 都可以。');
  process.exit(1);
}

// sv-SE formats dates as YYYY-MM-DD.
const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Taipei' }).format(new Date());

// EXIF keeps dates as `YYYY:MM:DD hh:mm:ss`. The earliest is when it was taken; later ones are edits.
function takenOn(exif) {
  const dates = exif?.toString('latin1').match(/\d{4}:\d\d:\d\d \d\d:\d\d:\d\d/g) ?? [];
  const first = dates.filter((d) => !d.startsWith('0000')).sort()[0];
  return first?.slice(0, 10).replaceAll(':', '-');
}

const size = (bytes) => (bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);
const dir = `src/content/albums/${album}`;
const index = `${dir}/index.md`;
const tmp = mkdtempSync(join(tmpdir(), 'new-photo-'));
const added = [];
let failed = 0;

mkdirSync(dir, { recursive: true });

for (const file of files) {
  try {
    let input = file;
    const meta = await sharp(input).metadata();

    // sharp can't decode HEVC, which is what iPhones and Sony cameras put in .HEIC/.HEIF. macOS can.
    if (meta.format === 'heif' && meta.compression === 'hevc') {
      if (process.platform !== 'darwin') throw new Error('這台電腦不能轉 HEIC，請先用 Paste → JPG 轉成 JPG，或從 /admin/ 上傳');
      input = join(tmp, `${basename(file)}.jpg`);
      execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '100', file, '--out', input], { stdio: 'ignore' });
    }

    const name = basename(file, extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'photo';
    const out = `${dir}/${name}.jpg`;
    if (existsSync(out)) throw new Error(`相簿裡已經有 ${name}.jpg 了`);

    const result = await sharp(input)
      .rotate() // apply the EXIF orientation before it's stripped
      .flatten({ background: '#ffffff' }) // JPEG has no transparency
      .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(out);

    const taken = takenOn(meta.exif);
    added.push(taken ? { image: `./${name}.jpg`, date: taken } : { image: `./${name}.jpg` });
    console.log(`${name}.jpg：${result.width}×${result.height}，${size(statSync(file).size)} → ${size(result.size)}，${taken ? `拍攝日期 ${taken}` : '讀不到拍攝日期'}`);
  } catch (err) {
    failed++;
    console.error(`${file}：${err.message}`);
  }
}

rmSync(tmp, { recursive: true, force: true });
// Nothing made it in: don't leave a new, empty album behind.
if (readdirSync(dir).length === 0) rmSync(dir, { recursive: true });

if (added.length > 0 && existsSync(index)) {
  // Append to the album's list, leaving the rest of the file (comments, the article) as it was.
  const [, front, body] = readFileSync(index, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/) ?? [];
  if (front === undefined) {
    console.error(`${index} 開頭沒有用 --- 包住的欄位，請手動把照片加到 photos:`);
    process.exit(1);
  }
  const doc = parseDocument(front);
  const photos = doc.get('photos');
  if (isSeq(photos)) added.forEach((p) => photos.add(doc.createNode(p)));
  else doc.set('photos', doc.createNode(added));
  writeFileSync(index, `---\n${doc.toString()}---\n${body}`);
  console.log(`已加到 ${index}（${added.length} 張）`);
} else if (added.length > 0) {
  const date = added.map((p) => p.date).filter(Boolean).sort()[0] ?? today;
  const photos = added.map((p) => `  - image: ${p.image}${p.date ? `\n    date: ${p.date}` : ''}`).join('\n');
  writeFileSync(
    index,
    `---
title: ${album}
date: ${date}
place:
description:
draft: false
photos:
${photos}
---

`,
  );
  console.log(`已建立相簿 ${index}（${added.length} 張）`);
}

if (added.length > 0) {
  console.log('打開 index.md 改相簿名稱、在 --- 下面寫相簿的文章；每張照片也可以加 title、place、gear 和 text（說明）。');
  console.log('npm run dev 看 http://localhost:4321/photos/');
}
if (failed) process.exit(1);
