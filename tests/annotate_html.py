import re,glob,os,textwrap
from html.parser import HTMLParser
R='/home/claude/alpine-ascents/';os.chdir(R)
css=open('css/style.css',encoding='utf-8').read()
# ---- class -> section map (first section whose rules define the class) ----
cmap={};sec='1';i=0;depth=0;stmt=True
while i<len(css):
    if css.startswith('/*',i):
        j=css.index('*/',i)+2;m=re.match(r'/\*\s*=*\s*§(\w+)',css[i:j])
        if m:sec=m.group(1)
        i=j;continue
    ch=css[i]
    if depth==0 and stmt and not ch.isspace():
        k=css.index('{',i)
        for c in re.findall(r'\.([a-zA-Z_][\w-]*)',re.sub(r'"[^"]*"|\[[^\]]*\]','',css[i:k])):cmap.setdefault(c,sec)
        stmt=False
    if ch=='{':depth+=1
    elif ch=='}':
        depth-=1
        if depth==0:stmt=True
    i+=1
HOOKS=[('data-count','main.js: numbers count up'),('class="visitors','main.js: visitor counter'),('class="ticker','main.js: date, time, location'),('class="links','main.js: menu, dropdown, active page'),
 ('class="hero"','motion.js: snow, parallax, headline reveal'),('class="journey','journey.js: scroll-driven climb'),('class="flip','pages.js: myth/fact flip cards'),('data-tabs','pages.js: tabs'),
 ('id="symForm"','pages.js: symptom checker'),('id="cave"','pages.js: snow-cave hotspots'),('tl__photo','pages.js: pinned photo follows the timeline'),('data-filter','pages.js: era filter chips'),
 ('id="vs"','records.js: compare two peaks'),('id="peaks"','records.js: table filter'),('id="placeList"','clubs.js: directory cards + map + near me'),('id="simForm"','simulator.js: cost / difficulty / success model + map'),
 ('id="quizHost"','quiz.js: both quizzes'),('id="contactForm"','contact.js: form validation + saved message'),('class="gallery"','gallery.js: filter chips + lightbox'),('id="lb"','gallery.js: lightbox viewer'),
 ('id="checkReset"','checklist.js: saved checklist + progress bar'),('class="faq','no JS needed (native <details> accordion)')]
LABEL={'skip':'SKIP LINK (keyboard shortcut to the main content)','progress':'SCROLL PROGRESS BAR (thin orange line at the very top)','nav':'NAVIGATION BAR (fixed at the top)','footer':'FOOTER','ticker':'BOTTOM TICKER (live date · time · location)',
 'next':'NEXT-PAGE LINK (big link at the end of the page)','hero':'HOME HERO (full-screen opening)','page-hero':'PAGE BANNER','journey':'EVEREST SCROLL JOURNEY','band':'PHOTO + NUMBERS BAND','cta':'CALL-TO-ACTION BAND','lb':'LIGHTBOX (full-screen photo/video viewer)',
 'logo':'LOGO (images/logo.svg, inline copy)','nav__right':'VISITOR COUNTER + MOBILE-MENU BUTTON','links':'MAIN MENU'}
class N:
    def __init__(s,tag,attrs,st):s.tag=tag;s.attrs=dict(attrs);s.start=st;s.end=None;s.kids=[];s.parent=None
VOID={'meta','link','img','br','hr','input','source','area','base','col','embed','track','wbr'}
class P(HTMLParser):
    def __init__(s,text):
        super().__init__();s.t=text;s.lo=[0]
        for m in re.finditer('\n',text):s.lo.append(m.end())
        s.root=N('root',[],0);s.cur=s.root
    def off(s):l,c=s.getpos();return s.lo[l-1]+c
    def handle_starttag(s,t,a):
        n=N(t,a,s.off());n.parent=s.cur;s.cur.kids.append(n)
        if t in VOID:n.end=n.start+len(s.get_starttag_text())
        else:s.cur=n
    def handle_endtag(s,t):
        if t in VOID:return
        n=s.cur
        while n is not s.root and n.tag!=t:n=n.parent
        if n is s.root:return
        n.end=s.off()+len(t)+3;s.cur=n.parent
def walk(n):
    yield n
    for k in n.kids:yield from walk(k)
def classes(n):return (n.attrs.get('class') or '').split()
def txt(raw):return re.sub(r'\s+',' ',re.sub(r'<[^>]+>','',raw)).strip()
def wrap(prefix,body,width=112):
    return textwrap.fill(body,width=width,initial_indent=prefix,subsequent_indent=' '*len(prefix))
