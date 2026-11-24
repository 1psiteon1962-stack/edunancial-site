# engb.py COLOR LEVEL -> work/<C>-<L>-en-GB/b01.txt (auto British draft)
import sys,re,os
C,L=sys.argv[1:3]; R='/home/claude/1psiteon1962-stack/edunancial-site/content/curriculum'
W={'organiz':'organis','recogniz':'recognis','realiz':'realis','analyz':'analys','prioritiz':'prioritis','optimiz':'optimis','minimiz':'minimis','maximiz':'maximis','emphasiz':'emphasis','characteriz':'characteris','summariz':'summaris','specializ':'specialis','categoriz':'categoris','capitaliz':'capitalis','utiliz':'utilis','standardiz':'standardis','authoriz':'authoris','stabiliz':'stabilis','legitimiz':'legitimis','criticiz':'criticis','apologiz':'apologis','memoriz':'memoris','finaliz':'finalis','amortiz':'amortis','incentiviz':'incentivis','monetiz':'monetis','internaliz':'internalis','jeopardiz':'jeopardis','scrutiniz':'scrutinis','generaliz':'generalis','itemiz':'itemis','normaliz':'normalis','visualiz':'visualis','harmoniz':'harmonis','penaliz':'penalis','subsidiz':'subsidis','synchroniz':'synchronis','mobiliz':'mobilis','neutraliz':'neutralis','customiz':'customis','modulariz':'modularis','centraliz':'centralis','decentraliz':'decentralis','sympathiz':'sympathis','familiariz':'familiaris','rationaliz':'rationalis','energiz':'energis','fertiliz':'fertilis'}
X={'behavior':'behaviour','Behavior':'Behaviour','favorable':'favourable','unfavorable':'unfavourable','favor':'favour','Favor':'Favour','labor':'labour','Labor':'Labour','neighbor':'neighbour','Neighbor':'Neighbour','honor':'honour','color':'colour','Color':'Colour','colors':'colours','Colors':'Colours','center':'centre','Center':'Centre','defense':'defence','offense':'offence','license':'licence','catalog':'catalogue','program ':'programme ','programs':'programmes','fulfill ':'fulfil ','fulfillment':'fulfilment','enrollment':'enrolment','installment':'instalment','modeling':'modelling','modeled':'modelled','traveling':'travelling','traveled':'travelled','canceled':'cancelled','canceling':'cancelling','labeled':'labelled','labeling':'labelling','fueled':'fuelled','counseling':'counselling','counselor':'counsellor','judgment':'judgement','analog ':'analogue ','check (':'cheque (','gray':'grey','percent':'per cent','skeptic':'sceptic','meter':'metre','aluminum':'aluminium','apartment':'flat','apartments':'flats','realtor':'estate agent','real estate agent':'estate agent','down payment':'deposit','Down payment':'Deposit','mortgage loan':'mortgage','zoning':'planning','Zoning':'Planning','property taxes':'council tax and business rates','vacation':'holiday','neighborhood':'neighbourhood','Neighborhood':'Neighbourhood'}
def gb(s):
    for a,b in W.items(): s=re.sub(r'\b'+a+r'(e|es|ed|ing|ation|ations|er|ers)\b',lambda m:b+m.group(1),s); s=re.sub(r'\b'+a.capitalize()+r'(e|es|ed|ing|ation|ations|er|ers)\b',lambda m:b.capitalize()+m.group(1),s)
    for a,b in X.items(): s=re.sub(r'\b'+re.escape(a.strip())+r'\b',b.strip(),s) if a.strip()==a else s.replace(a,b)
    s=s.replace('flat building','block of flats').replace('flat complex','block of flats').replace('licence','licence')
    s=re.sub(r'\$(\d)',r'£\1',s)
    return s
os.makedirs(f'/home/claude/l5work/work/{C}-{L}-en-GB',exist_ok=True)
out=[]
for i in range(1,51):
    lid=f'{C}-{L}-{i:03d}'; t=open(f'{R}/{C}/{L}/{lid}.md',encoding='utf-8').read()
    g=lambda k:re.search(r'^'+k+r':\s*"?(.*?)"?\s*$',t,re.M).group(1)
    body=t[re.search(r'^# ',t,re.M).start():]
    out.append(f'===== {lid}\nTITLE: {gb(g("title"))}\nSUMMARY: {gb(g("summary"))}\n{gb(body).rstrip()}\n')
open(f'/home/claude/l5work/work/{C}-{L}-en-GB/b01.txt','w',encoding='utf-8').write('\n'.join(out))
