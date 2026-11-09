import type { Corpus, HistoricalContext, Source, Subject } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

const communitySource: Source = {
  id: 'bering-kawerak-artists',
  title:
    'Arts of the Bering Strait Region: The Economic, Social and Cultural Role of Traditional Arts and Crafts',
  author:
    'Kawerak, Inc., Community Planning and Development; report developed by McDowell Group; interviews and focus groups conducted by Sandhill.Culture.Craft',
  institution: 'Kawerak, Inc.',
  url: 'https://kawerak.org/wp-content/uploads/2024/07/FINAL_2_kawerak_bering_artA42.pdf',
  type: 'primary',
  accessed: consulted,
  scope:
    'Selected public report text read: cover/title; printed pp. 4 and 8 (institutional introduction and methods); pp. 10–11 (learning, materials and workspaces); p. 19 (acknowledgments and photograph credits). The methods date artist interviews/focus groups to 2019; the report’s publication date is not established. The 2024 upload-path segment is not adopted as its publication date. The 172 survey responses and 14 interview/focus-group participants are a selected research sample, not a census or one universal community voice. Anonymous participant comments remain anonymous; nearby named artwork captions do not identify the speaker. Modern learning and material-sharing accounts do not identify this ancient maker or prove a particular unbroken transmission. Other report pages were exposed by the PDF reader but are not adopted as evidence for current law, income, spiritual practice or ancient chronology. No report photograph, map or design is copied: the acknowledgment of permission for photographs in this report does not grant a new reuse licence.',
};

const renewals: Record<string, string> = {
  'met-717577':
    'Visible description, Artwork Details, Public Domain label and Open Access notice reread. The catalogue retains 300–500 CE, Old Bering Sea III, walrus ivory, Alaska, accession 2019.456.17 and the 2019 Diker gift credit. Counterweight/stabilizer and possible animal features are catalogue interpretations. The complete provenance tab was not freshly exposed; no maker, secure excavated findspot, individual radiocarbon determination or photographic exposure date was established. All three existing view files and the thumbnail were inspected or header-checked and hashed without alteration; no remote-original byte parity claimed. Image rights remain the existing Met CC0 statement; catalogue prose is not assumed CC0.',
  'bering-whaling':
    'NPS introduction, complete published abstract, reference and last-updated notice reread. Abstract-level use only: marine-carbon correction, proposed Old Bering Sea florescence 650–1250, earlier Okvik/allied Ipiutak contexts 300–600, walrus haul-outs and social/technological interpretations. These regional proposals do not supply an individual date for Met 2019.456.17. The journal’s exposed metadata/abstract distinguishes World Archaeology 51(3), issue year 2019, pp. 454–483, DOI 10.1080/00438243.2019.1723681, from online publication 3 March 2020; NPS was updated 14 April 2020. The publisher full-text request returned 403 and was not retried or bypassed. Complete article pages, original assay tables, calibration models and supplements were not read.',
  'birnirk-context':
    'Visible NPS body reread: Piġniq/Birnirk type-site comparisons, house mounds, changing/reused structures and coastal erosion. The page supplies 500–900 CE alongside a loose relative-age summary; only its explicit range is repeated and attributed, not recalculated into a new date. NPS ancestry/relationship language is not generalized to every Iñupiat, Inuit or Yupik community or used to identify this object’s maker. Last updated 16 October 2024 is a web-page date. Linked excavation reports and the underlying illustration’s pixels were not inspected; no new plan/image, route or numeric locator adopted. The site’s access restriction is respected; no visit instruction is supplied.',
};

