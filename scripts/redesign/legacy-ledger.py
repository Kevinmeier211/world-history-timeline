"""Account for every inherited record; no legacy prose is promoted by this script."""
import json,glob,hashlib,pathlib,collections
root=pathlib.Path('.')
c=json.load(open('public/atlas/corpus.json')); subjects={s['id']:s for s in c['subjects']}
# These are replacements into explicitly defined investigations, not identity equivalences.
replacements={
'poverty_point':['poverty-point'],'hopewell_tradition':['hopewell-earthworks'],'ancestral_puebloans':['chaco-communities'],'cahokia':['cahokia-city'],'ottoman':['ottoman-workshops'],'ottoman_empire':['ottoman-workshops'],'safavid_iran':['isfahan-silk'],'safavid_dynasty':['isfahan-silk'],
'qin':['qin-administration'],'eastern_han':['eastern-han'],'moche':['moche'],'teotihuacan':['teotihuacan'],'aksum':['aksum'],'dong_son':['dongson'],'liangzhu':['liangzhu'],'norte_chico':['caral'],'indus_valley':['dholavira'],'mature_harappan':['dholavira'],'old_kingdom_egypt':['old-kingdom'],'egypt_old_kingdom':['old-kingdom'],'shang_dynasty':['shang-ritual'],'hittites':['hattusha-change'],'olmecs':['olmec'],'lapita':['lapita'],'chavin_culture':['chavin-textile'],'neo_assyrian':['nimrud-palace'],'neo_assyria_babylon':['nimrud-palace'],'maurya_empire':['ashoka-messages'],'athens':['athens-water'],'classical_greece':['athens-water'],'kush_twenty_fifth':['taharqo'],'kushan':['kushan-contexts'],'roman_empire':['roman-world'],'roman_egypt':['roman-world'],'tang':['tang-city'],'northern_song':['song-art'],'southern_song':['song-art'],'abbasid':['abbasid-craft'],'maya_classic':['maya-vessel'],'maya_civilization':['maya-vessel'],'khmer_angkor':['angkor'],'mali_empire':['mali-networks'],'east_polynesia':['polynesian-voyaging'],'aotearoa':['polynesian-voyaging'],'inca_empire':['inca-weaving'],'ming':['ming-workshops'],'kongo':['kongo-translation'],'benin_kingdom':['benin-ivory'],'mughal':['mughal-books'],'mughal_empire':['mughal-books'],'portugal':['portuguese-voyage'],'spanish_philippines':['manila-network'],'philippines':['manila-network'],'voc':['banda-1621'],'haiti':['haitian-revolution'],'united_kingdom':['factory-reform'],'united_states':['hine-labor'],'meiji':['tomioka'],'empire_of_japan':['tomioka'],'new_zealand':['tiriti'],'india':['partition-1947'],'pakistan':['partition-1947'],'south_africa_apartheid':['south-africa-rights'],'nazi_germany':['world-war-two'],'ussr':['sputnik'],'kerma':['kerma-potters'],'kush_napatan':['taharqo']}
splits={'kerma_kush':['kerma-potters','taharqo'],'aksumite_empire':['aksum'],'tang_song_dynasty':['tang-city','song-art'],'ming_qing_china':['ming-workshops'],'sumer_akkad':['uruk-accounts'],'babylon_assyria':['nimrud-palace'],'han_dynasty':['eastern-han'],'gh ana_mali_songhai':['mali-networks'],'gh ana_mali_songhai'.replace(' ',''):['mali-networks'],'khmer_majapahit_sea':['angkor'],'gupta_chola':[],'modern_india':['partition-1947'],'modern_africa':['south-africa-rights'],'nazca_moche':['moche'],'wari_tiwanaku':[]}
identity={'eastern_roman_empire':['byzantium'],'byzantine_empire':['byzantium']}
replacements['haudenosaunee']=['haudenosaunee-canandaigua']
splits['iroquois_indigenous_nations']=['haudenosaunee-canandaigua','wendat-laine','ojibwe-manoomin']
links={}; rows=[]
related_bands={'band_bronze_collapse':['hattusha-change'],'band_industrial_revolution':['factory-reform','tomioka'],'band_enlightenment_industrial':['factory-reform'],'band_meiji':['tomioka'],'band_world_war_i':['world-war-one'],'band_world_war_ii':['world-war-two'],'band_world_wars':['world-war-one','world-war-two'],'band_cold_war':['sputnik'],'band_apartheid':['south-africa-rights'],'band_decolonization':['partition-1947','south-africa-rights'],'band_eastern_polynesia':['polynesian-voyaging']}
journeys={r['id']:r for r in c['journeys']}
tours={'tour_bronze_collapse':'networks-disruption','tour_axial_age':'voices-power','tour_rome_han':'world-200','tour_industrial':'machines-work','tour_decolonization':'promises-rights','tour_columbian':'ocean-connections','tour_atlantic':'ocean-connections','tour_islamic':'institutions-images','tour_silk_roads':'world-200','tour_writing':'cities-evidence','tour_religion':'institutions-images','tour_seas':'knowledge-networks','tour_cities':'cities-evidence'}
for group in ['polities','relations','callouts','bands','routes','tours']:
 for p in sorted(glob.glob(f'src/data/{group}/*.json')):
  for r in json.load(open(p)):
   id=r['id']; title=r.get('name',r.get('title',id)); targets=[];disposition='excluded'
   if group=='polities':
    if id in identity:
     targets=identity[id];disposition='merged';reason='Eastern Roman/Byzantine naming reconciled under a sourced conventional330–1453 frame with1204–1261 interruption. Inherited395–476 span rejected; no display clipping changes the historical dates.'
    elif id in splits:
     targets=splits[id];disposition='split';reason='Composite label separated into defined researched contexts where available. Unrepresented portions remain excluded from release, not silently absorbed into the replacement. No common identity or succession inferred.'
    elif id in replacements:
     targets=replacements[id];disposition='replaced';reason='Replaced by a newly researched investigation with its own narrower or corrected definition, chronology and claim-specific citations. Legacy prose/dates/quantities are not promoted; this is a related entry, not equivalence to the entire inherited entity.'
    else:
     reason=f'No claim-level research package suitable for this local release for {title}. Inherited unverified material is preserved as research but excluded from the teaching build. Exclusion is a coverage limit, not a claim the subject did not exist or was unimportant.'
    if id=='haudenosaunee':reason='Related replacement: a precisely sourced 1794 treaty and 1795 U.S. ratification investigation, not a researched lifespan or founding date for the whole Confederacy. Legacy dates/prose are not promoted; 1795 does not end the nations or their promises.'
    if id=='iroquois_indigenous_nations':reason='The composite Haudenosaunee & First Nations label is not one canonical people or state. Separate Haudenosaunee, Wendat and Ojibwe investigations are related examples, not an exhaustive partition or common identity. Other peoples remain outside this replacement; no shared genealogy or legacy date span is inherited.'
    links[id]={'name':title,'target':targets[0] if targets else None,'disposition':disposition,'reason':reason,'pack':subjects[targets[0]]['packs'][0] if targets else None,'region':subjects[targets[0]]['region'] if targets else None,'start':subjects[targets[0]]['interval']['start'] if targets else None,'end':subjects[targets[0]]['interval']['end'] if targets else None}
   elif group=='relations':
    generated=id.startswith(('overlap_','abut_')) or 'Pages were not opened' in str(r) or 'same-family' in str(r)
    reason=('Generated from overlap, adjacent dates or family membership; these establish no historical succession, influence or contact. Quarantined without asserting the proposed connection false.' if generated else 'Inherited relationship lacks a consulted claim-specific evidence package. Endpoints, type and route are not promoted by the release compiler; any new connection is independently sourced.')
   elif group=='callouts':
    legacy_targets=[r.get('polityId'),r.get('targetId'),r.get('anchorId')]
    for k in legacy_targets:targets+=replacements.get(k,identity.get(k,[]))
    disposition='replaced' if targets else 'excluded'
    reason='Inherited event/callout prose, dates and quantities are unverified and are not promoted. Where a researched related dossier exists it is listed separately; contextual association does not verify the original event claim.'
   elif group=='bands':
    targets=related_bands.get(id,[]);disposition='converted to period' if targets else 'excluded'
    reason=('Replaced by bounded, sourced investigations with explicit definitions. A thematic band is not a universal historical stage and no global climate/causation or shared endpoint is inherited.' if targets else 'No released claim-level evidence package supports this inherited thematic/global band. Its boundaries and quantitative implications are excluded; preserved for research, not used to fill the chart.')
   elif group=='routes':
    if id=='route_silk_road':targets=['palmyra-network'];disposition='replaced'
    elif id=='route_bronze_trade':targets=['uluburun'];disposition='replaced'
    elif id=='route_trans_saharan':targets=['mali-networks'];disposition='replaced'
    elif id=='route_austronesian':targets=['lapita','polynesian-voyaging'];disposition='split'
    reason='Legacy waypoints and date envelopes are not documented itineraries. Use separately researched network/cargo/navigation evidence where listed; no inherited polyline or implication of direct contact is retained.'
   elif group=='tours':
    target=tours.get(id);targets=[target] if target else [];disposition='replaced' if target else 'excluded'
    reason='Inherited narrative and waypoint claims are not promoted. Listed authored journey uses visible subjects, sourced explanation and reasoning feedback with a distinct scope; it is not a claim-by-claim validation of the old tour.'
   for target in targets:
    if target not in subjects and target not in journeys and not any(x['id']==target for x in c['relations']):raise Exception(target)
   rows.append({'type':group,'id':id,'title':title,'sourceFile':p,'sha256':hashlib.sha256(json.dumps(r,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest(),'disposition':disposition,'targets':targets,'reason':reason,'releaseStatus':'researched replacement only' if targets else 'not included','review':'Codex source-model/self-review; not independent historian approval'})
keys=[(r['type'],r['id']) for r in rows];assert len(set(keys))==len(keys)
assert len(rows)==1274,len(rows)
out=pathlib.Path('output/redesign/manifests');out.mkdir(parents=True,exist_ok=True)
(out/'legacy-disposition.json').write_text(json.dumps(rows,indent=2,ensure_ascii=False))
(out/'legacy-summary.json').write_text(json.dumps({'total':len(rows),'types':dict(collections.Counter(r['type'] for r in rows)),'dispositions':dict(collections.Counter(r['disposition'] for r in rows))},indent=2))
pathlib.Path('public/atlas/legacy-links.json').write_text(json.dumps(links,ensure_ascii=False))
pathlib.Path('public/atlas/legacy-disposition.json').write_text(json.dumps(rows,ensure_ascii=False))
# Compact redirect metadata only for researched replacements. Unknown IDs are handled explicitly.
pathlib.Path('src/atlas/legacy-targets.json').write_text(json.dumps({k:v for k,v in links.items() if v['target']},indent=2,ensure_ascii=False)+'\n')
print('Accounted for',len(rows),'legacy records; all source records preserved.')
