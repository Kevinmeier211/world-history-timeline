import type { Corpus, Source } from '../../src/atlas/model';

export const ww1ConsultedOn = '2026-10-29';
export const ww1SplitSources: Source[] = [
  {
    id: 'ww1-grey-debate-1914',
    title: 'Statement by Sir Edward Grey, with subsequent responses',
    institution: 'UK Parliament, Historic Hansard',
    author:
      'Edward Grey; Bonar Law; John Redmond; Ramsay MacDonald; parliamentary reporters',
    url: 'https://api.parliament.uk/historic-hansard/commons/1914/aug/03/statement-by-sir-edward-grey',
    type: 'primary',
    published:
      '3 August 1914, HC Deb vol.65, cc.1809–1832; modern digital transcription',
    accessed: ww1ConsultedOn,
    scope:
      'Selected cc.1809–1814 on stated freedom to decide and prior Anglo-French conversations, cc.1817–1826 on conditional assurances/Belgium and imperial responsibilities, and cc.1829–1831 MacDonald response actually read as parliamentary digital text. A public ministerial justification and disagreement, not a neutral complete July-crisis archive or unanimous popular mandate. No original shorthand/printed-page collation or every diplomatic letter newly read. No legal opinion about current treaty obligations.',
  },
  {
    id: 'ww1-indian-censor-edition',
    title:
      'Transcribed extracts from the Reports of the Censor of Indian Mail, 1914–1918',
    institution: 'New Forest National Park Authority, New Forest Remembers',
    author:
      'Project volunteers; PDF metadata names Gareth Owen; historical English extracts prepared by the colonial censor’s office',
    url: 'https://nfknowledge.org/wp-content/uploads/2024/06/Transcribed-extracts-from-the-Reports-of-the-Censor-of-Indian-Mail-1914-1918.pdf',
    type: 'primary',
    published:
      'Modern transcription; PDF metadata created 2 February 2016, modified 24 June 2024; exact public-release date not verified',
    accessed: ww1ConsultedOn,
    scope:
      '80-page modern table edition: opening project/method description and selected PDF pp.70 and 72 actually read and visually inspected. P 70: IOR/L/MIL/5/826/3 f.18v,18 March 1916 censor report row explicitly labelled summarised; f.28r Tirka Ram 28 February 1916; f.7v Natha Singh 19 February 1916; f.8r Tej Natu 26 February 1916. P 72: IOR/L/MIL/5/826/4 f.31r Gugan Singh 11/12 April 1916; /826/5 f.51v Shaikh Ahmad 14 June 1916. English text is historical translated extract, re-transcribed by a modern project; individual original translators unidentified. Not full original letters, all 80 pages read, or collation against unavailable BL images. Some other table rows have inconsistent date/reference columns and are not silently corrected or adopted. Ethnic/religious headings and medical/demographic claims are not a modern taxonomy or verified statistics. No source image added. Web extraction returned 429; one ordinary authorized download of the same public PDF succeeded, without altered access credentials.',
  },
  {
    id: 'ww1-indian-library-story',
    title: 'Letters from Indian Soldiers in France, 1916',
    institution: 'British Library, published by Europeana',
    author: 'John O’Brien',
    url: 'https://www.europeana.eu/en/stories/letters-from-indian-soldiers-in-france-1916',
    type: 'scholarship',
    published: '14 November 2012',
    accessed: ww1ConsultedOn,
    scope:
      'Short library-authored story actually read: scribe/regimental/censor/translation/report layers and named Daya Ram 5 July 1916, IOR/L/MIL/5/826/6 f.876; Gholam Rasul Khan 24 May 1916, /826/5 f.711. These two passages are supplied library excerpts, not freshly collated original letters or a full 27-volume read. No image rights established. Broad literacy and aggregate sacrifice statements are not adopted as new numerical claims.',
  },
  {
    id: 'ww1-indian-archive-access',
    title:
      'Collection 425/188: Censorship of correspondence to and from Indian Expeditionary Force in France',
    institution: 'British Library Archives and Manuscripts Catalogue',
    url: 'https://searcharchives.bl.uk/catalog/040-000371203',
    type: 'catalogue',
    accessed: ww1ConsultedOn,
    scope:
      'Current catalogue for IOR/L/MIL/7/17347 actually read:1914–1918 file scope, English, interim recovery catalogue and digital images explicitly currently unavailable. This is a related file, not the exact /826/3 or /826/4 report volumes. Its Crown Copyright/Open Government Licence statement is file-specific; it is not transferred automatically to a different modern transcription, every soldier’s original words or a source image. Physical item request/contact not made.',
  },
  {
    id: 'ww1-boulogne-reference',
    title: 'Boulogne-sur-Mer: selected gazetteer reference',
    institution: 'GeoNames',
    url: 'https://www.geonames.org/6439391/boulogne-sur-mer.html',
    type: 'catalogue',
    accessed: ww1ConsultedOn,
    scope:
      'Indexed GeoNames 6439391 ADM 4 metadata gives 50.72556N,1.61389E. Direct feature page failed/cache-missed; separate 3031133 page returned only generic interface. Numeric value is an explicitly modern administrative reference for the censor-city context, not a surveyed office, letter-writing point, trench, postal route or historical boundary. No population/current administrative-history claim adopted.',
  },
  {
    id: 'ww1-birtley-museum',
    title: 'First World War Stories: The Birtley Belgians',
    institution: 'Tyne & Wear Archives & Museums / North East Museums',
    url: 'https://blog.twmuseums.org.uk/first-world-war-stories-the-birtley-belgians/',
    type: 'archive',
    published: '12 August 2014',
    accessed: ww1ConsultedOn,
    scope:
      'Institutional article body actually read through web extraction: albumTWAM 1027/271, Belgian work and village facilities,21 December 1916 disturbance and inquiry recommendation. Exact workforce/shift/production/superlative totals and universal claims about no assimilation not adopted. Linked books not read. Direct ordinary HTML download redirected to current museum homepage; the archived/extracted article is not claimed identical to that live page. Flickr album cache-missed; one separately identified image/caption inspected instead, not whole album.',
  },
  {
    id: 'ww1-birtley-transfer-records',
    title: 'Birtley planning and transfer records, selected 1916 transcriptions',
    institution: 'Birtley-Elisabethville family-archive website',
    author:
      'Contemporary officials including Clément van Dijck, Graham Spicer and meeting participants; modern site transcriber not identified in selected page',
    url: 'https://www.birtley-elisabethville.be/page3.html',
    type: 'primary',
    published:
      'Selected 15 January/31 January and 10–11 April 1916 records; modern web edition undated',
    accessed: ww1ConsultedOn,
    scope:
      'Selected French van Dijck report,15 January 1916 with 31 January covering note: recruitment, salary uncertainty, lodging, village and technical preparation. English Organisation for the Transfer conference 10 April 1916, Classes 1–3, and Memorandum of Interview 11 April 1916 actually read. The later interview explicitly supersedes the Class 1 transport arrangement: no static route or completed journey inferred. Modern Les Sources page 15 read: site states major material derives from duplicates of Hubert Debauche’s family papers, with additional later research; original physical records/scans, private archive or every transcription not collated. English passages not newly translated; selected French paraphrases are editorial translations. No unsupported claim that every refugee was a soldier or all workers had one legal status; no numerical wage/shift claim.',
  },
  {
    id: 'ww1-birtley-care-letter',
    title: 'Hubert Debauche to Albert Edward Prowse,31 January 1919',
    institution:
      'Birtley-Elisabethville family-archive website, La Liquidation de la colonie',
    author: 'Hubert Debauche; modern web transcriber unidentified',
    url: 'https://www.birtley-elisabethville.be/page12.html',
    type: 'primary',
    published: 'Letter 31 January 1919; modern web edition undated',
    accessed: ww1ConsultedOn,
    scope:
      'Opening and complete selected first letter to Prowse on transfer/care of the cemetery and requested enclosure actually read in French; editorial English paraphrase. A director’s request/agreement account, not proof a wall was built or a complete family testimony. Burial totals in the separate adjacent letter not adopted. Original physical letter/enclosure/plan not inspected, full liquidation file not read. Provenance statement at page 15 consulted; no unrestricted scan/text licence established.',
  },
  {
    id: 'ww1-birtley-album-image',
    title: 'Riveting of the base plate, National Projectile Factory, Birtley',
    institution:
      'Tyne & Wear Archives & Museums / North East Museums; Flickr Commons copy at Wikimedia Commons',
    author:
      'Sir W.G. Armstrong Whitworth & Co Ltd credited for the album photographs; individual photographer unidentified',
    url: 'https://commons.wikimedia.org/wiki/File:Riveting_of_the_base_plate.jpg',
    type: 'primary',
    published:
      'Photograph 21 June 1916; digital scan metadata 25 June 2014; Commons copy 14 August 2014',
    accessed: ww1ConsultedOn,
    scope:
      'Actual 1000×757 JPEG viewed: three workers, machinery, shell components and visible Birtley/June 21st 1916 lettering. Caption identifies riveting; mechanical operation is not independently diagnosed from shape alone. SourceTWAM 1027/271; original Flickr 14713203291 cache-missed. Commons records Flickr-no-known-copyright-restrictions and institutional sharing/credit request, with stated restrictions on high-quality reproductions/commercial use of original physical material. No blanket CC 0, exact exposure-time, worker identities, wages/consent, full album or source-scan parity claim. Separate research-only visual proposal; no product media or bytes added.',
  },
  {
    id: 'ww1-birtley-reference',
    title: 'Birtley, Durham, GBPN 3839',
    institution: 'Gazetteer of British Place Names, Association of British Counties',
    url: 'https://gazetteer.org.uk/place/Birtley,_Durham_3839',
    type: 'catalogue',
    accessed: ww1ConsultedOn,
    scope:
      'Actual published Lat/Long 54.896397,-1.5776878 and GBPN 3839 identity read. CC BY 4.0 data statement explicit. Modern village reference, not a surveyed National Projectile Factory, Elisabethville boundary, route or house. Distinct from Birtley in Northumberland, which was rejected as the wrong locality. No modern council/history inference beyond identity.',
  },
  {
    id: 'ww1-watkins-transcript',
    title:
      'Report on Military Labour to the B.E.A. Expeditionary Force,4 August 1914–15 September 1919',
    institution:
      'Original reportCO 533/216;2021 working transcription hosted by Professor Michèle Barrett',
    author: 'O.F. Watkins; transcript by Nicholas Knowles and Gillian Furse',
    url: 'https://www.michelebarrett.com/wp-content/uploads/2021/04/Watkins-Report-transcription-2021.pdf',
    type: 'primary',
    published: 'Official report 1919; working transcript 2021, CC BY-SA 4.0',
    accessed: ww1ConsultedOn,
    scope:
      'Selected PDF p. 2 method/rights, pp. 23–24 paras 88–93 Recruitment and pp. 29–30 paras 110–114 Food/Cooking actually read and visually inspected. The transcript retains original pagination, lacunae and problematic spellings; original typescript atCO 533/216 not independently collated. The whole 36 pages, untranscribed appendices or original payrolls not read. Watkins’ claims of organization/success and racialized explanations are situated official arguments, not neutral or African consensus. His reported 1915 conscription powers are not a fresh independent statute reading. No casualty totals, ration quantities, medical efficacy or invented carrier biography adopted. Modern editorial introduction’s sweeping no-roads/success/independence claims are not adopted.',
  },
  {
    id: 'ww1-nyeri-labour-research',
    title: 'Missionaries, the State, and Labour in Colonial Kenya c.1909–c.1919',
    institution: 'History Workshop Journal 95, pp. 175–196, Oxford University Press',
    author: 'Tom Cunningham',
    url: 'https://academic.oup.com/hwj/article/doi/10.1093/hwj/dbac024/6851706',
    type: 'scholarship',
    published: 'Online 29 November 2022; Spring 2023 issue; CC BY 4.0',
    accessed: ww1ConsultedOn,
    scope:
      'Selected opening The Colonial Missionary in the Wire Cage,1917 South Nyeri recruitment/medical sorting, wartime relief/1918 famine paragraphs and footnote 1 source/method actually read. Philp’s 1918 The Wire Cage in Kikuyu News 66 is quoted through this research; original magazine issue not read. Distinguishes army/farm work and healing/coercion. No demographic/mortality estimates, examination totals, exact legal age/weight limits or full 1909–1919 history adopted. No image/micrograph reused; linked bibliography is not claimed read.',
  },
  {
    id: 'ww1-ngugi-family-memory',
    title: 'Dreams in a Time of War: selected memoir excerpt',
    institution: 'Granta 109 / Granta Magazine',
    author: 'Ngũgĩ wa Thiong’o',
    url: 'https://granta.com/dreams-in-a-time-of-war/',
    type: 'primary',
    published: 'Memoir 2010; webpage dated 12 October 2011',
    accessed: ww1ConsultedOn,
    scope:
      'Selected opening identity and paragraph beginning My father worked as a domestic servant, through two explicitly alternative accounts of avoiding the First World War draft actually read. Ngũgĩ born 1938 recounts family memory, not personal WWI eyewitness or verified medical experiment. No named-plant recipe, draft-evasion instruction, death total, broad postwar land/treaty claim,1921/1922 chronology or whole memoir adopted. Granta/author copyright retained; no reprint or image permission inferred, source-linked concise paraphrase only.',
  },
  {
    id: 'ww1-africa-crowder',
    title: 'The First World War and its consequences in Africa',
    institution: 'UNESCO, selected General History of Africa chapter web presentation',
    author: 'Michael Crowder',
    url: 'https://www.unesco.org/en/articles/first-world-war-and-its-consequences-africa-0',
    type: 'scholarship',
    published: '5 October 2018; web update 20 April 2023',
    accessed: ww1ConsultedOn,
    scope:
      'Selected introductory carriers/supply discussion and The African involvement in the War recruitment-method paragraphs actually read. General context only, not a single African experience, newly read decrees, every chapter source or local eyewitness. Numerical service/death/age totals and universal choice/coercion claims not adopted. The IWM-credited image not inspected or reused.',
  },
  {
    id: 'ww1-nyeri-reference',
    title: 'Nyeri modern locality reference, GeoNames 182701',
    institution: 'GeoNames',
    url: 'https://www.geonames.org/182701/nyeri.html',
    type: 'catalogue',
    accessed: ww1ConsultedOn,
    scope:
      'Actual feature page coordinates -0.42013,36.94759 read. A modern Nyeri locality reference for the broader district inquiry, not the surveyed 1917 holding pen, mission, a carrier’s home, recruitment boundary or campaign route. Modern population, administrative boundaries and identity of individuals not inferred.',
  },
];

export function putWW1Sources(c: Corpus, ids: string[]): void {
  for (const id of ids) {
    const row = ww1SplitSources.find((r) => r.id === id);
    if (!row) throw new Error(`Missing selected WWI source ${id}`);
    const i = c.sources.findIndex((r) => r.id === id);
    if (i < 0) c.sources.push(row);
    else c.sources[i] = row;
  }
}
