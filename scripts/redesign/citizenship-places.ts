import type { Corpus, PlaceStudy } from '../../src/atlas/model';
import { cite } from './content-helpers';

const studies: Record<string, PlaceStudy> = {
  'indonesia-independence': {
    title: 'An archipelago and an unsettled transfer',
    background: 'coastline',
    description:
      'Locate the proclamation, a wartime Republican capital and the geographic limits of agreements. These are selected locators, not a reconstruction of territorial control. The Hague negotiations took place outside this view.',
    bounds: [93, -12, 143, 8],
    points: [
      {
        id: 'jakarta',
        label: 'Jakarta — proclamation',
        coordinates: [106.83, -6.19],
        text: 'Sukarno and Hatta proclaimed independence in Jakarta on 17 August 1945. The locator identifies the city, not every place where the proclamation was heard.',
        citations: [
          cite(
            'indonesia-proclamation-archive',
            'Printed p. 7, dated Jakarta proclamation',
          ),
        ],
      },
      {
        id: 'yogyakarta',
        label: 'Yogyakarta — a Republican capital',
        coordinates: [110.37, -7.8],
        text: 'Dutch forces took the Republican capital in December 1948 and arrested leaders. A captured capital did not end resistance or resolve sovereignty.',
        citations: [cite('indonesia-war', '19 December 1948')],
      },
      {
        id: 'sumatra',
        label: 'Sumatra — authority under negotiation',
        coordinates: [101.5, -0.5],
        text: 'The Linggajati negotiations concerned recognition of Republican authority in Java, Sumatra and Madura within a proposed wider federation. This point locates Sumatra; it does not draw a negotiated or military boundary.',
        citations: [cite('indonesia-transfer', 'Linggajati agreement summary')],
      },
      {
        id: 'new-guinea',
        label: 'Western New Guinea — excluded in 1949',
        coordinates: [135, -4],
        text: 'Netherlands New Guinea was excluded from the 1949 transfer and remained under Dutch rule. This broad locator explains a limit of that settlement, not a present-day sovereignty map.',
        citations: [cite('indonesia-newguinea', 'New Guinea exclusion')],
      },
    ],
    features: [],
  },
  'ghana-independence': {
    title: 'Ghana: a capital, a regional challenge and a development project',
    background: 'coastline',
    description:
      'Three places connect political institutions, debate over regional authority and plans for economic development. Close coastal locations group on a small screen; each remains available by name. No colonial or modern borders are reconstructed.',
    bounds: [-2.5, 4.7, 0.8, 7.5],
    points: [
      {
        id: 'accra',
        label: 'Accra — assembly and political organizing',
        coordinates: [-0.2, 5.55],
        text: 'Accra was a center of political activity and the legislative debate. The 5 March 1957 statement identifies the governmental powers due to change at independence.',
        citations: [
          cite('ghana-country-study', 'Printed pp. 26–29'),
          cite('ghana-debate-1957', 'Printed columns 23–24'),
        ],
      },
      {
        id: 'kumasi',
        label: 'Kumasi / Asante — regional opposition',
        coordinates: [-1.62, 6.69],
        text: 'The Asante-based National Liberation Movement argued for a federation with stronger regional powers. Kumasi is an orientation point for the Asante region, not a claim that everyone there held one opinion.',
        citations: [cite('ghana-country-study', 'Printed p. 29, NLM and regionalism')],
      },
      {
        id: 'tema',
        label: 'Tema — plans for a harbour',
        coordinates: [0.0, 5.64],
        text: 'Nkrumah cited the building of Tema Harbour in his independence-eve account of development financing. This is a project named in the 1957 speech, not a claim that the completed harbour opened that year.',
        citations: [cite('ghana-debate-1957', 'Printed column 26; PDF p. 21')],
      },
    ],
    features: [],
  },
  'south-africa-rights': {
    title: 'South Africa: voting, drafting and signing in different places',
    background: 'coastline',
    description:
      'Follow distinct actions across the country. The photograph was made near Durban, the Assembly worked in Cape Town, and the constitution was signed at Sharpeville. The line of argument is chronological; no travel route is drawn.',
    bounds: [16, -35.5, 33.5, -22],
    points: [
      {
        id: 'inanda',
        label: 'Inanda — the voting photograph',
        coordinates: [30.95, -29.7],
        text: 'Paul Weinberg photographed Mandela casting his ballot at Ohlange School in April 1994. The image is evidence of this occasion, not the later signing ceremony.',
        citations: [cite('sa-voting-image', 'Setting, author and date')],
      },
      {
        id: 'cape-town',
        label: 'Cape Town — constitution-making',
        coordinates: [18.42, -33.93],
        text: 'The Constitutional Assembly worked in Cape Town. Mandela’s 8 May 1996 address celebrated adoption of the text and a mural marking public participation.',
        citations: [
          cite('sa-mandela-constitution', 'Title and pp. 1–2'),
          cite('sa-certification', 'Paragraph 6, Assembly address'),
        ],
      },
      {
        id: 'sharpeville',
        label: 'Sharpeville — signing',
        coordinates: [27.87, -26.69],
        text: 'Mandela signed the constitution here on 10 December 1996. Signing preceded its commencement on 4 February 1997.',
        citations: [cite('sa-transition', '1996 and 1997 milestones')],
      },
      {
        id: 'braamfontein',
        label: 'Braamfontein — the 1996 Court procedure',
        coordinates: [28.04, -26.19],
        text: 'The certification notice identifies the Court’s then premises at Forum II, Braampark. The present Constitutional Court building at Constitution Hill opened in 2004; it should not be substituted for the venue in this 1996 document.',
        citations: [
          cite('sa-certification', 'Paragraphs 5 and 11, Forum II address'),
          cite('sa-constitution-hill', 'Later Court building history'),
        ],
      },
    ],
    features: [],
  },
};
export function applyCitizenshipPlaces(corpus: Corpus) {
  for (const [id, study] of Object.entries(studies))
    corpus.subjects.find((s) => s.id === id)!.placeStudy = study;
}
