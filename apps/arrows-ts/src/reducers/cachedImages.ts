import { ImageInfo } from '@neo4j-arrows/graphics';
import { Action } from 'redux';

interface ImageEventAction extends Action<'IMAGE_EVENT'> {
  imageUrl: string;
  cachedImage: ImageInfo;
}

export default function cachedImages(
  state = {},
  action: ImageEventAction
): Record<string, ImageInfo> {
  if (action.type === 'IMAGE_EVENT') {
    return {
      ...state,
      [action.imageUrl]: action.cachedImage,
    };
  }

  return state;
}
