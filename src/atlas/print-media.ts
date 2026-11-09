import images from './print-media-index.json';
import { asset } from './data';
export function printMedia(source: string) {
  return asset((images as Record<string, string>)[source] ?? source);
}
