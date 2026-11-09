/* global process, fetch, console */
import fs from 'node:fs/promises';
const ids = process.argv.slice(2);
for (const id of ids) {
  try {
    const r = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
    );
    if (!r.ok) throw Error(`${r.status}`);
    const obj = await r.json();
    await fs.writeFile(
      `output/redesign/research/met-${id}.json`,
      JSON.stringify(obj, null, 2),
    );
    console.log(
      JSON.stringify({
        id,
        title: obj.title,
        date: obj.objectDate,
        begin: obj.objectBeginDate,
        end: obj.objectEndDate,
        image: obj.primaryImage,
        public: obj.isPublicDomain,
        culture: obj.culture,
        url: obj.objectURL,
        number: obj.accessionNumber,
        medium: obj.medium,
      }),
    );
  } catch (e) {
    console.log(id, String(e));
  }
}
