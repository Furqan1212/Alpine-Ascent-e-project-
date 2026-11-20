import re,glob,os,collections,subprocess,json
from html.parser import HTMLParser
R='<PROJECT_ROOT>/'
os.chdir(R)
pages=['index.html']+sorted(glob.glob('pages/*.html'))
VOID={'meta','link','img','br','hr','input','source','area','base','col','embed','track','wbr'}
res=collections.OrderedDict()
def add(k,v): res.setdefault(k,[]).append(v)
# ---------- static checks ----------
class P(HTMLParser):
    def __init__(s):super().__init__();s.stack=[];s.ids=[];s.err=[];s.h=[];s.labels=set();s.fields=[];s.classes=set();s.imgs=[];s.btns=[];s.cur=None
    def handle_starttag(s,t,a):
        d=dict(a)
        if t not in VOID:s.stack.append(t)
        if 'id' in d:s.ids.append(d['id'])
        if t in('h1','h2','h3','h4'):s.h.append(int(t[1]))
        if t=='label' and 'for' in d:s.labels.add(d['for'])
        if t in('input','select','textarea') and d.get('type') not in('hidden',):s.fields.append((t,d))
        if t=='img':s.imgs.append(d)
        for c in (d.get('class') or '').split():s.classes.add(c)
    def handle_endtag(s,t):
        if t in VOID:return
        if not s.stack:s.err.append('stray </%s>'%t);return
        if s.stack[-1]==t:s.stack.pop()
        else:
            s.err.append('mismatch </%s> (open: %s)'%(t,s.stack[-1]))
            if t in s.stack:
                while s.stack and s.stack.pop()!=t:pass
used_classes=set()
for f in pages:
    s=open(f).read();p=P();p.feed(s)
    if p.stack:p.err.append('unclosed: '+','.join(p.stack[-3:]))
    for e in p.err:add('HTML structure',f'{f}: {e}')
    dup=[k for k,v in collections.Counter(p.ids).items() if v>1]
    if dup:add('duplicate ids',f'{f}: {dup}')
    if p.h.count(1)!=1:add('h1 count != 1',f'{f}: {p.h.count(1)}')
    for a,b in zip(p.h,p.h[1:]):
        if b-a>1:add('heading level skipped',f'{f}: h{a} -> h{b}');break
    for t,d in p.fields:
        if not(d.get('id') in p.labels or 'aria-label' in d or d.get('type') in('checkbox','radio') or d.get('type')=='range'):
            # checkbox/radio sit inside <label>; range sliders have labels via for= in this site
            add('form field without label',f'{f}: <{t} {d.get("id") or d.get("name")}>')
    for d in p.imgs:
        if 'alt' not in d:add('img without alt',f'{f}: {d.get("src","")[:50]}')
    if '<html lang=' not in s:add('missing lang',f)
    if not re.search(r'<title>[^<]+</title>',s):add('missing title',f)
    used_classes|=p.classes
    # internal links/anchors
    d0=os.path.dirname(f)
    for u in re.findall(r'\s(?:href|src)="([^"#]+)(#[^"]*)?"',s):
        pass
    for m in re.finditer(r'\s(?:href|src)="([^"]*)"',s):
        u=m.group(1)
        if u.startswith(('http','//','mailto:','tel:','data:','javascript:')) or not u:continue
        path,_,frag=u.partition('#')
        tgt=os.path.normpath(os.path.join(d0,path)) if path else f
        if not os.path.exists(tgt):add('broken link/file',f'{f} -> {u}');continue
        if frag and not re.match(r'(peak=|[a-z]+=)',frag) and f'id="{frag}"' not in open(tgt).read():add('missing anchor',f'{f} -> {u}')
# nav / footer consistency
navs={}
for f in pages:
    s=open(f).read();m=re.search(r'<ul class="links" id="menu">(.*?)</ul></nav>',s,re.S)
    labs=tuple(re.findall(r'>([^<>]+)</a>',m.group(1))) if m else None
    navs.setdefault(labs,[]).append(f)
if len(navs)>1:add('navbar differs between pages',{str(len(k)):v for k,v in navs.items()})
# scripts referenced exist, JS syntax
for f in pages:
    for u in re.findall(r'<script src="([^"]+)"',open(f).read()):
        if not u.startswith('http') and not os.path.exists(os.path.normpath(os.path.join(os.path.dirname(f),u))):add('missing script',f'{f}: {u}')
for j in glob.glob('js/*.js')+glob.glob('data/*.js'):
    r=subprocess.run(['node','--check',j],capture_output=True,text=True)
    if r.returncode:add('JS syntax error',j+': '+r.stderr[:120])
# CSS: braces, undefined/dead classes
css=open('css/style.css').read();bare=re.sub(r'/\*.*?\*/','',css,flags=re.S)
if bare.count('{')!=bare.count('}'):add('CSS braces unbalanced',f'{bare.count("{")} vs {bare.count("}")}')
defined=set(re.findall(r'\.([a-zA-Z_][\w-]*)',re.sub(r'"[^"]*"|\'[^\']*\'|url\([^)]*\)','',bare)))
js_cls=set()
for j in glob.glob('js/*.js'):
    js_cls|=set(re.findall(r"""classList\.(?:add|toggle|remove|contains)\(\s*['"]([\w-]+)""",open(j).read()))|set(re.findall(r"className\s*=\s*['\"]([\w\s-]+)",open(j).read()))
    for m in re.findall(r"className\s*=\s*['\"]([\w\s-]+)",open(j).read()):js_cls|=set(m.split())
    js_cls|=set(re.findall(r'class="([\w\s-]+)"',open(j).read()))
    for m in re.findall(r'class="([\w\s-]+)"',open(j).read()):js_cls|=set(m.split())
undefined=sorted(c for c in used_classes if c not in defined and not c.startswith(('lg',)))
if undefined:add('HTML classes with NO CSS rule',undefined)
dead=sorted(c for c in defined if c not in used_classes and c not in js_cls and not re.match(r'^(leaflet|pin|odo|on|in|hide|open|bad|show|active|win|reached|hot|scrolled|cover|go|correct|wrong|split-|motion|lvl|badge--|btn--|pin--)',c))
add('CSS classes never used in HTML/JS (candidates, may be state classes)',dead)
# forbidden visible text
class T(HTMLParser):
    def __init__(s):super().__init__();s.skip=0;s.t=[]
    def handle_starttag(s,t,a):
        if t in('script','style'):s.skip+=1
    def handle_endtag(s,t):
        if t in('script','style'):s.skip=max(0,s.skip-1)
    def handle_data(s,d):
        if not s.skip and d.strip():s.t.append(d)
for f in pages:
    t=T();t.feed(open(f).read());txt=' '.join(t.t)
    for w in ('Aptech','eProject','student project','JavaScript','Bootstrap','jQuery','lorem','TODO','undefined','NaN'):
        if re.search(r'\b'+w+r'\b',txt,re.I):add('forbidden/odd visible text',f'{f}: {w}')
print('STATIC CHECKS')
if not res:print('  none found')
for k,v in res.items():
    print(f' - {k}: {len(v)}');[print('     ',x if not isinstance(x,list) else x[:60]) for x in v[:12]]
print('\nsizes: html pages',len(pages),'| css %.0fKB'%(os.path.getsize('css/style.css')/1024),'| js files',len(glob.glob("js/*.js")))
