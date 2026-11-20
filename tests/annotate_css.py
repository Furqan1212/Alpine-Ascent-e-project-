import re,glob,os
R='/home/claude/alpine-ascents/';os.chdir(R)
css=open('css/style.css').read()
# remove any previous auto comments + TOC so this script can be re-run safely
css=re.sub(r'/\* ▸ [^\n]*?\*/\n','',css);css=re.sub(r'/\* ╔═+╗.*?═{20,} \*/\n*','',css,flags=re.S)
# ---------- HTML class usage index ----------
pages=['index.html']+sorted(glob.glob('pages/*.html'));short=lambda f:'home' if f=='index.html' else os.path.basename(f)[:-5]
use={}   # class -> [tag counter, [pages]]
from collections import Counter
for f in pages:
    s=re.sub(r'<!--.*?-->','',open(f).read(),flags=re.S)
    for m in re.finditer(r'<(\w+)\b[^>]*?\bclass="([^"]*)"',s):
        for c in m.group(2).split():
            t,pp=use.setdefault(c,[Counter(),[]]);t[m.group(1)]+=1
            if short(f) not in pp:pp.append(short(f))
js={os.path.basename(j):open(j).read() for j in sorted(glob.glob('js/*.js'))}
def where(c):
    if c in use:
        t,pp=use[c];t=t.most_common(1)[0][0];n=len(pp)
        pg='all pages' if n>=15 else (', '.join(pp[:5])+(f' +{n-5} more' if n>5 else ''))
        return f'<{t} class="…{c}…"> on: {pg}'
    if c.startswith('leaflet'):return 'Leaflet map library element, restyled here to match the theme'
    if c.startswith('pin'):return 'map pin icon created by js/clubs.js and js/simulator.js'
    for fn,txt in js.items():
        if re.search(r"classList\.(?:add|toggle|remove)\(\s*['\"]"+re.escape(c)+r"['\"]",txt):return f'state class switched on/off by js/{fn}'
    for fn,txt in js.items():
        if re.search(r"[\"' ]"+re.escape(c)+r"[\"' ]",txt) or ('badge--' in txt and c.startswith('badge--')):return f'element built by js/{fn} (not in the HTML files)'
    return None
# ---------- walk the CSS ----------
out=[];i=0;n=len(css);depth=0;stmt=True;section='1';seen=set();titles=[];added=0
while i<n:
    if css.startswith('/*',i):
        j=css.index('*/',i)+2;c=css[i:j]
        m=re.match(r'/\*\s*=*\s*§(\w+)[ \t]*([^\n]*)',c)
        if m:
            section=m.group(1)
            if '(cont' not in m.group(2) and not any(t[0]==section for t in titles):titles.append((section,re.sub(r'\s*\(.*$','',m.group(2)).strip(' =*/')))
        out.append(c);i=j;continue
    ch=css[i]
    if depth==0 and stmt and not ch.isspace():
        k=css.index('{',i);sel=css[i:k]
        if not sel.startswith('@'):
            new=[c for c in dict.fromkeys(re.findall(r'\.([a-zA-Z_][\w-]*)',re.sub(r'"[^"]*"|\[[^\]]*\]','',sel))) if c not in seen]
            lines=[]
            for c in new:
                seen.add(c);w=where(c)
                if w:lines.append(f'/* ▸ .{c} — {w} (§{section}) */\n')
            out.append(''.join(lines[:6]));added+=len(lines[:6])
        stmt=False
    if ch=='{':depth+=1
    elif ch=='}':
        depth-=1
        if depth==0:stmt=True
    out.append(ch);i+=1
body=''.join(out)
# ---------- table of contents ----------
toc='\n'.join(f'   §{s:<4}{t}' for s,t in titles)
head=f'''/* ╔══════════════════════════════════════════════════════════════════════════════╗
   ║  ALPINE ASCENTS — css/style.css  (the ONLY stylesheet; every page loads it)  ║
   ╠══════════════════════════════════════════════════════════════════════════════╣
   ║  HOW TO FIND THINGS                                                          ║
   ║   • HTML → CSS : each HTML section has a comment listing its classes and the ║
   ║                  §number here. Search this file for the class name.          ║
   ║   • CSS → HTML : every class has a "▸ .class — <tag> on: pages" line above   ║
   ║                  its first rule, and each §section header says where it is.  ║
   ║   • Colours, fonts, spacing live in §1 (:root). Change them there only.      ║
   ║   • Mobile rules are in the @media blocks inside each section and in §15.    ║
   ╠══════════════════════════════════════════════════════════════════════════════╣
   ║  TABLE OF CONTENTS (search for "§N" to jump)                                 ║
   ╚══════════════════════════════════════════════════════════════════════════════╝
{toc}
   ═══════════════════════════════════════════════════════════════════════════════ */

'''
open('css/style.css','w').write(head+body)
strip=lambda t:re.sub(r'\s+','',re.sub(r'/\*.*?\*/','',t,flags=re.S))
old=open('/home/claude/work/bak/css/style.css').read()
print('class comments added:',added,'| sections in TOC:',len(titles))
print('CSS rules IDENTICAL to backup (comments ignored):',strip(old)==strip(head+body))