export const beringKnowledgeContext: HistoricalContext = {
  id: 'bering-catalogue-regional-chronologies',
  title: 'Bering Strait objects and archaeological date ranges',
  region: 'Americas',
  interval: {
    start: 300,
    end: 1250,
    precision: 'disputed',
    label: 'Selected catalogue and regional research ranges, 300–1250 CE',
    note: 'A comparison of differently scoped and overlapping published ranges, not the lifespan of one people or a resolved single regional chronology. The Met object remains catalogued 300–500 CE. The later proposed Old Bering Sea range does not individually redate it. The modern Kawerak interviews occurred in 2019 and are outside this archaeological reference frame.',
  },
  subjectIds: ['bering-sea-carvers'],
  summary:
    'An individual catalogue attribution, a type-site account and a regional radiocarbon argument organize evidence at different scales. Their ranges overlap without establishing one succession of peoples or states.',
  citations: [
    cite('met-717577', 'Artwork Details'),
    cite('birnirk-context', 'Explicit 500–900 CE range and type-site explanation'),
    cite('bering-whaling', 'Published abstract: revised regional chronology'),
  ],
  phases: [
    {
      year: 300,
      label: '300–500: the individual object’s catalogue range',
      title: 'A date attached to a particular carving',
      text: 'The Met assigns accession 2019.456.17 to Old Bering Sea III and dates it 300–500 CE. This is the retained object attribution; it is not a newly inspected radiocarbon measurement or a beginning/end for all carving in the region.',
      citations: [cite('met-717577', 'Artwork Details and accession')],
    },
    {
      year: 500,
      label: '500–900: the NPS Birnirk comparison',
      title: 'A type-site helps archaeologists compare tools',
      text: 'NPS uses this explicit range for Birnirk near present-day Utqiagvik. Its account describes house mounds and comparisons among tools. A type-site supplies an archaeological reference, not this Met object’s recorded findspot or a political boundary.',
      citations: [cite('birnirk-context', 'Visible site body and explicit range')],
    },
    {
      year: 650,
      label: '650–1250: a proposed Old Bering Sea florescence',
      title: 'A regional argument changes the chronological question',
      text: 'Mason and Rasic’s published abstract proposes this later range after marine-carbon corrections to existing regional assays; it also places earlier related contexts at 300–600. The proposal and the catalogue attribution remain separately reported. Neither fixes the date of every surviving carving.',
      citations: [cite('bering-whaling', 'Published abstract, chronology proposal')],
    },
  ],
};

/** Unkeyed for later comparison; the existing three dimension texts stay intact. */
export const beringKnowledgeDimension: Subject['dimensions'][string] = {
  text: 'The catalogue connects this shaped, engraved ivory component with harpoon technology. Kawerak’s modern participants describe learning with relatives and mentors and exchanging materials; those accounts explain practical relationships without identifying this ancient maker or resolving the object’s date.',
  citations: [
    cite('met-717577', 'Description: material, function and engraving'),
    cite('bering-kawerak-artists', 'Printed pp. 8 and 10'),
  ],
};

