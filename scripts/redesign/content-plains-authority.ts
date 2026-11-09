import type { Corpus } from '../../src/atlas/model';
import { applyPlainsBlackfoot } from './plains-blackfoot';
import { applyPlainsHidatsa } from './plains-hidatsa';
import { applyPlainsKwakwakawakw } from './plains-kwakwakawakw';

/** Adopt the reviewed 29 October community-authority drafts. No new image, route or comparison. */
export function applyPlainsAuthority(c: Corpus): void {
  applyPlainsBlackfoot(c);
  applyPlainsHidatsa(c);
  applyPlainsKwakwakawakw(c);
}
