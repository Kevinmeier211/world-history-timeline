/** Bounded lacquer-object inquiry and a separately sourced political reference. */
import type { Corpus, HistoricalContext, Source } from '../../src/atlas/model';
import { cite, sec } from './content-helpers';

const consulted = '2026-10-29';

export const zandCitiesSources: Source[] = [
  {
    id: 'iran-lacquer-supports',
    title: 'Ephemerality: Persian lacquer bookbindings',
    author: 'Matthew Elliott Gillman',
    institution: 'Columbia University Libraries, In the School of Wisdom',
    url: 'https://exhibitions.library.columbia.edu/exhibits/show/school_of_wisdom/ephemerality',
    type: 'scholarship',
    published: 'September 2020',
    accessed: consulted,
    scope:
      'Complete short Ephemerality page text and the separate exhibition colophon actually read. The colophon names Matthew Elliott Gillman and dates the online exhibition September 2020; the physical exhibition was 22 October 2018–1 March 2019. The page explains thin varnish layers, usually pasteboard supports and limited protection through a later bookbinding example, MS Or 76, dated 1848. These general material observations are not an analysis of the selected 1789 Met case. No source-image pixels, linked rights policy, original manuscript or technical examination read; no image copied or reused. The later Imami-school attribution, Isfahan place, named maker and proposed origin of the technique are not transferred to this case.',
  },
];

export const zandPoliticalContext: HistoricalContext = {
  id: 'zand-political-context',
  title: 'Shiraz and changing rule: a selected Zand political sequence',
  region: 'West/Central Asia',
  interval: {
    start: 1747,
    end: 1794,
    label: 'Selected political orientation, 1747–1794 CE',
    precision: 'range',
    note: 'Selected milestones from Perry’s account, beginning with Nader Shah’s assassination and ending with the last Zand ruler’s defeat. This reference does not replace the complete 1751–1794 case or date all Iranian life, lacquer production or the selected object’s use. Authority changed and had territorial limits; the frame is not a uniform national border.',
  },
  summary:
    'Karim Khan made Shiraz a residence and building center within a contested political landscape. His death preceded the selected lacquer case by ten years. The later succession provides orientation without assigning the case to a ruler, purchaser or workshop city.',
  citations: [
    cite('zand-history', 'Opening chronology; Karim Khan; succession to 1794'),
    cite('zand-karim', 'The Wakil at Shiraz, 1765–79'),
  ],
  subjectIds: ['zand-iran'],
  phases: [
    {
      year: 1747,
      label: '1747: a political rupture',
      title: 'Nader Shah’s death precedes the Zand convention',
      text: 'Perry begins Karim Khan’s rise within the struggles following Nader Shah’s assassination. This earlier reference point explains the selected sequence; it does not move the case’s preserved 1751 starting boundary.',
      citations: [
        cite('zand-history', 'Opening account of 1747 and Karim Khan’s rise'),
      ],
    },
    {
      year: 1751,
      label: '1751: the dynastic convention begins',
      title: 'The title wakil represents authority',
      text: 'Perry’s dynastic account uses 1751–1794 and describes Karim Khan’s adoption of the title wakil rather than shah. A deputy’s title did not eliminate executive power, campaigns or limits to the territories under his authority.',
      citations: [
        cite('zand-history', 'Karim Khan, the Wakil: title and limits of rule'),
      ],
    },
    {
      year: 1765,
      label: '1765–1779: residence at Shiraz',
      title: 'A court, commercial work and building gather in one city',
      text: 'Perry dates Karim Khan’s residence at Shiraz to these years and describes the citadel, mosque, gardens and covered bazaar, merchants and artisans. This urban context does not identify the manufacturing place of a case catalogued only as Iranian.',
      citations: [
        cite('zand-karim', 'The Wakil at Shiraz, 1765–79: residence and urban work'),
      ],
    },
    {
      year: 1779,
      label: '1779: Karim Khan dies',
      title: 'Succession changes the political setting',
      text: 'Karim Khan’s death was followed by struggles among Zand successors. The selected case’s catalogue date, 1789, belongs to this later period; no surviving ownership record was established in this consultation.',
      citations: [
        cite('zand-history', 'Death in 1779 and succession'),
        cite('met-681122', 'Date; selected visible record'),
      ],
    },
    {
      year: 1789,
      label: '1789: separate political and object dates',
      title: 'Lotf Ali Khan’s accession and a dated case',
      text: 'Perry dates Lotf Ali Khan’s rule from 1789; the Met separately dates Muhammad Baqir’s case 1204 AH/1789 CE. Their shared year supplies chronology, not evidence that this ruler commissioned or owned the case.',
      citations: [
        cite('zand-history', 'Lotf Ali Khan, 1789–94'),
        cite('met-681122', 'Artist and Date'),
      ],
    },
    {
      year: 1794,
      label: '1794: the selected dynastic endpoint',
      title: 'The last Zand ruler is defeated',
      text: 'Perry ends the dynastic convention with Lotf Ali Khan’s defeat and execution. This political endpoint does not establish when a case ceased to be used or when a craft tradition ended.',
      citations: [cite('zand-history', 'Lotf Ali Khan’s defeat and execution in 1794')],
    },
  ],
};

