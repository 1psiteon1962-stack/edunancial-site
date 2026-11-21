import re,sys,os,zipfile
src,C,loc,out=sys.argv[1:5]
TAGS={'de':('BEISPIEL ZUR VERANSCHAULICHUNG','LÄNDERSPEZIFISCHE REGEL'),
'it':('ESEMPIO ILLUSTRATIVO','REGOLA SPECIFICA PER REGIONE'),
'nl':('ILLUSTRATIEF VOORBEELD','REGIOSPECIFIEKE REGEL'),
'pt-PT':('EXEMPLO ILUSTRATIVO','REGRA ESPECÍFICA DA REGIÃO'),
'pt-BR':('EXEMPLO ILUSTRATIVO','REGRA ESPECÍFICA DA REGIÃO'),
'fr-FR':('EXEMPLE ILLUSTRATIF','RÈGLE PROPRE À LA RÉGION')}
TRACK={'GREEN':'Taxes'}
z=zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)
for n in range(1,51):
    lid=f'{C}-L1-{n:03d}'
    t=open(f'{src}/{lid}.md',encoding='utf-8').read()
    fm,body=t.split('\n---\n',1); fm=fm.lstrip('-\n')
    g=lambda k:(re.search(rf'^{k}: "?(.*?)"?$',fm,re.M) or [None,''])[1]
    assert g('id')==lid and g('locale')==loc,(lid,g('id'),g('locale'))
    title=g('title'); summ=g('description')
    body=body.lstrip('\n')
    body=re.sub(rf'^# {lid}:\s*',r'# ',body,count=1,flags=re.M)
    il,rr=TAGS[loc]
    body=body.replace('[ILLUSTRATIVE EXAMPLE]',f'[{il}]').replace('[REGION-SPECIFIC RULE]',f'[{rr}]')
    assert not re.search(r'\[[A-Z][A-Z -]+\]',body.replace(f'[{il}]','').replace(f'[{rr}]','')),lid
    q=lambda s:s.replace('"','\\"')
    head=f'---\nid: {lid}\ntrack: {C}\nofficialTrackName: {TRACK[C]}\nlevel: 1\nlessonNumber: {n}\nlocale: {loc}\ntitle: "{q(title)}"\nsummary: "{q(summ)}"\nversion: 1.0\nauthor: Waldemar M. Caban, JD MA\ndate: 2026-09-24\n---\n\n'
    z.writestr(f'{lid}.{loc}.md',head+body.rstrip()+'\n')
z.close(); print(out,'ok')
