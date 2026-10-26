import { politySchema } from '../src/data/schema/index.ts';
import { skeletonPolity, writeSkeleton, type RosterRow } from './roster.ts';

const family = process.argv[2];
if (!family) {
  console.error('usage: tsx scripts/apply-roster.ts <family>');
  process.exit(1);
}

const mod = (await import(`./roster/${family}.ts`)) as { ROWS: RosterRow[] };
const rows = mod.ROWS;
if (rows.some((row) => row.family !== family)) {
  throw new Error(`every ${family} row must use that family`);
}
const polities = rows.map((row) => politySchema.parse(skeletonPolity(row)));
writeSkeleton(rows[0]!.family, polities);
console.log(`apply-roster wrote ${polities.length} ${family} skeleton rows`);
