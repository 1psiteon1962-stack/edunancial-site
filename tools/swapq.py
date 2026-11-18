import sys,re
# swap option lines A) and B) of question number N (any label letter) in a markdown/draft file
path,n=sys.argv[1],sys.argv[2]
L=open(path,encoding='utf-8').read().split('\n')
out=[];i=0;done=0
qre=re.compile(r'^\*\*[A-Z]+'+n+r'\. ')
while i<len(L):
    out.append(L[i])
    if qre.match(L[i]):
        j=i+1
        a=b=None
        while j<len(L) and not L[j].startswith('**') and not L[j].startswith('## '):
            if L[j].startswith('A) '): a=j
            if L[j].startswith('B) '): b=j
            j+=1
        if a is not None and b is not None:
            seg=L[i+1:j]
            ta=L[a][3:]; tb=L[b][3:]
            seg[a-i-1]='A) '+tb; seg[b-i-1]='B) '+ta
            out.extend(seg); i=j; done+=1; continue
    i+=1
open(path,'w',encoding='utf-8').write('\n'.join(out))
print(path,'swapped',done)
