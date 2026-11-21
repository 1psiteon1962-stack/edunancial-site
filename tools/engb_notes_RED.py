import re,sys
p='work/RED-L5-en-GB/b01.txt'; t=open(p).read()
N={
4:"For UK readers: there is no LLC in UK law; a private limited company (Ltd) pays corporation tax on its own profits rather than passing them through, whereas a limited liability partnership (LLP) is generally tax-transparent, and many UK landlords hold property in a limited-company SPV partly because individual landlords can no longer deduct mortgage interest in full against rental income.",
5:"For UK readers: the UK has no equivalent of the US Section 1031 like-kind exchange for investment property; selling a let residential property is normally a chargeable disposal for Capital Gains Tax, with UK residential gains reported and paid to HMRC within 60 days of completion, and business asset rollover relief is limited to qualifying trading assets rather than ordinary buy-to-let property.",
10:"For UK readers: the 1031 exchange discussed here is a US provision with no direct UK equivalent, and UK residential landlords cannot claim depreciation on the building itself.",
14:"For UK readers: opportunity zones are a US programme with no direct UK equivalent; the nearest UK comparisons are designated freeports and investment zones, which offer specific business tax reliefs such as enhanced capital allowances, Stamp Duty Land Tax relief or business rates relief for qualifying activity, so confirm current eligibility with HMRC and the relevant local authority.",
15:"For UK readers: the closest UK equivalents are business rates, where the Valuation Office Agency's Check, Challenge, Appeal process applies in England and Wales, and council tax banding, which can also be challenged with the Valuation Office Agency; Scotland and Northern Ireland have their own assessment bodies and procedures.",
17:"For UK readers: on death, assets are generally treated as acquired by the beneficiaries at market value for Capital Gains Tax purposes, so no Capital Gains Tax arises on the death itself, but Inheritance Tax may be due on estates above the available nil-rate bands, which makes this a genuinely different planning calculation from the US step-up rules.",
19:"For UK readers: the main purchase costs are typically Stamp Duty Land Tax in England and Northern Ireland (Land and Buildings Transaction Tax in Scotland, Land Transaction Tax in Wales), conveyancing fees, searches and a survey.",
24:"For UK readers: UK REITs exist and generally pay property income distributions that are taxed as property income in the hands of investors, usually after basic-rate tax is withheld at source, and REIT shares can be held inside an ISA or pension wrapper, while direct UK ownership carries its own Stamp Duty Land Tax, income tax and Capital Gains Tax considerations.",
30:"For UK readers: the 1031 exchange referred to here is a US provision; in the UK, selling an investment property is normally a chargeable disposal for Capital Gains Tax.",
34:"For UK readers: there is no direct UK equivalent of US real estate professional status; UK property losses are generally carried forward against future profits of the same property business, and the former furnished holiday lettings tax regime was abolished from April 2025.",
41:"For UK readers: UK landlords cannot claim depreciation on residential buildings, but capital allowances on qualifying plant and machinery in commercial property can trigger a balancing charge when the property is sold, and structures and buildings allowance claimed on qualifying non-residential buildings is added to the sale proceeds for Capital Gains Tax, which are the closest UK equivalents of depreciation recapture.",
26:"For UK readers: development generally requires planning permission from the local planning authority, with timescales and procedures that differ between England, Wales, Scotland and Northern Ireland.",
37:"For UK readers: if a dispute with an insurer cannot be resolved through the insurer's own complaints process, many property owners can refer it to the Financial Ombudsman Service free of charge."}
parts=re.split(r'(?m)^(?====== )',t)
out=[]
for ch in parts:
    m=re.match(r'===== \S+-(\d{3})',ch)
    if m and int(m.group(1)) in N:
        n=int(m.group(1)); a=ch.index('## Core Content'); b=ch.index('\n## ',a+5)
        sec=ch[a:b]; paras=sec.split('\n\n')
        i=next((k for k,x in enumerate(paras) if 'REGION-SPECIFIC RULE' in x),len(paras)-1)
        if i==0: i=len(paras)-1
        paras[i]=paras[i].rstrip()+' '+N[n]
        ch=ch[:a]+'\n\n'.join(paras)+ch[b:]
    out.append(ch)
open(p,'w').write(''.join(out)); print('ok')
