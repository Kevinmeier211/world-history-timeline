import fs from 'node:fs';
import { validateCorpus } from '../../src/atlas/validate';
import type { Corpus } from '../../src/atlas/model';
const c = JSON.parse(fs.readFileSync('public/atlas/corpus.json', 'utf8')) as Corpus;
const issues = validateCorpus(c, process.argv.includes('--complete'));
for (const m of c.media)
  for (const image of [m.image, m.thumbnail, ...(m.additionalImages ?? [])])
    if (!fs.existsSync(`public${image}`))
      issues.push(`${m.id}: missing local derivative ${image}`);
if (issues.length) {
  console.error(issues.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Local content contract passes: ${c.packs.length} packs, ${c.subjects.length} substantive dossiers, ${c.media.length} media records. ${process.argv.includes('--complete') ? 'Structural coverage contract checked; historical completeness and public release approval remain separate.' : 'Partial stage scope only; full coverage acceptance remains separate.'}`,
  );
