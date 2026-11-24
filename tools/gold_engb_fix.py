import re
p='work/GOLD-L1-en-GB/b01.txt'; t=open(p,encoding='utf-8').read()
R=[('dollar amounts','cash amounts'),('dollar amount','cash amount'),('number of dollars','number of pounds'),('every dollar','every pound'),('Every dollar','Every pound'),('a dollar not','a pound not'),('per dollar spent','per pound spent'),('thousands of dollars','thousands of pounds'),('absolute dollar comparisons','absolute cash comparisons'),
('checking account','current account'),("homeowner's or renter's insurance policies","home insurance policies, whether for homeowners or renters,"),("homeowner's or renter's policy","home insurance policy"),("homeowner's or renter's policies","home insurance policies"),("homeowner's policies","home insurance policies")]
out=[]
for ch in re.split(r'(?m)^(?====== )',t):
    if not re.match(r'===== GOLD-L1-02[124]\n',ch):
        for a,b in R: ch=ch.replace(a,b)
    out.append(ch)
open(p,'w',encoding='utf-8').write(''.join(out))
