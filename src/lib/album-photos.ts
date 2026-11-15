import { readdir, readFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Loader } from 'astro/loaders';
import { parse } from 'yaml';

/**
 * One entry per photo, taken from the `photos:` list in each album's index.md, so a photo can have its own
 * page and its `text` is rendered as Markdown like any post. The id is `<album>/<file name>`,
 * e.g. `2026-kyoto/dsc01234` → /photos/2026-kyoto/dsc01234/.
 */
export function albumPhotos(base: string): Loader {
  return {
    name: 'album-photos',
    async load({ config, store, parseData, renderMarkdown, generateDigest, watcher, logger }) {
      const dir = new URL(base.replace(/\/?$/, '/'), config.root);

      async function sync() {
        store.clear();
        const albums = (await readdir(dir, { withFileTypes: true }).catch(() => [])).filter((d) => d.isDirectory());

        for (const { name: album } of albums) {
          const file = new URL(`${album}/index.md`, dir);
          const source = await readFile(file, 'utf8').catch(() => undefined);
          const front = source?.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
          if (!front) continue;

          const seen = new Set<string>();
          const list: unknown[] = parse(front)?.photos ?? [];
          for (const [index, item] of list.entries()) {
            // `- ./photo.jpg` is short for `- image: ./photo.jpg`.
            const photo = (typeof item === 'string' ? { image: item } : item) as Record<string, unknown>;
            const name = String(photo.image ?? '');
            let slug = basename(name, extname(name)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'photo';
            while (seen.has(slug)) slug += '-2';
            seen.add(slug);

            const id = `${album}/${slug}`;
            const text = typeof photo.text === 'string' && photo.text.trim() ? photo.text : undefined;
            const data = await parseData({ id, data: { ...photo, album, index }, filePath: fileURLToPath(file) });
            store.set({
              id,
              data,
              body: text,
              filePath: fileURLToPath(file).slice(fileURLToPath(config.root).length),
              digest: generateDigest({ ...photo, album, index }),
              rendered: text ? await renderMarkdown(text, { fileURL: file }) : undefined,
            });
          }
        }
      }

      await sync();

      // `astro dev`: pick up edits to any album.
      watcher?.add(fileURLToPath(dir));
      watcher?.on('all', async (_event, path) => {
        if (!path.startsWith(fileURLToPath(dir)) || !path.endsWith('index.md')) return;
        try {
          await sync();
        } catch (err) {
          logger.error(`Failed to reload album photos: ${(err as Error).message}`);
        }
      });
    },
  };
}
