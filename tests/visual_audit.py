from playwright.sync_api import sync_playwright
import glob,os
JS="""(el)=>{
 const r=el.getBoundingClientRect(),s=getComputedStyle(el);const out=[];
 if(r.width<20||r.height<20)out.push('zero size');
 if(parseFloat(s.opacity)<0.2&&!el.classList.contains('sec-ph'))out.push('opacity '+s.opacity);
 if(el.matches('.frame')){const i=el.querySelector('img');if(i){const c=getComputedStyle(i).clipPath;if(c.includes('100%'))out.push('frame photo still clipped');if(!i.complete||i.naturalWidth===0)out.push('img not loaded')}}
 if(el.matches('.card__img')){const i=el.querySelector('img');if(!i||!i.complete||i.naturalWidth===0)out.push('card img not loaded')}
 if(el.matches('.band__bg,.cta__bg,.page-hero__bg,.sec-ph,.hero__bg')&&s.backgroundImage==='none')out.push('no background image');
 if(el.matches('.reveal')&&!el.matches('.frame')&&s.opacity<0.9)out.push('reveal not shown ('+s.opacity+')');
 return out}"""
SEL='.frame,.card__img,.band__bg,.cta__bg,.page-hero__bg,.sec-ph,.hero__bg,.reveal'
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1440,'height':900});total=0;checked=0
    for f in ['<PROJECT_ROOT>/index.html']+sorted(glob.glob('<PROJECT_ROOT>/pages/*.html')):
        pg.goto('file://'+f);pg.add_style_tag(content='html{scroll-behavior:auto!important}');pg.wait_for_timeout(1500);n=pg.evaluate(f"document.querySelectorAll('{SEL}').length");bad=[]
        # scroll to each element the way a visitor does (no forcing), give the page time to react, then inspect
        for i in range(n):
            pg.evaluate(f"(i)=>{{const e=document.querySelectorAll('{SEL}')[i];e.scrollIntoView({{block:'center'}})}}",i)
            pg.wait_for_timeout(300)
            chk=f"(i)=>{{const e=document.querySelectorAll('{SEL}')[i];return [e.className.toString().slice(0,26),({JS})(e)]}}"
            res=pg.evaluate(chk,i)
            if res[1]:                       # re-check after the ~1s fade has finished
                pg.wait_for_timeout(1400);res=pg.evaluate(chk,i)
            checked+=1
            if res[1]:bad.append((i,res[0],res[1]))
        total+=len(bad)
        print(os.path.basename(f).ljust(22),'checked',n,'| problems',len(bad),bad[:4])
    print('TOTAL elements checked:',checked,'| problems:',total);b.close()
