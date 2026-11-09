import fs from 'node:fs/promises';
import process from 'node:process';
import path from 'node:path';
import {
  brotliCompressSync,
  brotliDecompressSync,
  constants,
  gzipSync,
  gunzipSync,
} from 'node:zlib';

let count = 0;
async function compress(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await compress(file);
    else if (entry.isFile() && /\.(js|css|json|html|svg)$/.test(file)) {
      const original = await fs.readFile(file);
      const gzip = gzipSync(original, { level: 9 });
      const brotli = brotliCompressSync(original, {
        params: { [constants.BROTLI_PARAM_QUALITY]: 5 },
      });
      if (
        !gunzipSync(gzip).equals(original) ||
        !brotliDecompressSync(brotli).equals(original)
      )
        throw new Error('Compression changed bytes: ' + file);
      await fs.writeFile(file + '.gz', gzip);
      await fs.writeFile(file + '.br', brotli);
      count++;
    }
  }
}
await compress(process.argv[2] ?? 'dist');
process.stdout.write(`Verified gzip/Brotli round trips for ${count} static assets.\n`);
