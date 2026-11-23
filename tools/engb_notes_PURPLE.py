import re
p='work/PURPLE-L5-en-GB/b01.txt'; t=open(p).read()
U='For UK readers: '
NOTES={
1:"the UK has three separate legal systems (England and Wales, Scotland, and Northern Ireland), so company, property and succession rules can differ depending on where you live, and a solicitor in the right part of the UK should confirm how they apply to you.",
2:"most small businesses use a private limited company registered at Companies House or a limited liability partnership (LLP), and an LLP is usually taxed as a partnership while a company pays Corporation Tax, so check the choice with an accountant.",
3:"payments between connected companies or between a company and its owners can be challenged by HMRC under transfer pricing or 'settlements' rules, and loans to participators in a close company can trigger a tax charge, so check the arrangements with an accountant.",
4:"moving property into a company is usually treated as a sale at market value, so it can trigger Stamp Duty Land Tax (or the Scottish or Welsh equivalent) and Capital Gains Tax, and the transfer must be registered at HM Land Registry, so take advice from a solicitor and an accountant first.",
5:"when a company's articles of association or an LLP agreement are silent, the Companies Act 2006 model articles or the default rules for LLPs fill the gaps, which may not suit your business, so have a solicitor review the documents.",
8:"life insurance used to fund a buy-sell agreement is often written in trust so the payout does not form part of the estate for Inheritance Tax, but the buyout itself can have Capital Gains Tax consequences, so check the structure with an adviser.",
9:"there is no general homestead exemption as in some US states; a creditor can seek a charging order over your home, though a spouse or civil partner may have rights of occupation, so take advice from a solicitor or insolvency practitioner.",
10:"UK courts only 'pierce the corporate veil' in narrow cases where a company is used to evade an existing legal obligation, but directors can still be personally liable for wrongful or fraudulent trading, so take legal advice if a company is struggling.",
11:"in England and Wales a will must be signed in front of two witnesses, and the estate usually needs a grant of probate (or confirmation in Scotland) before assets can be released, so a solicitor should check both the will and the process.",
12:"trusts are taxed under their own rules, with many relevant property trusts facing Inheritance Tax charges on creation, every ten years and on exit, and most trusts must be registered with HMRC's Trust Registration Service, so take advice before setting one up.",
13:"co-owners in England and Wales hold property either as joint tenants, where the survivor takes the whole share, or as tenants in common, where each share passes under the owner's will, so check how your property is held at HM Land Registry.",
14:"pensions such as workplace schemes and SIPPs pass according to the scheme's nomination rules rather than your will, and their Inheritance Tax treatment has been changing, so keep your expression-of-wish forms up to date and check the current rules with an adviser.",
15:"selling shares can qualify for Business Asset Disposal Relief on part of the gain if conditions are met, while employee ownership trusts have their own tax rules, so check the options with an accountant before agreeing a structure.",
16:"transfers made to put assets out of creditors' reach can be set aside under the Insolvency Act 1986 as transactions at an undervalue or as transactions defrauding creditors, so asset protection planning should be done early and with legal advice.",
17:"insurers and brokers are regulated by the Financial Conduct Authority, and you can check a firm on the FCA register and complain to the Financial Ombudsman Service if a claim goes wrong, so keep your policy documents and correspondence.",
18:"landlords in England must meet repair duties under the Landlord and Tenant Act 1985 and fitness standards, and tenants can only be evicted through the courts after the correct notice, so check the current rules with a solicitor or the local council.",
19:"most UK pension rights are generally protected from creditors in bankruptcy, but excessive contributions made to avoid creditors can be challenged, so check your position with an insolvency practitioner.",
20:"prenuptial agreements are not automatically binding in England and Wales but courts often give them weight if they are fair and both parties took independent advice, and Scotland has different rules, so speak to a family law solicitor.",
21:"payments under a warranty or indemnity in a share purchase agreement are often treated as an adjustment to the price for Capital Gains Tax, so check the tax treatment with an accountant before you sign.",
22:"many activities need licences or planning permission from the local council, and exports of controlled goods may need a licence from the Export Control Joint Unit, so check the rules that apply to your sector.",
23:"gains on selling shares are subject to Capital Gains Tax, and reliefs such as Business Asset Disposal Relief or investors' relief may reduce the rate if conditions are met, so confirm the current rates and conditions with HMRC guidance or an accountant.",
24:"a mortgage over land in England and Wales is created as a legal charge and must be registered at HM Land Registry, while Scotland uses a standard security, so a solicitor should handle the registration.",
25:"buyers in England and Wales usually agree a price subject to contract and are only bound when contracts are exchanged with a deposit, with completion later, while Scotland uses a system of missives, so let a solicitor or licensed conveyancer manage the steps.",
26:"capital allowances may be available on certain fixtures and improvements, and a landlord's contribution to a tenant's fit-out can have tax consequences for both sides, so check the treatment with an accountant.",
27:"evicting a tenant for unpaid rent requires the correct notice and a court order, and short-term lettings may need planning permission or registration with the local council, so check the current rules where the property is.",
28:"companies may claim research and development tax relief, and the Patent Box can lower Corporation Tax on qualifying profits from patents, so check eligibility with an accountant or patent attorney.",
29:"you can register a trade mark with the UK Intellectual Property Office and ask HM Revenue and Customs to detain suspected counterfeit goods at the border, so speak to a trade mark attorney about protecting your brand.",
30:"commercial agents may be entitled to compensation or an indemnity when an agency ends under the Commercial Agents Regulations, while distributors generally are not, so a solicitor should review the contract before you end it.",
31:"employment status is decided by the facts of the working relationship, and off-payroll working (IR35) rules can make the business responsible for tax on contractors, so check status with HMRC guidance or an employment lawyer.",
32:"courts in England and Wales only enforce a non-compete clause if it protects a legitimate business interest and is no wider than reasonably necessary, and the government has proposed limits on their length, so check the current position with an employment lawyer.",
33:"offering shares to the public is regulated under the Financial Services and Markets Act 2000, and financial promotions generally must be approved by an FCA-authorised firm, so take advice before raising money from investors.",
34:"equity crowdfunding usually takes place on platforms authorised by the Financial Conduct Authority, and investors may qualify for tax relief under the SEIS or EIS schemes if conditions are met, so check the rules before you invest or raise money.",
35:"misleading advertising is regulated by the Advertising Standards Authority and consumer protection law, with the Competition and Markets Authority able to take action, so check claims against the CAP Code before publishing them.",
36:"direct marketing by email is governed by the Privacy and Electronic Communications Regulations and UK GDPR, and serious personal data breaches must usually be reported to the Information Commissioner's Office within 72 hours, so check your obligations with the ICO.",
38:"English courts generally respect the governing law and jurisdiction chosen in a commercial contract, and the UK is party to the New York Convention on enforcing arbitration awards, so ask a solicitor to check the clauses.",
39:"English law has no general doctrine of force majeure, so relief usually depends on an express clause in the contract or the narrow doctrine of frustration, so have a solicitor review the wording.",
40:"many business disputes can go to the County Court or the High Court, and the courts expect parties to consider mediation or other alternative dispute resolution before going to trial, so seek advice on the best route.",
41:"in England and Wales the losing party is usually ordered to pay a large part of the winner's legal costs, so the risk of an adverse costs order should be weighed before starting or defending a claim.",
42:"financial advisers must be authorised by the Financial Conduct Authority and are subject to the Consumer Duty to deliver good outcomes for customers, so check an adviser on the FCA register before engaging them.",
43:"companies must file a confirmation statement and annual accounts at Companies House, and failing to do so can lead to penalties and the company being struck off, so keep track of the filing deadlines.",
44:"families often use a family investment company or a trust to hold assets, each with different tax and control consequences, and gifts can fall within Inheritance Tax for seven years, so take advice from a solicitor and an accountant.",
45:"donations to registered charities can qualify for Gift Aid, and gifts to charities on death can reduce Inheritance Tax, so check a charity's registration with the Charity Commission and the current rules with an adviser.",
46:"most claims for breach of contract or negligence must be brought within six years under the Limitation Act 1980, with some claims shorter, and Scotland has different periods, so take legal advice early.",
48:"a new decision of the Supreme Court or the Court of Appeal can change how a law is interpreted while a case is still running, so ask your solicitor how recent case law could affect your position.",
49:"courts can penalise a party who litigates unreasonably, including by ordering costs on an indemnity basis, so follow the pre-action protocols and take advice before issuing a claim."}
parts=re.split(r'(?m)^(?====== )',t); out=[]; k=0
for ch in parts:
    m=re.match(r'===== \S+-(\d{3})',ch)
    if m and int(m.group(1)) in NOTES:
        n=int(m.group(1)); a=ch.index('## Core Content'); b=ch.index('\n## ',a+5)
        paras=ch[a:b].split('\n\n')
        i=next((k2 for k2,x in enumerate(paras) if 'REGION-SPECIFIC RULE' in x),len(paras)-1)
        if i==0: i=len(paras)-1
        paras[i]=paras[i].rstrip()+' '+U+NOTES[n]; k+=1
        ch=ch[:a]+'\n\n'.join(paras)+ch[b:]
    out.append(ch)
open(p,'w').write(''.join(out)); print('ok',k,len(NOTES))
