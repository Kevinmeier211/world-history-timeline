/** Historical pre-migration records for provenance and regression comparison.
 * Current authoring lives in content-canonical; production uses canonical-content.ts. */
import {
  pilotSources,
  pilotSubjects,
  pilotRelations,
  pilotJourney,
} from './content-pilot';
import { pilotPack, oceanPack, glossary } from './content-program';
import mediaData from './media-data.json';
import {
  oceanSources,
  oceanSubjects,
  oceanRelations,
  oceanJourney,
} from './content-oceans';
import { earlyPack } from './packs-early';
import { earlySources, earlySubjects, earlyJourney } from './content-early';
import { bronzeSubjects, bronzeSources, bronzeJourney } from './content-bronze';
import { bronzePack } from './packs-bronze';
import {
  classicalSubjects,
  classicalSources,
  classicalJourney,
  classicalPack,
} from './content-classical';
import {
  medievalSubjects,
  medievalSources,
  medievalJourney,
  medievalPack,
} from './content-medieval';
import {
  networkSubjects,
  networkSources,
  networkJourney,
  networkPack,
} from './content-networks';
import {
  modernSubjects,
  modernSources,
  modernJourneys,
  modernPack,
} from './content-modern';
import locMedia from './loc-media.json';
import { qinSubject, qinSources } from './content-qin';
import {
  northAmericanSources,
  northAmericanSubjects,
  northAmericanJourney,
} from './content-north-america';
import {
  westCentralSources,
  westCentralSubjects,
  westCentralJourney,
} from './content-west-central-asia';
import expansionMedia from './expansion-media.json';
import { expandedPacks } from './coverage-expansion';
import { northernSources, northernSubjects, northernJourney } from './content-northern';
import northernMedia from './northern-media.json';
import {
  woodlandSources,
  woodlandSubjects,
  woodlandJourney,
} from './content-woodlands';
import woodlandMedia from './woodlands-media.json';
import type { Corpus, Media, Source } from '../../src/atlas/model';
export function createBaseCorpus(): Corpus {
  return structuredClone<Corpus>({
    subjects: [
      ...pilotSubjects,
      ...oceanSubjects,
      ...earlySubjects,
      ...bronzeSubjects,
      ...classicalSubjects,
      ...medievalSubjects,
      ...networkSubjects,
      ...modernSubjects,
      qinSubject,
      ...northAmericanSubjects,
      ...westCentralSubjects,
      ...northernSubjects,
      ...woodlandSubjects,
    ],
    sources: [
      ...pilotSources,
      ...oceanSources,
      ...earlySources,
      ...bronzeSources,
      ...classicalSources,
      ...medievalSources,
      ...networkSources,
      ...modernSources,
      ...qinSources,
      ...northAmericanSources,
      ...westCentralSources,
      ...northernSources,
      ...woodlandSources,
      ...(expansionMedia.sources as Source[]),
      ...(mediaData.sources as Source[]),
    ],
    media: [
      ...mediaData.media,
      ...locMedia,
      ...expansionMedia.media,
      ...northernMedia.media,
      ...woodlandMedia.media,
    ] as Media[],
    relations: [...pilotRelations, ...oceanRelations],
    packs: expandedPacks([
      earlyPack,
      bronzePack,
      classicalPack,
      pilotPack,
      medievalPack,
      networkPack,
      oceanPack,
      modernPack,
    ]),
    journeys: [
      earlyJourney,
      bronzeJourney,
      classicalJourney,
      pilotJourney,
      medievalJourney,
      networkJourney,
      oceanJourney,
      ...modernJourneys,
      northAmericanJourney,
      westCentralJourney,
      northernJourney,
      woodlandJourney,
    ],
    glossary: [
      ...glossary,
      ...[
        [
          'earthwork',
          'A deliberately shaped construction of earth, such as a mound or enclosure. Its form alone does not establish its purpose or governing system.',
        ],
        [
          'terminus-post-quem',
          'The earliest possible date for an event, given the evidence. A timber could only have been used in a wall in or after the year its last surviving ring grew. The wood may have been stored or reused.',
        ],
        [
          'calibration',
          'Converting a radiocarbon determination into possible calendar dates using an independently established reference curve. One determination can have more than one plausible calendar placement.',
        ],
        [
          'syllabary',
          'A writing system whose signs represent syllables. The Cherokee syllabary is a system for writing Cherokee, not an ornamental version of English.',
        ],
        [
          'wampum',
          'Worked shell beads used in particular Indigenous contexts. The Onondaga account here explains agreements, speakers, memory and responsibilities; a pattern does not interpret itself.',
        ],
        [
          'ratification',
          'A formal act of confirming an agreement through a government’s procedures. It can occur after negotiation and signing, and does not by itself prove that commitments were fulfilled.',
        ],
        [
          'manoomin',
          'The Ojibwe name for wild rice, explained in the community sources as food with physical, cultural and spiritual significance. Related practices differ among communities.',
        ],
        [
          'winnowing',
          'Separating grain from lighter chaff, often with the help of moving air. It is one stage of finishing rice, distinct from harvesting, drying, parching and hulling.',
        ],
        [
          'marine-reservoir-effect',
          'Marine carbon can give a sample a different radiocarbon age from a contemporary land-based sample. Appropriate calibration and reservoir corrections matter; a regional revision does not automatically redetermine every catalogued object.',
        ],
        [
          'reconstruction',
          'A modern interpretation made from evidence about an earlier object, building or practice. It can help investigate how something worked, while remaining distinct from the surviving original.',
        ],
        [
          'radiocarbon',
          'A method that estimates the age of once-living material from radioactive carbon. Samples, calibration and environmental effects matter; an uncalibrated age in years BP is not automatically a calendar year.',
        ],
        [
          'waterlogged-preservation',
          'Survival of material in persistently wet conditions that slow some forms of decay. The preserved material is still a selective record, not a complete picture of a household.',
        ],
        [
          'seasonal-round',
          'An organized pattern of activities and movement through the year. Mobility can depend on detailed knowledge, planning and social institutions.',
        ],
        [
          'cache-pit',
          'A prepared underground storage space. Its construction, contents and use require evidence; an explanatory model is not an excavated original.',
        ],
        [
          'repatriation',
          'Return of belongings or ancestral remains to the peoples or communities to whom they belong. The atlas follows the particular community account rather than assuming one process for every collection.',
        ],
        [
          'potlatch',
          'A ceremony with specific forms and responsibilities in different Northwest Coast communities. In the Kwakwaka’wakw account here, invited people witness consequential events and gifts acknowledge their role.',
        ],
        [
          'experimental-archaeology',
          'Testing an interpretation by reproducing a material, technique or activity under stated conditions. An experiment supports a possibility; it is not a recovered ancient event.',
        ],
        [
          'archaeological-tradition',
          'A research label for related material practices across places or times. It is not automatically the name of one people, language or state.',
        ],
        [
          'biomarker',
          'A detectable chemical or biological trace used as evidence of a substance or process. Its interpretation depends on the method, sample and alternative explanations.',
        ],
        [
          'kiva',
          'A Pueblo ceremonial space with varied forms and histories. Archaeological identification and living community knowledge both matter; not every circular room has an identical meaning.',
        ],
        [
          'proxy',
          'An indirect measurement used to investigate something not directly counted or observed. A lake-sediment signal, for example, requires interpretation before it becomes a population claim.',
        ],
        [
          'chiefdom',
          'An analytical term for a society with ranked authority and leadership above a local community. Its use for an archaeological case is an interpretation, not a surviving official name.',
        ],
        [
          'stonepaste',
          'A ceramic body containing abundant crushed quartz with clay and glassy material. It differs from porcelain even when makers adapt similar designs.',
        ],
        [
          'tughra',
          'A calligraphic emblem of an Ottoman sultan’s authority used on official documents and other media. Drawing and ornament could involve specialized makers.',
        ],
        [
          'forced-relocation',
          'Movement imposed on people by authorities or armed power. Later achievements or privileges do not make the original movement voluntary.',
        ],
        [
          'caravansary',
          'An establishment offering space and facilities for traveling merchants and their goods, often linked to urban markets or overland travel.',
        ],
        [
          'madrasa',
          'An institution of learning in Islamic societies, with varied subjects, forms and patronage across time and place. A building does not by itself reveal every student’s experience.',
        ],
        [
          'lacquer',
          'A protective, often glossy surface finish applied over painted or decorated material. The Iranian case here uses painted papier-mâché and pasteboard.',
        ],
      ].map(([id, definition]) => ({
        id: id!,
        name: id!.replaceAll('-', ' '),
        definition: definition!,
      })),
    ],
  });
}
