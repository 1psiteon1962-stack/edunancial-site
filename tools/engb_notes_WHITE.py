import re
p='work/WHITE-L5-en-GB/b01.txt'; t=open(p).read()
N={
5:"For UK readers: the UK has no 'wash-sale' rule as such, but share matching rules apply for Capital Gains Tax: shares sold and repurchased within 30 days are generally matched with the repurchase rather than the original holding (the 'bed and breakfasting' rule), so many investors instead repurchase inside an ISA or buy a similar but not identical fund; the annual Capital Gains Tax exempt amount is currently small, so confirm current rules with HMRC guidance.",
12:"For UK readers: the closest UK comparison is between a pension (such as a workplace pension or SIPP), where contributions generally receive tax relief and withdrawals are largely taxed as income apart from a tax-free portion, and an ISA, where contributions come from taxed income but growth and withdrawals are tax-free, broadly similar to the traditional-versus-Roth trade-off described here.",
13:"For UK readers: pension benefits usually pass according to an expression-of-wish form held by the scheme rather than by your will, and the government has announced that most unused pension funds are to come within the scope of Inheritance Tax from April 2027, so confirm the current position before relying on any particular plan.",
15:"For UK readers: UK investors buying overseas shares or funds face currency risk against sterling, and holding certain non-UK funds without 'reporting fund' status can cause gains to be taxed as income rather than as capital gains.",
17:"For UK readers: dividends above a small tax-free dividend allowance are taxed at dividend rates that depend on your income tax band, while dividends received inside an ISA or pension are not taxed.",
19:"For UK readers: many UK employers offer tax-advantaged share schemes such as Save As You Earn (SAYE) and Share Incentive Plans (SIP), which can make it easy to build a concentrated holding in your employer's shares without noticing.",
22:"For UK readers: in the UK, a lifetime annuity is most commonly bought with pension savings, and the income it pays is generally taxed as income.",
23:"For UK readers: the UK has no direct equivalent of US tax-exempt municipal bonds; the closest UK consideration is that gains on gilts and many qualifying corporate bonds are generally exempt from Capital Gains Tax, while the interest is taxable unless held inside an ISA or pension.",
24:"For UK readers: UK trusts are subject to their own Inheritance Tax regime, which can include charges when assets go into many types of trust and periodic charges every ten years, so trust planning for investment portfolios generally needs specialist advice.",
25:"For UK readers: HMRC generally treats cryptoassets as property for Capital Gains Tax purposes, and the Financial Conduct Authority regulates how cryptoassets may be promoted to UK consumers, though most cryptoassets are not covered by the Financial Services Compensation Scheme.",
28:"For UK readers: the main UK wrappers to consider for asset location are the ISA, pensions such as a SIPP or workplace scheme, and an ordinary taxable general investment account.",
34:"For UK readers: the UK has no formal trader tax status; whether frequent dealing amounts to a taxable trade is judged on HMRC's 'badges of trade', and most private investors are taxed under Capital Gains Tax rather than income tax.",
35:"For UK readers: UK residents holding US shares usually complete a W-8BEN form so that US withholding tax on dividends is reduced under the UK-US tax treaty, and foreign tax already paid can generally be credited against UK tax on the same income.",
38:"For UK readers: financial advisers are authorised and regulated by the Financial Conduct Authority, must explain whether their advice is independent or restricted, and must disclose their charges; the FCA's Consumer Duty also requires firms to deliver fair value.",
41:"For UK readers: UK funds come in income and accumulation units, and reinvested income in accumulation units is still generally taxable each year outside an ISA or pension."}
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
