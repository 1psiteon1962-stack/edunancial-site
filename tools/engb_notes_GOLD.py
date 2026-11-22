import re
p='work/GOLD-L5-en-GB/b01.txt'; t=open(p).read()
NOTES={
4:"For UK readers: many home contents policies cap cover for cash, coins and bullion at a low amount unless items are specified separately, and items in a bank safe deposit box are not automatically insured by the bank, so check the policy wording with your insurer or broker.",
9:"For UK readers: the government issues index-linked gilts tied to inflation, and gains on gilts are generally free of Capital Gains Tax while interest and inflation uplift can be taxable as income, and certain UK legal-tender gold coins are exempt from Capital Gains Tax, so check the current rules with HMRC guidance or an adviser.",
11:"For UK readers: many private equity and hedge fund products can only be promoted to certified high net worth or sophisticated investors under Financial Conduct Authority rules, so confirm your category and the firm's authorisation on the FCA register before investing.",
15:"For UK readers: anyone entering or leaving Great Britain carrying £10,000 or more in cash, including gold coins and bullion treated as cash, must declare it to HM Revenue and Customs, and investment gold is generally exempt from VAT, so check the current rules before you travel.",
28:"For UK readers: a self-invested personal pension (SIPP) can usually hold investment-grade gold bullion through an approved custodian but not coins or collectables, and an ISA generally cannot hold physical metal directly, so check what your provider allows.",
30:"For UK readers: there is no special collectibles rate; gains on chattels are subject to Capital Gains Tax above certain limits, some 'wasting' chattels are exempt, and UK legal-tender gold coins such as Sovereigns and Britannias are exempt, so check the rules before selling.",
34:"For UK readers: HMRC uses the 'badges of trade' to decide whether frequent buying and selling is a trade taxed as income or investment taxed as capital gains, looking at factors such as frequency, how long items are held and the intention behind them, so take advice if you trade regularly.",
35:"For UK readers: moving to the UK can allow personal belongings to be brought in free of import duty under Transfer of Residence relief, but bullion and valuables may need to be declared, and the £10,000 cash declaration rule applies at the border, so check with HM Revenue and Customs or a customs agent.",
41:"For UK readers: there is no special higher rate for collectables as in the US; gains on chattels are taxed at normal Capital Gains Tax rates above the chattels limits, and UK legal-tender gold coins are exempt, so confirm the current rates and allowances with HMRC guidance."}
parts=re.split(r'(?m)^(?====== )',t); out=[]
for ch in parts:
    m=re.match(r'===== \S+-(\d{3})',ch)
    if m and int(m.group(1)) in NOTES:
        n=int(m.group(1)); a=ch.index('## Core Content'); b=ch.index('\n## ',a+5)
        paras=ch[a:b].split('\n\n')
        i=next((k for k,x in enumerate(paras) if 'REGION-SPECIFIC RULE' in x),len(paras)-1)
        if i==0: i=len(paras)-1
        paras[i]=paras[i].rstrip()+' '+NOTES[n]
        ch=ch[:a]+'\n\n'.join(paras)+ch[b:]
    out.append(ch)
open(p,'w').write(''.join(out)); print('ok')
