import type { ImageMetadata } from 'astro';
import ecuador from './ecuador.jpg';
import colombia from './colombia.jpg';
import brasil from './brasil.jpg';
import panama from './panama.jpg';
import peru from './peru.jpg';

/** Destination slug (content collection id) → card/banner photo. */
export const DESTINATION_PHOTOS: Record<string, ImageMetadata> = {
  ecuador,
  colombia,
  brasil,
  panama,
  peru,
};

/**
 * Required photo credits (license terms). Unsplash photos need none;
 * Wikimedia Commons CC BY-SA photos must show this line on the page
 * where the photo appears.
 */
export const PHOTO_CREDITS: Record<string, string> = {
  ecuador: 'Foto: Maros Mraz, CC BY-SA 3.0, vía Wikimedia Commons',
};

/** Fail the build loudly if a guide is added without a photo. */
export function photoFor(slug: string): ImageMetadata {
  const photo = DESTINATION_PHOTOS[slug];
  if (!photo) {
    throw new Error(
      `No photo for destination slug "${slug}" — add it to src/assets/photos/index.ts`
    );
  }
  return photo;
}
