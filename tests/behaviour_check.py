from playwright.sync_api import sync_playwright
import glob,os
R='<PROJECT_ROOT>/'
pages=['index.html']+sorted(os.path.relpath(f,R) for f in glob.glob(R+'pages/*.html'))
with sync_playwright() as p:
    b=p.chromium.launch()
    # 1) reduced motion on every page: nothing may stay hidden, no motion class
    rc=b.new_context(viewport={'width':1440,'height':900},reduced_motion='reduce');pg=rc.new_page();bad=[]
    for f in pages:
        pg.goto('file://'+R+f);pg.wait_for_timeout(500)
        r=pg.evaluate("({motion:document.documentElement.classList.contains('motion'),hiddenReveal:[...document.querySelectorAll('.reveal')].filter(e=>getComputedStyle(e).opacity<0.5).length,hiddenH:[...document.querySelectorAll('h1,h2')].filter(h=>getComputedStyle(h).visibility==='hidden').length})")
        if r['motion'] or r['hiddenReveal'] or r['hiddenH']:bad.append((f,r))
    print('Reduced motion: pages checked',len(pages),'| problems:',len(bad),bad[:3])
    # 2) mobile menu
    m=b.new_context(viewport={'width':390,'height':844}).new_page();m.goto('file://'+R+'pages/history.html');m.wait_for_timeout(600)
    m.click('.burger');m.wait_for_timeout(700)
    opened=m.evaluate("document.querySelector('.links').classList.contains('open')");links=m.evaluate("[...document.querySelectorAll('.links a')].filter(a=>a.getBoundingClientRect().width>0).length")
    m.keyboard.press('Escape');m.wait_for_timeout(500);closed=not m.evaluate("document.querySelector('.links').classList.contains('open')")
    m.click('.burger');m.wait_for_timeout(500);m.click('.links >> text=Simulator');m.wait_for_timeout(1500)
    print('Phone menu: opens',opened,'| visible links',links,'| Esc closes',closed,'| navigates to ->',m.url.split('/')[-1])
    # 3) simulator segmented selector highlights the chosen level (no :has())
    s=b.new_page(viewport={'width':1440,'height':900});s.goto('file://'+R+'pages/simulator.html');s.wait_for_timeout(900)
    s.click('.seg label:has-text("Premium")');s.wait_for_timeout(400)
    bg=s.evaluate("[...document.querySelectorAll('.seg label span')].map(x=>getComputedStyle(x).backgroundColor)")
    print('Simulator selector backgrounds [Budget, Guided, Premium]:',bg)
    b.close()
