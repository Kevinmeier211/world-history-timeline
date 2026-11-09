import type { Corpus } from '../../src/atlas/model';
import { cite } from './content-helpers';
export function applyImagesWorkPlaces(c: Corpus): void {
  c.sources.push({
    id: 'teotihuacan-location-unesco',
    title: 'Pre-Hispanic City of Teotihuacan — location metadata',
    institution: 'UNESCO World Heritage Centre',
    url: 'https://whc.unesco.org/en/list/414/',
    type: 'archaeology',
    accessed: '2026-10-29',
    scope:
      'Only published location metadata used for the locator: N19 41 30.012 W98 50 30.012, converted and rounded to [-98.842,19.692]. This is a property/site reference, not the mask’s findspot, a Tlajinga compound, a building centroid or an ancient boundary. English summary text is not used to replace Barnes’s case or chronology. No nomination plan, source map or geometry copied.',
  });
  c.subjects.find((s) => s.id === 'teotihuacan')!.placeStudy = {
    title: 'Teotihuacan: a city reference and a southern neighborhood',
    description:
      'The point orients the archaeological city. The Tlajinga project places the investigated district in the southern city; no verified numeric location for Compounds 17 and 18 is added here. Use the separately identified source map for their relative setting. The modern guide explains relationships and is not a measured household plan. The mask has no precise excavated findspot in the consulted catalogue.',
    bounds: [-99.02, 19.51, -98.66, 19.88],
    points: [
      {
        id: 'teotihuacan-site',
        label: 'Teotihuacan — site reference',
        coordinates: [-98.842, 19.692],
        text: 'Rounded UNESCO site locator. Tlajinga is described as a southern district by the excavators, but this point is neither its compounds nor the mask’s findspot. No ancient wall, state boundary or artifact route is reconstructed.',
        citations: [
          cite(
            'teotihuacan-location-unesco',
            'Location metadata below Dossier 414: N19 41 30.012 W98 50 30.012',
          ),
          cite(
            'teot-tlajinga-2026',
            'The Tlajinga District and Its Neighborhood Center; Figure 1 caption',
          ),
        ],
      },
    ],
    features: [],
  };
  c.subjects.find((s) => s.id === 'chavin-textile')!.placeStudy = {
    title: 'A highland centre is not this cloth’s findspot',
    description:
      'The site point orients the catalogue’s comparison with Chavín de Huántar stone imagery. The original case anchor remains a broad southern-coastal reference for a reported origin; it is not an excavated textile findspot. No line joins the centre to the fragment, and no route, political boundary or place of manufacture is supplied.',
    bounds: [-78.3, -15.2, -74.2, -8.6],
    points: [
      {
        id: 'chavin-centre',
        label: 'Chavín de Huántar — ceremonial centre',
        coordinates: [-77.17845, -9.59277],
        text: 'Rounded UNESCO archaeological-site reference. Buildings, galleries and carved imagery orient a highland centre. Similar imagery does not establish that this cloth was made here or travelled from here to a southern coast findspot.',
        citations: [
          cite(
            'chavin-center-unesco',
            'Location metadata below Dossier 330: S9 35 33.981 W77 10 42.433',
          ),
          cite(
            'met-315784',
            'Description paragraphs 2–3: reported southern-coastal origin and motif parallels',
          ),
        ],
      },
    ],
    features: [],
  };
}
