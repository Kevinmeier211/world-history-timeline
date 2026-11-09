import type { Pack } from '../../src/atlas/model';
/** Editorial additions to existing reading frames; no inherited historical record is promoted. */
export function expandedPacks(original: Pack[]): Pack[] {
  return original.map((base) => {
    const p = structuredClone(base);
    if (p.id === 'C2') {
      p.coverage.Americas = {
        status: 'researched',
        subjects: ['olmec', 'caral', 'poverty-point'],
        reason:
          'Olmec and later Caral contexts now sit beside Poverty Point’s hunter-fisher-gatherer earthworks and domestic work. These are distinct histories; most North American regions remain outside this selected window.',
      };
      p.geography +=
        ' Poverty Point adds a separate Lower Mississippi Valley investigation of earthworks, food and materials.';
    }
    if (p.id === 'C4') {
      p.coverage.Americas = {
        status: 'researched',
        subjects: ['colima', 'teotihuacan', 'moche', 'hopewell-earthworks'],
        reason:
          'Colima, Teotihuacan, northern coastal Peru and Ohio Hopewell ceremonial networks provide four distinct contexts. Their coexistence creates no assumed contact or common state.',
      };
      p.geography +=
        ' Ohio’s Hopewell networks add an eastern woodland comparison without asserting contact with the other pilot societies.';
    }
    if (p.id === 'C5') {
      p.coverage.Americas = {
        status: 'researched',
        subjects: ['maya-vessel', 'moche', 'teotihuacan', 'chaco-communities'],
        reason:
          'Maya text/food/rank and earlier Andean/Mexican contexts now include the beginning of Chaco’s regional building history. Most northern regions remain unrepresented.',
      };
      p.geography +=
        ' Chaco’s mid/late-ninth-century building context provides a distinct Southwestern case extending into the next chapter.';
    }
    if (p.id === 'C6') {
      p.coverage.Americas = {
        status: 'researched',
        subjects: ['inca-weaving', 'chaco-communities', 'cahokia-city'],
        reason:
          'Andean textile work, Chaco’s regional institutions and Cahokia’s urban/ordinary life are separately researched. Arctic, Northwest Coast and much of the Plains and eastern woodlands still need fuller treatment.',
      };
      p.geography +=
        ' Compare Chaco’s Southwest with Cahokia’s Mississippi floodplain; the companion investigation also visits earlier Poverty Point and Ohio Hopewell contexts.';
      p.investigations = [
        {
          title: 'Earth, food and gathering in Indigenous North America',
          journey: 'north-american-communities',
          comparison: ['chaco-communities', 'cahokia-city'],
          start: -1700,
          end: 1400,
          question: 'How did people make different kinds of community?',
          orientation:
            'Four selected settings connect food, skilled work, gathering and long-distance materials across different centuries. They are not stages of one society, and an inquiry crossing dates does not establish a historical route between its stops.',
          geography:
            'Follow the Lower Mississippi Valley, Ohio, the San Juan Basin and Greater Cahokia. These cases north of Mesoamerica complement the atlas’s distinct Mexican and Maya histories; none can stand for the whole continent.',
          limits:
            'A selective investigation north of Mesoamerica, not a complete precolonial survey. Arctic, Northwest Coast, Plains and many eastern woodland histories remain outside it. Later photographs, surveys and restorations are labeled. Community-authored evidence and scholarly disagreement remain part of the account.',
        },
      ];
    }
    if (p.id === 'C7') {
      p.title = 'Connections, work and unequal power';
      p.question = 'How did connections reshape work, belief, power and resistance?';
      p.orientation +=
        ' A companion investigation turns inland to Ottoman, Safavid and Central Asian cities and follows skilled work into later-eighteenth-century Iran.';
      p.geography +=
        ' Istanbul/Iznik, Isfahan/New Julfa, Bukhara and the Shiraz political context add distinct West/Central Asian settings; a shared chapter does not merge their governments or identities.';
      p.limits =
        'Selected African, Asian, European and American encounters, with ocean and inland investigations. This is not a complete history of Atlantic slavery, Indigenous resistance, the Indian Ocean, Ottoman Arab provinces, the wider Caucasus or Central Asia beyond the selected Bukhara case. Oceanian perspectives still need fuller treatment.';
      p.coverage['West/Central Asia'] = {
        status: 'researched',
        subjects: ['ottoman-workshops', 'isfahan-silk', 'bukhara-books', 'zand-iran'],
        reason:
          'Ottoman administration/workshops/markets, Safavid Isfahan and forced Armenian relocation, Bukhara’s urban/bookmaking contexts and later-eighteenth-century Iran now have distinct sourced dossiers. This is not an exhaustive account of Ottoman provinces, the Caucasus, pastoral societies or Central Asia.',
      };
      p.investigations = [
        {
          title: 'Books, silk and power: West/Central Asia, 1500–1800',
          journey: 'west-central-workshops',
          comparison: ['ottoman-workshops', 'isfahan-silk'],
          question:
            'How did makers and urban communities work within—and beyond—courtly power?',
          orientation:
            'Begin with a book likely copied and painted in different settings, then examine an Ottoman dish and emblem, an Iranian carpet and a 1789 lacquer case. Put skilled work beside patronage, markets and coercion. A luxury object cannot stand in for everyone’s experience.',
          geography:
            'Distinct contexts in present-day Türkiye, Iran and Uzbekistan connect artistic production to cities, trade and political power. The manuscript’s Bukhara attribution and the carpet’s workshop location remain qualified; map points do not resolve those uncertainties.',
          limits:
            'Four selected contexts within the 1500–1800 navigation frame. Their defined dates are not the lifespans of all relevant empires or peoples. The investigation includes forced Armenian relocation and urban work but cannot recover every maker, purchaser or household.',
        },
      ];
    }
    if (p.id === 'C8')
      p.investigations = [
        {
          title: 'Political freedom and the meaning of a promise',
          journey: 'promises-rights',
          comparison: ['tiriti', 'south-africa-rights'],
          question: 'Who understood a political promise—and who could exercise it?',
        },
        {
          title: 'Global war, state power and a new signal',
          journey: 'war-signals',
          comparison: ['world-war-one', 'sputnik'],
          question:
            'How do decisions and institutions connect large events to individual lives?',
        },
      ];
    if (p.id === 'C4') {
      p.coverage.Americas.subjects.push('bering-sea-carvers');
      p.coverage.Americas.reason +=
        ' A catalogued Bering Sea carving adds an Arctic context with explicit regional dating disagreement; it establishes no contact with the other cases.';
      p.geography +=
        ' A separately dated Bering Strait object opens an Arctic inquiry.';
    }
    if (p.id === 'C6')
      p.coverage.Americas.reason =
        'Andean textile work, Chaco and Cahokia are researched in this window. Selected Arctic, Northwest Coast and Plains cases appear in other chapters; northern coverage within 1000–1500 remains limited and is not backfilled with objects from later dates.';
    if (p.id === 'C7') {
      p.coverage.Americas.subjects.push(
        'ozette-makah',
        'blackfoot-bison',
        'hidatsa-villages',
      );
      p.coverage.Americas.reason +=
        ' Distinct Makah, Blackfoot and Hidatsa investigations add cedar work, communal hunting and village agriculture. Ozette burial estimates remain disputed; the selected hunting context is not the whole site chronology.';
      p.geography +=
        ' Makah Ozette, the Blackfoot hunting landscape at Head-Smashed-In and Hidatsa river villages add distinct northern histories.';
    }
    if (p.id === 'C8') {
      p.coverage.Americas.subjects.push(
        'blackfoot-bison',
        'hidatsa-villages',
        'inuinnait-sewing',
        'kwakwakawakw-potlatch',
      );
      p.coverage.Americas.reason +=
        ' Northern cases investigate Indigenous work, relocation, clothing, prohibition and community authority. They do not represent all Arctic, Northwest Coast or Plains peoples; the eastern Arctic and many regional histories remain selective.';
      p.geography +=
        ' A companion inquiry links questions across the Bering Strait, Coronation Gulf, Makah coast, Blackfoot Plains, Hidatsa river villages and Kwakwaka’wakw communities without drawing an itinerary.';
      p.investigations!.push({
        title: 'Arctic, coast and Plains: work, knowledge and belonging',
        journey: 'northern-knowledge',
        comparison: ['ozette-makah', 'hidatsa-villages'],
        start: 300,
        end: 1980,
        question: 'How do different communities sustain life and pass on knowledge?',
        orientation:
          'Inspect a carved tool, wooden-household evidence, a hunting landscape, gardens, clothing and a primary title page. Six distinct contexts show how practical work, shared responsibilities and interpretation matter. Similar needs never make these peoples interchangeable.',
        geography:
          'Selected places in the Bering Strait, Canadian Arctic, Olympic Peninsula, southern Alberta, Missouri valley and northern Vancouver Island. The inquiry crosses centuries; its sequence is not a documented route or claim of contact.',
        limits:
          'Two selected contexts for each of three broad regions. Many Inuit homelands, Thule/Dorset histories, Northwest Coast nations and Plains communities still need fuller treatment. Later photographs, reconstructions, disputed dates and community sources remain explicit.',
      });
    }
    if (p.id === 'C6') {
      p.coverage.Americas.subjects.push('ocmulgee-council');
      p.coverage.Americas.reason +=
        ' Ocmulgee adds an ancestral southeastern council place, with construction chronology explicitly under revision; an unknown interval is not filled to make a bar.';
      p.geography +=
        ' Ocmulgee adds a distinct southeastern river/council context, including Muscogee collaboration and revised archaeological dating.';
    }
    if (p.id === 'C7') {
      p.coverage.Americas.subjects.push('wendat-laine', 'haudenosaunee-canandaigua');
      p.coverage.Americas.reason +=
        ' An ancestral Wendat village and Haudenosaunee treaty diplomacy add northeastern histories. Modeled village bounds, treaty signing and U.S. ratification are different kinds of dates; no common polity or automatic succession is inferred.';
      p.geography +=
        ' Southern Ontario and Canandaigua add distinct Wendat and Haudenosaunee investigations.';
    }
    if (p.id === 'C8') {
      p.coverage.Americas.subjects.push('cherokee-print', 'ojibwe-manoomin');
      p.coverage.Americas.reason +=
        ' Cherokee printing/removal and an Ojibwe rice-water document add southeastern and Great Lakes perspectives. Eastern Woodlands remains a geographic frame, with many nations and periods still beyond this selection.';
      p.geography =
        'Cases span Britain and continental Europe, the Caribbean and United States, Japan, Aotearoa, South Asia and South Africa. Companion inquiries add distinct Arctic, coastal, Plains, Great Lakes, northeastern and southeastern North American settings. Map locators do not reconstruct borders or photographic findspots.';
      p.investigations!.push({
        title: 'Eastern Woodlands: communities, knowledge and power',
        journey: 'eastern-woodlands',
        comparison: ['haudenosaunee-canandaigua', 'cherokee-print'],
        start: 1,
        end: 1913,
        question: 'How do places, food and records help people sustain a community?',
        orientation:
          'Inspect surviving clay and a reconstruction, look back to a separate Ohio gathering network, then investigate Wendat village work, Haudenosaunee diplomacy, Cherokee printing and Ojibwe rice knowledge. Documents and places record particular histories, not one universal woodland way of life.',
        geography:
          'Ocmulgee in the southeast, Ohio earthworks, a Wendat site in southern Ontario, Canandaigua in New York, New Echota and Great Lakes rice waters. The inquiry crosses dates deliberately; it is not an itinerary or an inferred chain of ancestry.',
        limits:
          'Selected northeastern, Great Lakes and southeastern histories, with earlier Hopewell context. Many nations and earlier chronological windows still need fuller treatment. Unknown construction dates, modeled ranges, later research figures and qualified photographic metadata remain explicit.',
      });
    }
    return p;
  });
}
