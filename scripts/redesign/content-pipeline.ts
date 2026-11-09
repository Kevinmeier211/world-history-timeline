/** Historical transformation sequence retained for migration evidence.
 * Current authoring lives in content-canonical; production uses canonical-content.ts. */
import { applyEditorialNavigation } from './editorial-navigation';
import { applyExemplars } from './content-exemplars';
import { applyExemplarPlaces } from './exemplar-places';
import { applyCitizenship } from './content-citizenship';
import { applyEarlyCities } from './content-early-cities';
import { applyBronzeInstitutions } from './content-bronze-institutions';
import { applyGovernmentWork } from './content-government-work';
import { applyExchange } from './content-exchange';
import { applyLearning } from './content-learning';
import { applyObligations } from './content-obligations';
import { applyEncounters } from './content-encounters';
import { applyFamilyEvidence } from './content-family-evidence';
import { applyHouseholds } from './content-households';
import { applyCoasts } from './content-coasts';
import { applyInstitutions } from './content-institutions';
import { applyImagesWork } from './content-images-work';
import { applyRegionalContexts } from './content-regional-contexts';
import { applyPlacesPatrons } from './content-places-patrons';
import { applyCommunitiesWork } from './content-communities-work';
import { applyWorkshops } from './content-workshops';
import { applyCities } from './content-cities';
import { applyPacificExchange } from './content-pacific-exchange';
import { applyIndustry } from './content-industry';
import { applyPlainsAuthority } from './content-plains-authority';
import { applyRemainingReading } from './content-remaining-reading';
import { applyCompletionBronze } from './content-completion-bronze';
import { applyCompletionKuk } from './content-completion-kuk';
import { applyC1Orientations } from './orientations-c1';
import { applyC2Orientations } from './orientations-c2';
import { applyC3Orientations } from './orientations-c3';
import { applyC4Orientations } from './orientations-c4';
import { applyC5Orientations } from './orientations-c5';
import { applyC6Orientations } from './orientations-c6';
import { applyC7Orientations } from './orientations-c7';
import { applyC8Orientations } from './orientations-c8';
import type { Corpus } from '../../src/atlas/model';

/** Order is historical and significant: later stages refine earlier authored records. */
export const contentStages = [
  { id: 'content-exemplars', apply: applyExemplars },
  { id: 'exemplar-places', apply: applyExemplarPlaces },
  { id: 'content-citizenship', apply: applyCitizenship },
  { id: 'content-early-cities', apply: applyEarlyCities },
  { id: 'content-bronze-institutions', apply: applyBronzeInstitutions },
  { id: 'content-government-work', apply: applyGovernmentWork },
  { id: 'content-exchange', apply: applyExchange },
  { id: 'content-learning', apply: applyLearning },
  { id: 'content-obligations', apply: applyObligations },
  { id: 'content-encounters', apply: applyEncounters },
  { id: 'content-households', apply: applyHouseholds },
  { id: 'content-coasts', apply: applyCoasts },
  { id: 'content-institutions', apply: applyInstitutions },
  { id: 'content-images-work', apply: applyImagesWork },
  { id: 'content-regional-contexts', apply: applyRegionalContexts },
  { id: 'content-places-patrons', apply: applyPlacesPatrons },
  { id: 'content-communities-work', apply: applyCommunitiesWork },
  { id: 'content-workshops', apply: applyWorkshops },
  { id: 'content-cities', apply: applyCities },
  { id: 'content-pacific-exchange', apply: applyPacificExchange },
  { id: 'content-industry', apply: applyIndustry },
  { id: 'content-plains-authority', apply: applyPlainsAuthority },
  { id: 'content-remaining-reading', apply: applyRemainingReading },
  { id: 'content-family-evidence', apply: applyFamilyEvidence },
  { id: 'editorial-navigation', apply: applyEditorialNavigation },
  { id: 'content-completion-bronze', apply: applyCompletionBronze },
  { id: 'content-completion-kuk', apply: applyCompletionKuk },
  { id: 'orientations-c1', apply: applyC1Orientations },
  { id: 'orientations-c2', apply: applyC2Orientations },
  { id: 'orientations-c3', apply: applyC3Orientations },
  { id: 'orientations-c4', apply: applyC4Orientations },
  { id: 'orientations-c5', apply: applyC5Orientations },
  { id: 'orientations-c6', apply: applyC6Orientations },
  { id: 'orientations-c7', apply: applyC7Orientations },
  { id: 'orientations-c8', apply: applyC8Orientations },
] as const;

export function applyContentStages(
  corpus: Corpus,
  observe?: (stage: string, corpus: Corpus) => void,
) {
  for (const stage of contentStages) {
    stage.apply(corpus);
    observe?.(stage.id, corpus);
  }
}
