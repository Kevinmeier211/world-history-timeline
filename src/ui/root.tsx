import { readPrintRequest } from '../print/sheet.ts';
import { PrintPoster } from './PrintPoster.tsx';
import { PosterApp } from './PosterApp.tsx';

/** `?print=1` is the static sheet. Any other address is the interactive poster. */
export function AtlasRoot({ search }: { search: string }) {
  const print = readPrintRequest(search);
  if (print) return <PrintPoster request={print} />;
  return <PosterApp />;
}
