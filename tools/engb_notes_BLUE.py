import re
p='work/BLUE-L5-en-GB/b01.txt'; t=open(p).read()
N={
3:"For UK readers: there is no direct UK equivalent of the US SBA loan programme; buyers commonly combine high-street bank lending, asset-based finance, vendor (seller) finance and sometimes the government-backed British Business Bank schemes delivered through accredited lenders, so check which schemes are currently open.",
4:"For UK readers: the usual choices are sole trader, partnership, limited liability partnership (LLP) and private limited company; a limited company pays Corporation Tax on its profits and owners are then taxed on salary and dividends, so confirm the current rates with HMRC guidance or an accountant.",
5:"For UK readers: on a share sale, deferred and earn-out consideration can raise complex Capital Gains Tax timing questions, and Business Asset Disposal Relief may reduce the rate on qualifying gains up to a lifetime limit, so take specialist tax advice before agreeing the structure.",
15:"For UK readers: the UK has a wide network of double taxation agreements, and a UK company trading abroad may create a taxable 'permanent establishment' in the other country, so check the relevant treaty and local rules before expanding.",
17:"For UK readers: owner-directors of limited companies often combine a modest salary with dividends, because dividends are not subject to National Insurance but are taxed at dividend rates after a small allowance; the best mix changes with the rates each tax year, so review it with an accountant.",
19:"For UK readers: the Enterprise Management Incentive (EMI) scheme lets qualifying smaller companies grant tax-advantaged share options to key employees, and growth shares are another common route, so check eligibility with an adviser.",
24:"For UK readers: business owners often use a holding company above one or more trading companies, and qualifying trading businesses may attract Business Property Relief from Inheritance Tax, though the rules on trusts and on this relief are changing, so take specialist advice.",
25:"For UK readers: new technologies such as artificial intelligence and cryptoassets are increasingly covered by UK rules, including data protection law under the UK GDPR and Financial Conduct Authority rules on cryptoasset promotions.",
28:"For UK readers: group structures can allow losses to be shared between UK companies under group relief, and dividends paid between UK companies are generally exempt, but associated-company rules can affect the Corporation Tax rate, so confirm the position with an accountant.",
34:"For UK readers: the UK has no 'material participation' test; instead, whether you are trading, and reliefs such as Business Asset Disposal Relief, depend on factors like being an officer or employee and holding at least 5% of the company, so check the conditions with HMRC guidance.",
35:"For UK readers: UK businesses trading abroad need to consider VAT and customs rules after Brexit, foreign-currency accounts with their bank, and the relevant double taxation agreement.",
37:"For UK readers: business interruption cover is usually an add-on to a commercial property policy, and its indemnity period and the definition of 'damage' matter a great deal, as many disputes during the pandemic showed.",
41:"For UK readers: on an asset sale, capital allowances already claimed can be clawed back through a balancing charge, which works much like US depreciation recapture, while a share sale may qualify for Business Asset Disposal Relief, so compare both routes with an accountant."}
parts=re.split(r'(?m)^(?====== )',t); out=[]
for ch in parts:
    m=re.match(r'===== \S+-(\d{3})',ch)
    if m and int(m.group(1)) in N:
        n=int(m.group(1)); a=ch.index('## Core Content'); b=ch.index('\n## ',a+5)
        paras=ch[a:b].split('\n\n')
        i=next((k for k,x in enumerate(paras) if 'REGION-SPECIFIC RULE' in x),len(paras)-1)
        if i==0: i=len(paras)-1
        paras[i]=paras[i].rstrip()+' '+N[n]
        ch=ch[:a]+'\n\n'.join(paras)+ch[b:]
    out.append(ch)
open(p,'w').write(''.join(out)); print('ok')
