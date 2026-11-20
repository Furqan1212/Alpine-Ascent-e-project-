from playwright.sync_api import sync_playwright
import glob,os,sys
R='<PROJECT_ROOT>/'
pages=['index.html']+sorted(os.path.relpath(f,R) for f in glob.glob(R+'pages/*.html'))
NET=('ERR_NAME_NOT_RESOLVED','ERR_INTERNET_DISCONNECTED','ERR_CONNECTION','ERR_FAILED','net::')
def run(browser_name):
    with sync_playwright() as p:
        try:
            b=getattr(p,browser_name).launch()
        except Exception as e:
            print(f'[{browser_name}] not available in this sandbox'); return
        problems=[];n=0
        for vw,vh in [(390,844),(768,1024),(1024,768),(1440,900)]:
            ctx=b.new_context(viewport={'width':vw,'height':vh});pg=ctx.new_page()
            errs=[]
            pg.on('pageerror',lambda e:errs.append('JS: '+str(e)[:90]))
            pg.on('console',lambda m:errs.append('console: '+m.text[:90]) if m.type=='error' and not any(x in m.text for x in NET) else None)
            for f in pages:
                errs.clear();pg.goto('file://'+R+f);pg.wait_for_timeout(450);n+=1
                ov=pg.evaluate("document.documentElement.scrollWidth-innerWidth")
                nonvis=pg.evaluate("[...document.querySelectorAll('h1')].filter(h=>getComputedStyle(h).visibility==='hidden').length")
                if errs or ov>0 or nonvis:problems.append((f'{vw}px',f,errs[:2],ov if ov>0 else '',('h1 hidden' if nonvis else '')))
            ctx.close()
        print(f'[{browser_name}] page loads checked: {n} | problems: {len(problems)}');[print('   ',x) for x in problems[:10]]
        b.close()
for name in ('chromium','firefox','webkit'): run(name)
