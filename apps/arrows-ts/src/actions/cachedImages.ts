import { ImageInfo } from '@neo4j-arrows/graphics';

export const imageEvent = (imageUrl: string, cachedImage: ImageInfo) => ({
  type: 'IMAGE_EVENT',
  imageUrl,
  cachedImage,
});
