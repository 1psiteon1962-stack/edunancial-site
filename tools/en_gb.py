import re,sys,glob,os,json
W={'organization':'organisation','organizations':'organisations','organizational':'organisational','organize':'organise','organized':'organised','organizing':'organising','organizes':'organises',
'prioritize':'prioritise','prioritized':'prioritised','prioritizing':'prioritising','prioritizes':'prioritises','recognize':'recognise','recognized':'recognised','recognizing':'recognising','recognizes':'recognises',
'realize':'realise','realized':'realised','realizing':'realising','realizes':'realises','emphasize':'emphasise','emphasized':'emphasised','emphasizes':'emphasises','emphasizing':'emphasising',
'summarize':'summarise','summarized':'summarised','summarizes':'summarises','apologize':'apologise','apologized':'apologised','criticize':'criticise','criticized':'criticised','criticizing':'criticising',
'minimize':'minimise','minimized':'minimised','minimizing':'minimising','maximize':'maximise','maximized':'maximised','maximizing':'maximising','standardize':'standardise','standardized':'standardised',
'analyze':'analyse','analyzed':'analysed','analyzing':'analysing','analyzes':'analyses','utilize':'utilise','utilized':'utilised','optimize':'optimise','optimized':'optimised','optimizing':'optimising',
'behavior':'behaviour','behaviors':'behaviours','behavioral':'behavioural','color':'colour','colors':'colours','favor':'favour','favorable':'favourable','favorite':'favourite','honor':'honour','honest':'honest',
'labor':'labour','center':'centre','centers':'centres','centered':'centred','defense':'defence','offense':'offence','fulfill':'fulfil','fulfilling':'fulfilling','enroll':'enrol','enrollment':'enrolment',
'judgment':'judgement','judgments':'judgements','traveling':'travelling','traveled':'travelled','canceled':'cancelled','canceling':'cancelling','labeled':'labelled','labeling':'labelling','modeling':'modelling','modeled':'modelled',
'counseling':'counselling','counselor':'counsellor','skillful':'skilful','program':'programme','programs':'programmes','catalog':'catalogue','dialog':'dialogue','license':'licence','practicing':'practising',
'mentoring':'mentoring','percent':'per cent','gray':'grey','neighborhood':'neighbourhood','endeavor':'endeavour','rumor':'rumour','vigor':'vigour','harbor':'harbour','authorize':'authorise','authorized':'authorised',
'characterize':'characterise','characterized':'characterised','familiarize':'familiarise','capitalize':'capitalise','capitalized':'capitalised','specialize':'specialise','specialized':'specialised','incentivize':'incentivise',
'mobilize':'mobilise','mobilized':'mobilised','stabilize':'stabilise','visualize':'visualise','energize':'energise','sympathize':'sympathise','synchronize':'synchronise','jeopardize':'jeopardise','legitimize':'legitimise',
'paycheck':'pay packet','paychecks':'pay packets','vacation':'holiday','vacations':'holidays','résumé':'CV','resume':'CV'}
def case(src,dst): return dst.upper() if src.isupper() else (dst[0].upper()+dst[1:] if src[0].isupper() else dst)
pat=re.compile(r'\b('+'|'.join(sorted(map(re.escape,W),key=len,reverse=True))+r')\b',re.I)
def conv(t):
    t=pat.sub(lambda m: case(m.group(0),W[m.group(0).lower()]),t)
    t=re.sub(r'\$(\d)',r'£\1',t)
    t=re.sub(r'\bdollars?\b',lambda m:'pounds' if m.group(0).endswith('s') else 'pound',t)
    return t
repo=sys.argv[1]; n=0
for p in sorted(glob.glob(f'{repo}/content/curriculum/BLACK/L1/BLACK-L1-0[0-9][0-9].md')):
    t=open(p,encoding='utf8').read()
    m=re.match(r'^---\n(.*?)\n---\n',t,re.S); fm,body=m.group(1),t[m.end():]
    fm=re.sub(r'(?m)^(title|summary):\s*(.+)$',lambda mm: mm.group(1)+': '+conv(mm.group(2)),fm)
    fm=fm.rstrip()+'\nlocale: en-GB\nsource_locale: en-US'
    out=f'---\n{fm}\n---\n'+conv(body)
    open(p[:-3]+'.en-GB.md','w',encoding='utf8').write(out); n+=1
print('written',n)