export function applyKnowledgeBering(c: Corpus): void {
  const subject = c.subjects.find((row) => row.id === 'bering-sea-carvers');
  if (!subject) throw Error('Missing preserved Bering Sea carvers dossier');
  if (!c.sources.some((row) => row.id === communitySource.id))
    c.sources.push(communitySource);
  for (const [id, text] of Object.entries(renewals)) {
    const source = c.sources.find((row) => row.id === id);
    if (!source) throw Error(`Missing prior source ${id}`);
    const marker = 'Selected 29 October 2026 Bering renewal:';
    if (!source.scope.includes(marker))
      source.scope = `Prior consultation (2026-10-27) retained: ${source.scope} ${marker} ${text}`;
    source.accessed = consulted;
  }
  c.contexts ??= [];
  const context = c.contexts.findIndex((row) => row.id === beringKnowledgeContext.id);
  if (context < 0) c.contexts.push(beringKnowledgeContext);
  else c.contexts[context] = beringKnowledgeContext;
  subject.contextIds = [
    ...new Set([...(subject.contextIds ?? []), beringKnowledgeContext.id]),
  ];
  const communityTitle = 'Learning is work between people';
  subject.sections = [
    ...subject.sections.filter((row) => row.title !== communityTitle),
    sec(
      communityTitle,
      'Kawerak’s public report brings a different kind of evidence: artists’ accounts from interviews and focus groups in 2019. Participants describe learning with relatives and mentors, and sharing, giving or buying materials. These accounts make practice and relationships part of the explanation of skilled work. They concern living artists; they do not identify the ancient carver or settle the catalogue date.',
      cite('bering-kawerak-artists', 'Printed pp. 8 and 10'),
    ),
  ];
  subject.deeperReading = [
    sec(
      'Ask what was dated',
      'A catalogue range groups a particular object by the museum’s attribution. A regional chronology compares evidence from multiple contexts. Mason and Rasic’s abstract says that marine-carbon corrections change the regional dating argument; reading that abstract does not reproduce their full tables or calibration work. The proposed later florescence therefore stays visible beside the museum’s 300–500 range. It is not applied as an unreported new measurement of this carving. The gift credit adds a third kind of date: 2019 records a modern museum acquisition, not manufacture or the beginning of the object’s custody history.',
      cite('met-717577', 'Artwork Details: date and credit'),
      cite('bering-whaling', 'Published abstract; full-text access limitation'),
    ),
    sec(
      'A public community account has its own scope',
      'Kawerak commissioned research with artists from different communities, including Iñupiaq, Central Yup’ik and St. Lawrence Island Yupik participants. Its selected accounts describe learning and access to materials. The report is a source for those participants’ experiences, not a census or permission to speak for everyone. It supplies neither a translation of the ancient engravings nor a demonstrated transmission from this individual object to one modern artist. The report’s exact publication date remains unestablished; its 2019 interviews are explicitly dated.',
      cite('bering-kawerak-artists', 'Printed pp. 4, 8 and 10'),
    ),
  ];
  subject.evidenceReading = {
    title: 'Separate a visible detail, a dating proposal and an artist account',
    introduction:
      'The following are editorial paraphrases. Each source answers a different question; none supplies the missing voice of this object’s maker.',
    items: [
      {
        label: 'A shaped and engraved component',
        text: 'The photographs show curved arms and surface lines. The Met identifies walrus ivory and interprets the object as a harpoon counterweight or stabilizer, with possible animal features.',
        interpretation:
          'Description and functional interpretation can support an account of skill without recovering a whole hunt, certain meaning for every form, or a named owner. Display supports visible in the photograph are not ancient tool parts.',
        citations: [cite('met-717577', 'Actual three views and visible description')],
      },
      {
        label: 'Two dates with different subjects',
        text: 'The catalogue dates this carving 300–500 CE. Mason and Rasic propose a regional Old Bering Sea florescence of 650–1250 after marine-carbon corrections.',
        interpretation:
          'The regional proposal should prompt a question about chronology, not an automatic replacement of the individual catalogue date. No new assay for accession 2019.456.17 was established in this consultation.',
        citations: [
          cite('met-717577', 'Artwork Details'),
          cite('bering-whaling', 'Published abstract'),
        ],
      },
      {
        label: 'Learning and materials in a living community account',
        text: 'Kawerak’s report describes participants learning with relatives and mentors and exchanging materials. Its methods place the interviews and focus groups in 2019.',
        interpretation:
          'These are attributed modern experiences, not an ancient biography, a universal community statement or approval to reproduce every design. Anonymous speakers remain anonymous.',
        citations: [cite('bering-kawerak-artists', 'Printed pp. 8 and 10')],
      },
    ],
  };
  subject.familyActivity = {
    title: 'Three evidence cards',
    duration: 'About 8 minutes',
    steps: [
      'Use the full-object and alternate views. Point to a carved curve and a surface line. Keep the pale display rod and metal supports separate from the ivory component.',
      'Read this capsule: the Met catalogues the object to 300–500 CE. A regional research abstract proposes an Old Bering Sea florescence of 650–1250. A Kawerak report describes artists learning with relatives and mentors in interviews and focus groups held in 2019.',
      'Make three cards headed “object catalogue,” “regional dating proposal” and “modern artist account.” Put each date and one supported statement on the correct card. Which card can identify this ancient maker?',
    ],
    explanation:
      'The catalogue card records 300–500 and the identified tool component. The regional card records the proposed 650–1250 range. The artist-account card records the 2019 interviews and learning relationships. None names this carving’s maker. The three sources can inform one investigation while answering different questions.',
  };
  subject.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author checking; not independent historian or community approval',
    scope:
      'A registry KEEP case: the existing four main sections are retained and one bounded community-source section is added, with deeper reading, evidence interpretation, a supplied family capsule and a separately qualified reference. The complete original interval, identity, claims, dimension texts, coordinates, object order, media metadata and image bytes remain protected.',
    limitations: [
      'The object’s maker, secure excavated findspot, exact original use, full early custody and photographic exposure date remain unestablished. Possible animal features and tool function remain catalogue interpretations; no individual radiocarbon redating was established.',
      'Regional chronology is reported at abstract level. The publisher full text returned 403 and was not retried or bypassed; complete tables, calibration models, original assays and supplements were not read. Birnirk’s explicit NPS date range is attributed, not a resolved universal chronology.',
      'The Kawerak report’s publication date is unknown here; its 2019 interview date is known. Selected pages, anonymous participant accounts and a non-census sample do not establish a universal voice, direct lineage from this carving, or permission to reproduce a community design.',
      'No new media, tracing, annotation, historical route, surveyed point or site-access instruction is supplied. Report-photo consent for its own publication is not treated as a new reuse licence. The existing Met image rights and all three view files remain unchanged.',
    ],
  };
}
