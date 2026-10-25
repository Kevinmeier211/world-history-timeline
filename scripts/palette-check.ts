import { readFileSync } from 'node:fs';

import { familySchema } from '../src/data/schema/polity.ts';
import {
  paletteIssues,
  paletteMatrix,
  type PaletteFamily,
  type PaletteTheme,
} from '../src/palette/check.ts';

const THEMES: PaletteTheme[] = [
  { name: 'light', ink: '#2A241C', paper: '#F1E8D2' },
  { name: 'dark', ink: '#E9E3D3', paper: '#14161B' },
];

const parsed = familySchema
  .array()
  .safeParse(JSON.parse(readFileSync('src/data/families.json', 'utf8')));
if (!parsed.success) {
  console.error(parsed.error.issues.map((issue) => issue.message).join('\n'));
  process.exit(1);
}

const families: PaletteFamily[] = parsed.data.map((family) => ({
  id: family.id,
  color: family.color,
  xZones: family.xZones,
}));

for (const line of paletteMatrix(families)) console.log(line);

const issues = paletteIssues(families, THEMES);
if (issues.length === 0) {
  console.log(`palette:check ok (${families.length} families)`);
  process.exit(0);
}

for (const issue of issues) console.error(issue.message);
console.error(`palette:check failed (${issues.length})`);
process.exit(1);
