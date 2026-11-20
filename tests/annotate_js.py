import os,re
os.chdir('/home/claude/alpine-ascents/')
H={
'js/main.js':('loaded on EVERY page','''     1. Image safety net  - a photo that fails to load becomes images/fallback.svg. Add ?imgcheck=1 to any page address to list broken photos.
     2. Navbar            - goes solid on scroll (.nav.scrolled, CSS §4), fills the progress bar (.progress, §2), parallax on the hero photo.
     3. Mobile menu       - the .burger button toggles .links.open (CSS §4, screens under 1100px).
     4. Active page       - marks the current page in .links (and "Learn" when you are on a chapter page).
     5. Learn dropdown    - click / Esc / outside-click for .dd (hovering is pure CSS, §4b).
     6. Reveal on scroll  - adds .in to each .reveal element when it scrolls into view (CSS §14), plus a safety timer.
     7. Count-up numbers  - any element with data-count="N" counts from 0 up to N (CSS §6 .stat).
     8. Visitor counter   - #visitCount rolling digits + hover card #visTip (CSS §4c). Starts at 0; counts a new visit or a refresh, not page changes; ?resetcounter=1 resets it.
     9. Location + ticker - window.AA_getPosition remembers permission (6 h); [data-tick] spans in the bottom ticker show date, time, place (CSS §13).''','.nav .progress .burger .links .dd .reveal [data-count] #visitCount #visTip [data-tick]'),
'js/motion.js':('loaded on every page after main.js; runs ONLY when <html class="motion"> is set (an inline script in each <head> adds it, unless the visitor prefers reduced motion)','''     1. Headline reveal   - splits h1 / h2 into words (.w) that rise into view (CSS §24).
     2. Page wipe         - a ridge-shaped overlay (.wipe) sweeps across when you click an internal link.
     3. Snow              - <canvas class="snow"> falling snow on the HOME hero only.
     4. Mouse parallax    - the home hero photo shifts with the cursor (CSS variables --mx / --my).
     5. Cards + buttons   - cursor spotlight on .card and a magnetic pull on .btn (mouse devices only).''','h1 h2 .hero .hero__bg .card .btn .wipe canvas.snow'),
'js/journey.js':('HOME page only - the "Climb Everest by scrolling" section','''     Reads how far you have scrolled through <section class="journey"> and updates: altitude, oxygen, temperature, zone, sky colour
     (--sky-top / --sky-bot), the orange route #jRoute, the climber dot #jDot, the camp markers .jmark and the active camp card .jstage.
     Without html.motion (reduced motion) the six camp cards just read as a normal list. CSS: §26.''','.journey #hAlt #hO2 #hO2bar #hTemp #hZone #jRoute #jDot .jmark .jstage'),
'js/pages.js':('loaded on every inner page; each block does nothing if its element is not on the page','''     1. Flip cards        - .flip buttons toggle aria-pressed (myth <-> fact). Pages: most chapter pages. CSS §28.
     2. Filter chips      - any [data-filter] block hides/shows items by data-era. Page: history. CSS §16.
     3. Tabs              - [data-tabs] with [role=tab] / [role=tabpanel] (arrow keys work). Pages: information, techniques, guidelines, gallery.
     4. Symptom checker   - #symForm ticks -> advice in #symBox / #symOut. Page: hazards.
     5. Snow-cave diagram - #cave hotspots .hs -> text in #caveT / #caveD. Page: sheltering.
     6. Timeline photo    - .tl__photo follows the .tl you are reading. Pages: history, records, developments, contact. CSS §31.''','.flip [data-filter] [data-tabs] #symForm #cave .hs .tl__photo .tl'),
'js/simulator.js':('SIMULATOR page only (pages/simulator.html); needs data/sim-peaks.js (loaded first)','''     compute(state)  - the cost / difficulty / success model (pure function, easy to test). Costs are rough estimates.
     UI              - peak buttons #peakChips + map #simMap, form #simForm, results #rTotal #rBars #dialArc #ringArc #rSeason #rRisks #rAdvice,
                       Save as Trip A/B (#saveA #saveB) -> compare table #cmp (saved in localStorage "aa_trips").
     Deep link       - simulator.html#peak=denali preselects a peak (used by the quiz result buttons). CSS: §25.''','#simForm #peakChips #simMap #rTotal #rBars #saveA #saveB #cmp'),
'js/quiz.js':('QUIZ page only (pages/quiz.html)','''     Data at the top (STYLES, Q.style, Q.safety) - edit questions there. One small engine renders both quizzes into #quizHost.
     Style quiz = weighted points -> Alpine / Ice / Expedition. Safety quiz = right/wrong with explanation, score ring, review list.
     Best safety score is kept in localStorage "aa_quiz_best". Buttons: .qtab (switch quiz), .qopt (answers). CSS: §27.''','#quizHost .qtab .qopt .qres .qbars'),
'js/contact.js':('CONTACT page only (pages/contact.html)','''     Validates #contactForm (name, email, topic, message >= 20 characters, consent), shows errors under each field (.field.bad),
     then replaces the form with the success panel #formOk (reference number #okRef, "Email it instead" link #mailBtn).
     The message is kept in localStorage "aa_messages" (there is no server). CSS: §23.''','#contactForm .field .field__err #formOk #okName #okRef #mailBtn #again'),
'js/records.js':('RECORDS page only (pages/records.html)','''     1. Table filter      - chips (data-f = all / pk / np) hide rows of #peaks and update #peakCount. CSS §16.
     2. Compare two peaks - #vs with selects #vsA / #vsB builds bars, facts and the sentence #vsDiff from the same table rows. CSS §29.''','#peaks .chip #peakCount #vs #vsA #vsB #vsDiff'),
'js/clubs.js':('CLUBS page only (pages/clubs.html); needs data/clubs.js (CLUBS + PEAKS) and the Leaflet map library','''     Builds one compact card (.place) per club / peak in #placeList and one pin per item on #map (Esri map tiles).
     Click a card -> map flies there; click a pin -> its card opens. Search #placeSearch, filter chips (data-group "t" type / "r" region),
     "Find clubs near me" #geoBtn -> pulsing dot + nearest club in #geoStatus (uses window.AA_getPosition from main.js).
     Cards still render if the map cannot load. CSS: §17, §17b, §17c, §17d.''','#map #placeList #placeSearch #geoBtn #geoStatus #placeCount #placeEmpty .place'),
'js/gallery.js':('GALLERY page only (pages/gallery.html)','''     1. Filter chips      - show tiles by data-cat (summits / climbing / camp / video). CSS §16.
     2. Lightbox          - clicking a .tile opens #lb (full-screen). Arrow keys move, Esc closes, focus returns to the tile. CSS §19.
     3. Films             - tiles with data-yt show the YouTube thumbnail + play button. On http(s) pages it swaps in the player;
                            on pages opened from a local file YouTube blocks embeds, so it opens YouTube in a new tab instead.''','.tile .chip #lb .lb__stage .lb__cap .lb__prev .lb__next .lb__close'),
'js/checklist.js':('GUIDELINES page only (pages/guidelines.html)','''     The "Are you ready?" checklist: .check inputs (c1..c16) -> progress bar .meter__bar, text #checkOut, Reset #checkReset.
     Ticks are saved in localStorage "aa_checklist". CSS: §20.''','.check input .meter__bar #checkOut #checkReset'),
'data/clubs.js':('data for the CLUBS page (loaded by pages/clubs.html before js/clubs.js)','''     window.CLUBS = mountaineering clubs; window.PEAKS = expedition peaks. Fields: name, place, region (asia/europe/americas/africa),
     lat, lng, note (shown on the card + map popup), trips ("Known for" / season line). Add or edit entries here - no other file needs changing.''','CLUBS PEAKS'),
'data/sim-peaks.js':('data for the SIMULATOR page (loaded by pages/simulator.html before js/simulator.js)','''     window.SIM_PEAKS = the 7 mountains: permit fee, operator fees [budget, guided, premium], days, flights, gear, insurance, difficulty,
     base success rate, best/shoulder months, whether bottled oxygen applies (o2) and the main risks. All amounts are rough USD estimates.''','SIM_PEAKS'),
}
for f,(where,body,hooks) in H.items():
    s=open(f,encoding='utf-8').read()
    s=re.sub(r'^/\* ◆ FILE GUIDE.*?\*/\n\n?','',s,flags=re.S)
    block=(f'/* ◆ FILE GUIDE ──────────────────────────────────────────────────────────────────────────────────\n   {f} - {where}\n   WHAT IT DOES:\n{body}\n'
           f'   HTML IT USES: {hooks}\n   (Each HTML section has a "▼" comment naming the JS file that powers it; CSS classes are explained in css/style.css.)\n──────────────────────────────────────────────────────────────────────────────────────────────── */\n\n')
    open(f,'w',encoding='utf-8').write(block+s)
print('JS/data files annotated:',len(H))