def describe(n,html):
    raw=html[n.start:n.end];cls=classes(n)
    key=next((k for k in ('skip','progress','nav','footer','ticker','next','hero','page-hero','journey','band','cta','lb','logo','nav__right','links') if k in cls or (k=='footer' and n.tag=='footer') or (k=='nav' and n.tag=='header' and 'nav' in cls)),None)
    eb=re.search(r'class="eyebrow[^"]*"[^>]*>(.*?)</p>',raw,re.S);h=re.search(r'<h[12][^>]*>(.*?)</h[12]>',raw,re.S)
    label=LABEL.get(key)
    if n.tag=='nav' and key is None:label='MAIN MENU (page links + Learn dropdown)'
    if not label:
        label='SECTION'
        if eb:label+=' · '+txt(eb.group(1))
    sub=''
    if h:sub=' — "'+txt(h.group(1))+'"'
    groups={};order=[]
    for m in walk(n):
        for c in classes(m):
            if c in ('reveal','in','on','active') or c not in cmap:continue
            g=cmap[c]
            if g not in groups:groups[g]=[];order.append(g)
            if c not in groups[g]:groups[g].append(c)
    cssline=' | '.join(f'§{g}: '+' '.join('.'+c for c in groups[g]) for g in order)
    hk={}
    for k,v in HOOKS:
        if k in raw:
            f_,_,what=v.partition(': ') if ': ' in v else ('',' ',v)
            hk.setdefault(f_ or 'none',[]).append(what)
    hooks=[(f_+': ' if f_!='none' else '')+' + '.join(w) for f_,w in hk.items()]
    lines=[f'<!-- ▼ {label}{sub}']
    if cssline:lines.append(wrap('     CSS  : ',cssline+'   (css/style.css — search for the § number)'))
    if hooks:lines.append(wrap('     JS   : ',' · '.join(dict.fromkeys(hooks))))
    return '\n'.join(lines)+' -->\n'
SKIPTAGS={'script','link','meta','head'}
tot=0;pageinfo=[]
for f in ['index.html']+sorted(glob.glob('pages/*.html')):
    s=open(f,encoding='utf-8').read()
    before=re.sub(r'\s+','',re.sub(r'<!--.*?-->','',s,flags=re.S))
    s=re.sub(r'<!--\s*(?:CSS|▼|═|ALL CSS)[^>]*?-->[ \t]*\n?','',s,flags=re.S)         # drop earlier hand/auto comments
    s=re.sub(r'<!-- ▼.*?-->\n?','',s,flags=re.S);s=re.sub(r'<!-- ═+.*?═+ -->\n?','',s,flags=re.S)
    p=P(s);p.feed(s);body=next(k for k in walk(p.root) if k.tag=='body');main=next((k for k in walk(body) if k.tag=='main'),None)
    ins=[]   # (offset, text)
    for k in body.kids:
        if k.tag in SKIPTAGS or k.tag=='script':continue
        if k is main:ins.append((k.start,'<!-- ▼ MAIN CONTENT — everything between the navbar and the footer. Each block below is one section of this page. -->\n'))
        else:ins.append((k.start,describe(k,s)))
    if main:
        for k in main.kids:
            if k.tag in SKIPTAGS:continue
            ins.append((k.start,describe(k,s)))
    hdr=next((k for k in body.kids if k.tag=='header'),None)
    if hdr:
        for k in walk(hdr):
            if k.parent is not None and k.parent.tag=='div' and 'wrap' in classes(k.parent) and k.parent.parent is hdr and k.tag in('a','nav','div'):
                ins.append((k.start,describe(k,s)))
    # page header comment
    title=re.search(r'<title>(.*?)</title>',s,re.S).group(1).replace('&amp;','&')
    secs=[]
    for k in (main.kids if main else []):
        raw=s[k.start:k.end];h=re.search(r'<h[12][^>]*>(.*?)</h[12]>',raw,re.S)
        if h:secs.append(txt(h.group(1)))
    scripts=re.findall(r'<script src="([^"]+)"',s)
    pre=('../' if f!='index.html' else '')
    banner=('<!-- ═══════════════════════════════════════════════════════════════════════════════\n'
      f'  PAGE      : {title}   ({f})\n'
      +wrap('  SECTIONS  : ','  ·  '.join(secs) if secs else '(see below)')+'\n'
      '  SHARED    : skip link · scroll bar · navbar with Learn menu + visitor pill · footer · bottom ticker (same on every page)\n'
      f'  STYLES    : {pre}css/style.css  (only stylesheet; comments above each section give the § to search for)\n'
      +wrap('  SCRIPTS   : ',' · '.join(os.path.basename(x) if not x.startswith('http') else x.split("/")[2] for x in scripts))+'\n'
      '  HOW TO READ: every "▼" comment below sits right above the HTML it describes and lists its CSS classes + JS file.\n'
      '════════════════════════════════════════════════════════════════════════════════ -->\n')
    ins.append((body.start+len(re.match(r'<body[^>]*>\n?',s[body.start:]).group(0)),banner))
    for off,t in sorted(set(ins),key=lambda x:-x[0]):s=s[:off]+('\n' if off>0 and s[off-1]!='\n' else '')+t+s[off:]
    tot+=len(ins)
    after=re.sub(r'\s+','',re.sub(r'<!--.*?-->','',s,flags=re.S))
    assert before==after,('HTML changed outside comments!',f)
    open(f,'w',encoding='utf-8').write(s)
print('HTML comments written:',tot,'across 16 pages | markup identical to before (comments ignored): True')