/** Integration may choose the shared key; this module preserves all old dimensions. */
export const zandCitiesDimension = {
  text: 'A useful container joins construction, painting and surface protection. Separately dated accounts of Shiraz describe building, merchants and artisans, without locating this case in a particular city or recovering its purchaser.',
  citations: [
    cite('met-681122', 'Description; Artist, Date, Geography and Medium'),
    cite('zand-karim', 'The Wakil at Shiraz, 1765–79'),
  ],
};

export function applyCitiesZand(c: Corpus): void {
  c.contexts ??= [];
  const objectSource = c.sources.find((source) => source.id === 'met-681122')!;
  objectSource.accessed = consulted;
  objectSource.scope =
    'Prior consultation, 2026-10-27 (retained): Accession 2015.252a–c; description, Artwork Details, attribution and Public Domain image statement consulted. Zand selected renewal, 2026-10-29: Visible opening description, Artist, Date, Geography, Medium, Dimensions, Credit Line and Object Number, and Public Domain statement actually reread. The record names Muhammad Baqir, dated 1204 AH/1789 CE, Iran, painted and lacquered papier-maché and pasteboard; no city of manufacture or purchaser established. The catalogue describes a mirror, dressing-set compartments and inner-lid courtly imagery. Actual unchanged local main photograph and both alternate views were inspected: outer birds and flowers, mirror and fitted empty drawer are visible; none of these three supplied views shows the catalogue-described inner-lid gathering. No provenance or signature tab, original inscription or independent Hijri conversion read. Photographic exposure date and current remote-image byte parity remain unverified. No new source image copied; all four adopted asset hashes remain unchanged.';
  const history = c.sources.find((source) => source.id === 'zand-history')!;
  history.accessed = consulted;
  history.scope =
    'Prior consultation, 2026-10-27 (retained): Perry, 2000/updated 2016. 1751–94 dynasty, Karim Khan 1751–79, Shiraz residence from 1765, limits of rule, commercial policy, warfare and succession. Zand selected renewal, 2026-10-29: Opening chronology, Karim Khan’s title and political limits, residence, commercial policy and selected succession passages through Lotf Ali Khan’s defeat in 1794 actually read. John R. Perry’s article was published 1 January 2000 and updated 14 July 2016. Nader Shah’s death in 1747 supplies an earlier reference milestone, not a replacement of the full case interval. No original Persian chronicles, commercial agreement, whole linked bibliography, borders or map read or reconstructed; narrative judgments and universal welfare claims are not adopted.';
  const karim = c.sources.find((source) => source.id === 'zand-karim')!;
  karim.accessed = consulted;
  karim.scope =
    'Prior consultation, 2026-10-27 (retained): The Wakil at Shiraz, 1765–79; title and political limits; merchants, rebuilding, gardens, bazaar and artisans. Courtly reminiscence is attributed, not used as evidence of universal prosperity. Zand selected renewal, 2026-10-29: Selected title and early-rule paragraphs; The Wakil at Shiraz, 1765–79 passages on residence, commercial arrangements, merchants, building and artisans; and the attributed Donboli reminiscence actually read. John R. Perry, Encyclopaedia Iranica XV/6, pp.561–564, published 15 December 2011 and updated 13 October 2015. The consultation was the selected online text, not the whole print volume or underlying memoirs and agreements. Donboli was a hostage/guest whose later courtly recollection is not a survey of workers’ welfare. Population estimates, present building conditions, automatic artist itineraries and a secure Shiraz workshop for the selected case are excluded.';
  for (const source of zandCitiesSources)
    if (!c.sources.some((existing) => existing.id === source.id))
      c.sources.push(source);
  if (!c.contexts.some((context) => context.id === zandPoliticalContext.id))
    c.contexts.push(zandPoliticalContext);
  const s = c.subjects.find((subject) => subject.id === 'zand-iran')!;
  s.contextIds = [...new Set([...(s.contextIds ?? []), zandPoliticalContext.id])];
  s.summary =
    'A painted case joins practical storage with skilled surface work. Its flowers, birds, mirror and compartments invite close observation, while the museum supplies its maker, date and intended dressing function. A separately dated account of Shiraz connects building, merchants and artisans without turning an Iranian object into evidence for everyone’s life or a named ruler’s possessions.';
  s.sections = [
    sec(
      'Making a useful container',
      'The case combines a rectangular frame, a drawer and a removable lid covering a mirror. In the supplied photograph, birds and flowers cover the outer surface while a fitted drawer projects beside the frame. The museum describes compartments intended for dressing implements such as scissors, tweezers and a comb. Constructing storage and arranging a painted surface were related kinds of skilled work. The photograph reveals shapes and decoration; the catalogue explains the intended contents.',
      cite(
        'met-681122',
        'Actual unchanged main and alternate photographs; opening description',
      ),
    ),
    sec(
      'Paint, support and protection',
      'The Met names Muhammad Baqir and identifies painted, lacquered papier-maché and pasteboard. These materials joined a container’s support with decorated surfaces. Columbia University’s exhibition on Persian bookbindings explains that thin varnish layers could provide a measure of protection, while wear remained possible. Its example is a later bookbinding, not an examination of this case. It helps explain why surface protection mattered without supplying this object’s exact recipe, pigments, working hours or condition.',
      cite('met-681122', 'Artist and Medium'),
      cite(
        'iran-lacquer-supports',
        'Ephemerality: varnish, support and wear; later binding example',
      ),
    ),
    sec(
      'Building and working in Shiraz',
      'For the earlier political setting, historian John R. Perry describes Karim Khan’s residence at Shiraz from 1765 to 1779. A citadel, mosque, gardens and covered bazaar formed part of the building work. Merchants from Europe and India and artisans attracted from Isfahan contributed to the city’s activity. Such accounts connect court patronage with commercial and skilled work. They do not identify Muhammad Baqir’s workshop: the case’s catalogue gives Iran, without a secure city of manufacture.',
      cite(
        'zand-karim',
        'The Wakil at Shiraz, 1765–79: commerce, building and artisans',
      ),
      cite('met-681122', 'Geography'),
    ),
    sec(
      'One object, several kinds of evidence',
      'The catalogue dates the case 1204 AH/1789 CE, ten years after Karim Khan’s death. It also describes an inner-lid courtly gathering. That gathering is absent from the three supplied views; readers can observe the outer decoration, mirror and drawer instead. Date, practical function and painted subject each support a different question. None identifies a purchaser or proves personal use by a ruler. The independently dated political reference keeps the later case connected to change without inventing ownership.',
      cite(
        'met-681122',
        'Date; opening description; actual three supplied photographs',
      ),
      cite('zand-history', 'Karim Khan’s death in 1779 and later succession'),
    ),
  ];
  s.deeperReading = [
    sec(
      'An intended use is not a surviving inventory',
      'The catalogue’s description of a dressing set connects the fitted compartments with implements. The supplied alternate view shows empty recesses; it does not establish which particular tools once lay there, who handled them or how often. Likewise, the maker’s name identifies the museum’s catalogue attribution without recovering every person involved in preparing supports, painting or finishing. A later bookbinding account can explain a general role for varnish, but it is not a chemical study of these surfaces. Object-specific technical questions remain open.',
      cite('met-681122', 'Description; Artist and Medium; actual drawer photograph'),
      cite(
        'iran-lacquer-supports',
        'Ephemerality: limited protection and later binding',
      ),
    ),
    sec(
      'Urban work and a courtly recollection',
      'Perry’s account presents commercial arrangements and building alongside military authority. Karim Khan’s title wakil, or deputy, did not make the government a modern elected system or extend its control uniformly across Iran. A favorable recollection by Abd al-Razzaq Donboli offers a particular observer’s later memory of the Shiraz court. Donboli had been a hostage and guest, and later wrote in a Qajar setting. His voice can illuminate a remembered courtly atmosphere without establishing equal prosperity for merchants, artisans, servants or other residents. Their working conditions need further evidence.',
      cite('zand-history', 'Title, territorial limits and campaigns'),
      cite(
        'zand-karim',
        'The Wakil at Shiraz, 1765–79: Donboli’s attributed reminiscence',
      ),
    ),
  ];
  s.evidenceReading = {
    title: 'Visible parts, catalogue claims and political recollection',
    introduction:
      'These observations and editorial paraphrases distinguish the unchanged supplied views from catalogue information and a historian’s account. They are not a new technical examination or translation of an inscription.',
    items: [
      {
        label: 'A mirror and fitted storage support a practical question',
        text: 'The photographs show outer birds and flowers, a mirror and an empty fitted drawer. The catalogue connects the compartments with a dressing set.',
        interpretation:
          'An observation about shapes can be checked in the supplied images. Intended use needs the catalogue. The photographed empty drawer does not recover its original tools, owner or daily routine. The catalogue-described inner-lid gathering is not visible in these three views.',
        citations: [
          cite('met-681122', 'Actual three supplied views; opening description'),
        ],
      },
      {
        label: 'A material name does not supply an exact recipe',
        text: 'The Met identifies painted and lacquered papier-maché and pasteboard. Columbia’s later bookbinding example explains a general relationship between support, varnish and limited protection.',
        interpretation:
          'The catalogue supports the material identification; the comparison explains a possible function of surface protection. It does not establish this case’s exact layers, ingredients, pigments, condition or division of workshop labor.',
        citations: [
          cite('met-681122', 'Medium'),
          cite(
            'iran-lacquer-supports',
            'Ephemerality: general explanation and MS Or 76',
          ),
        ],
      },
      {
        label: 'A favorable court memory has a particular speaker',
        text: 'Perry attributes a pleasant recollection of Karim Khan’s court to Donboli, a former hostage and guest who later wrote in a Qajar setting.',
        interpretation:
          'The recollection can be evidence for how one observer remembered the court. It cannot establish that every worker prospered. The independent 1779 death and 1789 object dates also prevent assigning the later case to Karim Khan without separate provenance.',
        citations: [
          cite('zand-karim', 'The Wakil at Shiraz, 1765–79: Donboli'),
          cite('zand-history', 'Karim Khan’s death in 1779'),
          cite('met-681122', 'Date'),
        ],
      },
    ],
  };
  s.familyActivity = {
    title: 'What can the case itself show?',
    duration: '10–15 minutes',
    steps: [
      'Find a bird or flower, the mirror and the projecting drawer in the supplied photograph. Describe where each is without guessing an owner.',
      'If alternate views are available, inspect the empty compartments. If they are not, use the source capsule’s description; no unseen detail is required.',
      'Make two short claims: one based on a visible part, and one about intended use based on the catalogue. Explain which source supports each.',
      'Read the two dates in the capsule. Explain why the case’s maker and date do not show that Karim Khan owned it. Add one unanswered question about its use.',
    ],
    explanation:
      'Source capsule — editorial paraphrase: the museum names Muhammad Baqir and dates this Iranian case 1204 AH/1789 CE. It describes a mirror and compartments intended for dressing implements such as scissors, tweezers and a comb. The supplied photograph shows outer flowers and birds, a mirror and a drawer; an alternate view shows empty compartments. The catalogue also describes a courtly gathering on another surface, which these three supplied views do not show. Karim Khan died in 1779. The record does not establish a purchaser, personal use by that ruler or a secure Shiraz workshop.',
  };
  s.review = {
    consultedOn: consulted,
    reviewer:
      'Codex selected source consultation and internal author QA; not independent historian or community approval',
    scope:
      'A focused lacquer-object inquiry, practical activity and independently dated political reference. The original case, claims, media identity, whole date, rights, order and image bytes remain intact. Selected image descriptions are corrected separately after direct inspection: the catalogue-described inner-lid gathering is absent from the three supplied photographs.',
    limitations: [
      'The three supplied views omit the catalogue-described inner-lid courtly gathering. This is made explicit in the new reading and activity; no new image, visual detail or ownership is invented.',
      'The later bookbinding source supplies general material context, not an exact recipe or examination of this case. Original inscriptions, underlying memoirs and agreements, purchaser, complete workshop team and current remote-image parity were not established.',
      'The complete 1751–1794 case is distinct from the selected 1747–1794 reference, Karim Khan’s 1765–1779 residence and the 1789 object. Shiraz remains political context rather than a verified manufacturing location.',
      'Independent specialist/community review, family use, human accessibility and physical print acceptance remain open.',
    ],
  };
}
