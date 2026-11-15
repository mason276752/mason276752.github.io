import { getImage } from 'astro:assets';
import { getCollection, type CollectionEntry } from 'astro:content';
import { excerpt } from './blog';

export type Album = CollectionEntry<'albums'>;
export type Photo = CollectionEntry<'photos'>;

/** Published albums, newest first. Drafts are included only in `astro dev`. */
export async function getAlbums(): Promise<Album[]> {
  const albums = await getCollection('albums', (a) => import.meta.env.DEV || !a.data.draft);
  return albums.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

/** Each album's photos, in the order they're listed. */
export async function getPhotosByAlbum(): Promise<Map<string, Photo[]>> {
  const byAlbum = new Map<string, Photo[]>();
  for (const photo of await getCollection('photos')) {
    byAlbum.set(photo.data.album, [...(byAlbum.get(photo.data.album) ?? []), photo]);
  }
  for (const photos of byAlbum.values()) photos.sort((a, b) => a.data.index - b.data.index);
  return byAlbum;
}

export const albumUrl = (album: Album) => `/photos/${album.id}/`;

export const photoUrl = (photo: Photo) => `/photos/${photo.id}/`;

/** `description`, or the start of the album's article. */
export const albumSummary = (album: Album, length = 80) => album.data.description ?? excerpt(album.body, length);

/** Alt text and fallback heading: the photo's title, or which one it is in the album. */
export const photoName = (photo: Photo, album: Album) =>
  photo.data.title ?? `${album.data.title}・第 ${photo.data.index + 1} 張`;

/** The photo at full-screen sizes, for the lightbox and the photo's page. */
export function largeImage(photo: Photo) {
  const { image } = photo.data;
  return getImage({ src: image, width: Math.min(image.width, 2560), widths: [1280, 1920, 2560], format: 'webp' });
}
