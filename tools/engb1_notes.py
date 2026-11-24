#!/usr/bin/env python3
# engb1_notes.py COLOR -> append UK reader notes at end of Core Content in work/<C>-L1-en-GB/b01.txt
import re,sys
C=sys.argv[1]; p=f'work/{C}-L1-en-GB/b01.txt'; t=open(p,encoding='utf-8').read()
U='For UK readers: '
N={'PURPLE':{
2:"the UK has more than one legal system: England and Wales and Northern Ireland use the common law tradition, while Scotland has a mixed system drawing on both civil law and common law, so the rules that apply can depend on where you are.",
4:"in England and Wales a binding contract generally needs offer, acceptance, consideration and an intention to create legal relations, while Scots law does not require consideration, so check which law governs your agreement.",
5:"in England and Wales some agreements must be in writing to be enforceable, such as contracts for the sale of land and guarantees, so take advice before relying on a spoken promise for anything important.",
9:"UK civil cases are decided on the 'balance of probabilities', while criminal cases require proof beyond reasonable doubt, often explained to juries as being sure of guilt.",
13:"the closest common equivalent to a US LLC is the private limited company (Ltd), registered at Companies House, and some professional firms use a limited liability partnership (LLP); formation, filing and tax rules differ, so check GOV.UK or an adviser.",
16:"UK courts set aside the separate identity of a company only in narrow circumstances, such as where the company is used to evade an existing legal obligation, so this outcome is rarer than in some US states, but directors can still face personal liability in other ways.",
17:"in the UK many licences are issued by the local council (for example for food businesses, alcohol or street trading), while some sectors are licensed nationally, so check GOV.UK's licence finder for your activity and area.",
18:"key UK protections come from laws such as the Employment Rights Act 1996 and the Equality Act 2010, and employment status (employee, worker or self-employed) affects which rights apply, so check ACAS guidance or take advice.",
19:"UK courts generally enforce a non-compete only if it protects a legitimate business interest and is no wider than reasonably necessary in time, area and scope, and the rules may change, so take advice before signing or relying on one.",
20:"UK trade marks, patents and registered designs are registered with the Intellectual Property Office (IPO), while copyright arises automatically and is not registered.",
22:"most land in England and Wales is registered at HM Land Registry, and ownership is transferred by a deed (often a standard transfer form) followed by registration of the new owner.",
23:"title insurance is used less often in England and Wales because most land is registered and the register is state-backed, but it is sometimes taken out for specific defects; a solicitor or licensed conveyancer normally checks title.",
25:"landlord and tenant rules differ across England, Wales, Scotland and Northern Ireland and have been changing through recent reforms, so check GOV.UK or your national housing authority for the current rules.",
28:"in England and Wales a property purchase usually becomes binding only at 'exchange of contracts', before which either side can generally withdraw without penalty.",
29:"the UK equivalent of closing is 'completion', when the money is transferred and the buyer receives the keys, followed by registration at HM Land Registry and payment of any Stamp Duty Land Tax (or the devolved equivalent in Scotland and Wales).",
30:"in the UK a lender normally needs a court possession order to repossess a home, and lenders are expected to follow a pre-action protocol and consider alternatives first, so seek free debt advice early if you fall behind.",
31:"UK investments are mainly regulated by the Financial Conduct Authority (FCA) under the Financial Services and Markets Act 2000.",
33:"the UK uses categories such as certified high net worth and sophisticated investors under FCA rules, which affect which riskier investments can be promoted to you; check your category and the firm's authorisation on the FCA register.",
35:"insider dealing is a criminal offence under the Criminal Justice Act 1993, and the FCA also enforces civil market abuse rules.",
36:"anyone giving regulated financial advice in the UK must be authorised by the FCA, which also requires firms to deliver good outcomes for retail customers; check the FCA register before using an adviser.",
38:"the main UK financial regulators are the Financial Conduct Authority (FCA), which regulates conduct, and the Prudential Regulation Authority (PRA), part of the Bank of England, which supervises banks and insurers.",
43:"trusts are long established in England and Wales, and many trusts must be registered with HMRC's Trust Registration Service; trusts can have tax consequences, so take advice from a solicitor or tax adviser.",
44:"the UK equivalent is usually a Lasting Power of Attorney (in England and Wales), which must be registered with the Office of the Public Guardian before it can be used; Scotland and Northern Ireland have their own rules.",
45:"in England and Wales the Limitation Act 1980 generally gives six years for contract and most tort claims and three years for personal injury, with exceptions; Scotland uses different periods, so take advice promptly.",
47:"UK 'no win, no fee' arrangements (conditional fee agreements and damages-based agreements) are allowed with legal limits, and fee rules differ for some types of case.",
48:"in England and Wales most smaller claims go to the county court's small claims track, which generally covers claims up to £10,000 and limits the legal costs you can recover; Scotland and Northern Ireland have their own procedures.",
},'GOLD':{
5:"in the UK this approach is often called pound-cost averaging.",
26:"in the UK, items held in a bank safe deposit box are not covered by the Financial Services Compensation Scheme (FSCS), which protects eligible deposits, so check what insurance applies.",
32:"many UK home contents policies cap cover for cash, coins and bullion unless items are specified separately, so check the policy wording with your insurer or broker.",
35:"there is no special collectibles rate; gains are generally subject to Capital Gains Tax above the annual exempt amount, and UK legal-tender gold coins such as Sovereigns and Britannias are generally exempt, so check current HMRC guidance or an adviser.",
37:"products that hold or track gold are often called exchange-traded commodities (ETCs) in the UK, and some can be held in a stocks and shares ISA depending on the product and provider.",
}}[C]
parts=re.split(r'(?m)^(?====== )',t); out=[]
for ch in parts:
    m=re.match(r'===== \S+-(\d{3})',ch)
    if m and int(m.group(1)) in N:
        ch,k=re.subn(r'\n(## Worked Example)',lambda x:'\n'+U+N[int(m.group(1))]+'\n\n'+x.group(1),ch,count=1)
        assert k==1,m.group(1)
    out.append(ch)
open(p,'w',encoding='utf-8').write(''.join(out)); print('notes',len(N))
