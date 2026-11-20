# PROJECT_CONTEXT — Alpine Ascents (Aptech eProject)
Updated: 13 Nov 2026 · Phase 1b (multi-page restructure) complete

## Requirements (Aptech spec, summarised)
Single-page responsive mountaineering site. Sections: Home, Information, History, Types/Styles, Techniques, Sheltering, Hazards, Records, Clubs/organisations (location map via Geolocation API), Success stories, Photo+video gallery, Latest developments, General guidelines.
Also: visitor count top-right beside logo; continuous bottom ticker (date, time, location via HTML5 geolocation); menu colour change on hover + after click; fade effects; all links work; images throughout. Data store: JSON/TXT. Browsers: Edge, Chrome, Firefox, Safari.
Deliverables (Aptech): ZIP + ReadMe.doc (assumptions), project report (problem definition, design specs, flowcharts/DFDs, source, test data, install instructions), demo video clip. Only ONE submission allowed.
User decision: plain HTML + CSS + JavaScript (NO Bootstrap/jQuery). User is in Karachi.

## Design system
Colours: --ink #0a0f18, --navy #0f1b2e, --slate #1b2a44, --glacier #8fd3f4, --ice #eef6fb, --mist #a9b8c9, --ember #ff6a2b (accent, use sparingly).
Type: Fraunces (display, headings) + Inter (body). Easing --ease cubic-bezier(.16,1,.3,1). Container 1240px.
Patterns: .eyebrow label -> h2 -> .lead; alternate .section / .section--navy; .reveal (+ --d delay) for scroll fade; .card, .frame, .facts, .timeline (.tl).

## Architecture (UPDATED: multi-page, user decision)
User chose separate HTML pages instead of one scrolling page, ALL inner pages live in pages/. Only index.html is in root.
NOTE: Aptech spec literally says "Single-Page-Application" — risk of lost marks; mitigation idea: keep index.html as an app-like hub, mention decision in ReadMe.doc.
Each page = same shell (header nav + footer + ticker + js) written as plain HTML (no JS includes, so it works by double-clicking, no server). Root links use pages/x.html; inner pages use x.html and ../index.html.
Active nav link = current filename (js/main.js).

## Commenting convention (REQUIRED, user request)
- css/style.css is split into numbered sections (§1–§15). Each section header lists: class -> HTML element -> pages that use it.
- Every HTML block has a comment like <!-- CSS §10 CARDS --> pointing to its CSS section. Keep BOTH directions updated when adding code.
- To add a page: copy a page in pages/, add it to the nav list in ALL pages (and footer), add a .next band.

## Files
index.html (home: hero + chapter cards) · pages/information, history, types-styles, techniques, sheltering, hazards (.html) · css/style.css · js/main.js · data/ (empty) · images/ (empty; Unsplash hotlinks)

## Done
Shell (nav w/ hover+active, mobile menu, visitor counter, geolocation ticker, footer, progress bar), Home, Information, History, Types & Styles, Techniques, Sheltering, Hazards, Records (filter table), Clubs (Leaflet map + geolocation + expedition peaks), Home v2 (contents index, teaser, strip, CTA), Success stories, Gallery (filters + lightbox + video), Latest developments (sourced from mid-2026 news), Guidelines (saved checklist), CSS/HTML cross-reference comments.

## Remaining (one page each in pages/, then add to nav+footer of EVERY page)
ALL 14 REQUIRED SECTIONS NOW EXIST. Left: QA, polish, Aptech docs. Then QA + Aptech report/ReadMe.doc/DFDs.

## Known issues / notes
- Photos are Unsplash hotlinks (need internet); each has a gradient fallback behind it. Unsplash IDs not verified from sandbox (no network) — check they load; swap any broken ones.
- Types cards reuse hero photo; replace with distinct images.
- Tested in headless Chromium (no network): all 13 pages load, no JS errors except Leaflet 'L' (CDN offline; now has fallback message), no horizontal overflow at 390/1440. Fixed: duplicate ':root{' that broke the whole stylesheet; hero eyebrow overlapping nav; nav overflow (burger below 1280px). NOT verified: Unsplash photos, Google Fonts, map tiles (need internet).
- Visitor count is client-side only (localStorage), per spec: no backend.

## Next steps for next AI
1. Open index.html, verify images load, fix any broken URLs.
2. All sections built. Do browser QA at 360/768/1280 widths, fix visual issues, check Unsplash images load and that only the real MP4s are missing.
3. (DONE) Home upgraded: contents index §21, latest teaser, photo strip + CTA §22.
4. (DONE) docs/ReadMe.docx and docs/Project_Report.docx written (name/batch/group blanks + test-case Pass/Fail column for the student to fill). Remaining: browser QA, add MP4s, then final ZIP named Batch_Group_Title. If the site changes, update both docs. VIDEOS: user must drop MP4s in videos/. Nav has 13 links; burger breakpoint 1280px.

## Map tiles (fixed)
OSM tile server returned 403 on file:// (no Referer). Now: CARTO dark (default) + Esri Terrain + Esri Satellite with a layer switcher, auto-fallback to Terrain after 6 failed tiles. Not verifiable offline. TODO when docs are rebuilt: Project_Report/ReadMe still say 'OpenStreetMap tiles' and the DFD image says 'OpenStreetMap tiles' -> change to 'map tile servers (CARTO, Esri)'.

## Contact page (added)
pages/contact.html + js/contact.js + CSS §23. Validated form (name, email, topic, experience, message>=20 chars, consent), saves to localStorage 'aa_messages', success panel with reference no., mailto 'Email it instead' (hello@alpineascents.example), FAQ <details> accordion. Tested in headless Chromium (empty/invalid/valid paths pass). Nav now 14 links; burger breakpoint 1339px. TODO: add Contact to docs (ReadMe file list, report requirements table + a test case T14 for the form).

## Planned next (awaiting user go-ahead)
Trip Planner, quizzes, Home 'climb Everest by scrolling' journey, lengthen every page to ~5 scrolls (story + interactive + stat band + flip cards + FAQ).

## Motion layer (batch 1 DONE) — user approved full plan; user rule: just build, only ask if an idea is truly 50/50
js/motion.js + CSS §24, gated by html.motion (inline <head> script, off for prefers-reduced-motion). Done: word-mask headline reveal, hero camera push + mouse/scroll parallax (CSS vars --py/--mx/--my; `scale` prop for push), canvas snow, ridge-line page wipe (sessionStorage 'aa_wipe'), photo unmask reveal, card spotlight, magnetic buttons. Tested headless: 14/14 pages OK, wipe navigation OK, reduced-motion OK.
Rival analysis (Bakerz Bite): ~11 decorative CSS keyframes + one IntersectionObserver; strength is purpose (cake studio, cart, filters). We win with purposeful scroll-linked motion + real tools.
REMAINING BATCHES (in order): 2) Expedition Simulator page (map of ranges -> pick peak -> sliders: fitness, experience, group, guide type, oxygen, month -> cost breakdown chart, difficulty dial, days, season fit, risks, success ring; save+compare 2 trips; verify current permit fees via web search; label as estimates). 3) Home 'climb Everest by scrolling' journey (scroll-linked altitude 5,364->8,849 m, sky fade, oxygen gauge, camps). 4) Quizzes (climbing style; safety scored). 5) Lengthen every page to ~5 scrolls (story + interactive + stat band + myth/fact flip cards + FAQ; e.g. hazards symptom checker, records compare chart, sheltering snow-cave diagram, techniques step diagrams). 6) Nav: group chapters under a 'Learn' dropdown to make room for Simulator. 7) Update ReadMe/Report/DFD/test cases (add Contact, Simulator, motion, tile providers). Skip the 0-8849 intro loader.

## Batch 2 DONE: Expedition Simulator + Learn dropdown nav
pages/simulator.html, js/simulator.js (pure model exposed as window.__simCompute), data/sim-peaks.js (7 peaks; costs are 2026 ESTIMATES, sourced: Everest permit $15,000, Denali $450, Aconcagua ~$980, Kili park fees; Everest op fee excludes permit+oxygen), CSS §25 + §4b. Map pins choose the peak (Leaflet, CARTO tiles w/ fallback); chips work offline. Save Trip A/B -> localStorage 'aa_trips' -> compare table.
NAV CHANGED: Home | Learn (dropdown: 9 chapters) | Simulator | Clubs | Gallery | Latest | Contact. Burger breakpoint now 1100px; footer lists all pages incl. Simulator. When adding a chapter page, add it to the Learn list in EVERY page (nav is plain HTML in each file).
Home CTA now: 'Simulate your expedition' (primary) + 'Find clubs near me'.
Tested headless (no network): sim UI/compare/oxygen logic, dropdown hover, mobile menu, 15/15 pages no errors/overflow. Map tiles + Leaflet not verifiable offline.
NEXT: batch 3 = Home 'climb Everest by scrolling' journey; 4 = quizzes; 5 = lengthen all pages; 6 = update ReadMe/Report/DFD/test cases (add Contact, Simulator, motion, Learn nav, tile providers).

## Batch 3 DONE: Home 'Climb Everest by scrolling' journey
index.html section.journey + js/journey.js + CSS §26 (index only). 650vh sticky track; scroll progress drives altitude (5,364->8,849 m), oxygen (standard-atmosphere formula, 51% -> 31%), temp (approx typical spring), zone (death zone >= 8,000 m), sky colour fade, SVG route drawing + climber dot + 6 camp markers, camp cards. Reduced-motion/no-JS: plain list of 6 cards (no sticky). Tested desktop + 390px phone + reduced-motion; no errors/overflow.
NEXT: batch 4 quizzes (climbing-style quiz + scored safety quiz, probably on a new pages/quiz.html and add to Learn dropdown + footer in EVERY page); batch 5 lengthen all pages to ~5 scrolls; batch 6 update ReadMe/Report/DFD/test cases (add Contact, Simulator, Journey, motion, Learn nav, tile providers).

## Batch 4 DONE: Quizzes
pages/quiz.html + js/quiz.js (data-driven engine; quiz content at top of file) + CSS §27. Style quiz (5 Qs -> Alpine/Ice/Expedition with score bars + suggested peak) and safety quiz (8 Qs, instant correct/wrong + explanation, score ring, review of misses, best score in localStorage 'aa_quiz_best'). Result buttons deep-link to simulator.html#peak=<id> (simulator.js reads it). Added 'Quizzes' to Learn dropdown (10 items) + footer on every page.
BUG FIXED: plain <button class="btn btn--ghost"> rendered browser-grey; .btn base now sets background:none/color/font-family.
Tested headless: all quiz paths, deep link, 16/16 pages no errors/overflow.
NEXT: batch 5 = lengthen every page to ~5 scrolls (story + interactive + stat band + myth/fact flip cards + FAQ; hazards symptom checker, records compare chart, sheltering snow-cave diagram, techniques step diagrams, etc.); batch 6 = update ReadMe/Report/DFD/test cases (add Contact, Simulator, Journey, Quizzes, motion, Learn nav, tile providers).

## Batch 5a DONE: pages lengthened (Hazards 7.4, Techniques 8.7, Sheltering 8.3 screens @1440x900)
New js/pages.js + CSS §28: myth/fact flip cards (.flips/.flip), tabs ([data-tabs]), photo stat bands (.band, uses data-count), altitude symptom checker (#symForm, hazards), snow-cave SVG hotspots (#cave, sheltering). FAQ accordion (§23) reused. pages.js is loaded on every inner page (tag after motion.js). GOTCHA: when guarding script insertion don't search for 'js/pages.js' text (HTML comments mention it) - search for the full <script> tag.
STILL SHORT (do next, same recipe: story/interactive + band + flips + FAQ, inserted before the '<!-- CSS §11 NEXT-PAGE BAND -->' comment): information 2.4, history 2.9, types-styles, records 4.6, success-stories, developments, guidelines, gallery, clubs, contact, index (home is long already via journey). Ideas: history -> interactive timeline filter + 'then vs now' gear; types-styles -> compare table tabs; records -> compare-two-peaks bar chart; information -> anatomy-of-a-climb steps.
Then batch 6: update ReadMe/Report/DFD/test cases.

## Batch 5b DONE: Information 6.8, History 7.3 (era filter chips via [data-filter]/data-era, then-vs-now table), Types & Styles 6.7 screens (compare table, quiz CTA band). Records-only table style now scoped to #peaks.
Pages still short (do next, same recipe): records 4.6 (add compare-two-peaks bar chart), success-stories, developments, guidelines, gallery, clubs, contact. Then batch 6 docs update.
USER IDEA PENDING: user wants to show a video of a feature to implement 'in my own way'. I cannot watch video; asked for screenshots or a written description. Implement once received.

## Clubs directory rebuilt (user's reference screenshot: map on left, rich cards on right, click card -> map flies there, user location dot)
pages/clubs.html + js/clubs.js + data/clubs.js (18 clubs + 4 peaks; fields region/note/trips) + CSS §17b. Search box, type chips (data-group=t), region chips (data-group=r), two-way card<->pin sync, 'Find clubs near me' (pulsing white dot + nearest club), 'choosing a club or guide' section, flip cards, FAQ. 5.8 screens. Cards render even if Leaflet fails. Tested headless with a Leaflet STAND-IN (real map/tiles need internet - verify online).
Still short: records 4.6, success-stories, developments, guidelines, gallery, contact. Then batch 6 docs (ReadMe/Report/DFD/tests: add Contact, Simulator, Journey, Quizzes, Directory, motion, Learn nav, CARTO/Esri tiles).

## Reverted on user request: the 'make every card fully clickable (stretched link)' change (CSS §10b, .card__link/.card__go, section ids) was REMOVED. Cards on types-styles/techniques/sheltering/hazards/guidelines/developments are plain again. The Clubs directory cards (buttons that fly the map) are unchanged and stay clickable.

## Batch 5c + 6 DONE (user: 'do all three, video idea last and ask me')
All 15 inner pages now 5.4-8.4 screens (1440x900). Added: Records compare-two-peaks chart (CSS §29, js/records.js builds from #peaks table), band/flips/FAQ on Records, Stories, Developments, Guidelines (Leave No Trace tabs), Quiz, Gallery (photography tips tabs), Contact (what-happens-next timeline).
DOCS rebuilt: docs/ReadMe.docx + docs/Project_Report.docx (7 pages): 15 pages, new features, requirement table extra row, 26 test cases (Pass/Fail blank for student), updated site map + DFD (CARTO/Esri tiles, localStorage contents). Build source: /home/claude/work/docs/build.js (not in ZIP).
REMAINING: (1) USER'S VIDEO IDEA - they cannot send video; ask for screenshots or a written description, then implement in own way. (2) User must: fill name/batch/group in docs, add 2 MP4s to videos/, test online (Unsplash photos, Google Fonts, map tiles), fact-check content, fill Pass/Fail, name final ZIP Batch_Group_Title.

## MAP FIX (user screenshots): CARTO basemaps now show 'API KEY REQUIRED' watermarks -> REMOVED. All maps (clubs + simulator) use Esri World Topo (default, 'Terrain') + Esri World Imagery ('Satellite'), no key, works from file://. Fallback to satellite after 6 failed tiles. User's old site used the same Esri topo tiles and it worked. Never use CARTO/OSM tile servers again.
Directory cards are now VERY compact (name + place only); the selected card expands with description + 'known for' (CSS §17c). Hover no longer shifts cards toward the map. Docs rebuilt to say Esri tiles.

## Image robustness + dropdown fix (user: 'make sure every section has pics / pics not loading')
- Dropdown (.dd__menu) now has a SOLID background (#0b111c) - page text no longer shows through.
- images/fallback.svg + js/main.js 'Image safety net': any <img> or inline background-image that fails becomes the local mountain illustration; gallery.js no longer deletes failed tiles (lightbox falls back too). Add ?imgcheck=1 to any page URL to list broken photo links (unique ids).
- CSS §30 .sec-ph: 49 sections that had no picture got a faded photo behind their heading (decorative, aria-hidden).
- UNVERIFIED: the 8 Unsplash IDs (sandbox offline). Only 1464822759023 and 1486870591958 were seen loading in the user's screenshots. User should open pages with ?imgcheck=1 and report broken IDs so they can be replaced.

## Card list scroll polish (user: cards looked sliced/weird while scrolling)
CSS §17d: .atlas__list now fades top/bottom edges (mask-image), snaps cards (scroll-snap proximity), slim webkit scrollbar with NO arrow buttons (standard scrollbar-width props removed because they force the arrowed scrollbar in Chrome; Firefox fallback via @supports). Padding keeps first/last card fully clear of the fades.

## BLANK PHOTO FRAMES BUG (user screenshots) - FIXED
Cause: `.motion .frame.reveal` had clip-path:inset(100%) on the OBSERVED element itself; IntersectionObserver treats a fully clipped element as not visible, so frames never got `.in` and stayed blank (hero worked, frames did not). My earlier tests forced `.in` via script so never caught it.
Fix: clip the <img> inside .frame instead (CSS §24), plus a 'Reveal safety net' setInterval in main.js that adds .in to any on-screen .reveal that was missed. Learn dropdown made slimmer (min-width 196px, tighter items).
LESSON/RULE: test scroll-reveal by scrolling naturally, NEVER by force-adding .in. tests/visual_audit.py (Playwright; replace <PROJECT_ROOT>) scrolls to every .frame/.card__img/.band__bg/.cta__bg/.page-hero__bg/.sec-ph/.reveal on all pages with instant scroll + settle time and reports persistent problems. Last run: 336 elements, 0 problems.

## Location memory + dropdown width (user: asked for location on every page; dropdown too wide)
- file:// pages never get remembered geolocation permission from the browser. main.js now has window.AA_getPosition(ok,fail,{retry}): uses a saved position (localStorage 'aa_geo', 6h TTL), remembers a denial for the session (sessionStorage 'aa_geo_denied'), else asks once. Clubs 'near me' uses it too (retry:true after a denial). Ticker now prints N/S and E/W correctly (was always N/E). Tested allow/deny/stale/near-me in Playwright with mocked geolocation.
- Learn dropdown: width:max-content on desktop (141px), items nowrap.
- IDEAS PENDING USER CHOICE: visitor-counter upgrade (user likes the current simple pill). Options offered: live dot + label; odometer roll-up digits; 'Climber #N' tooltip with own-visit stats; milestone camps; icon+number minimal. Do NOT build until user picks.

## Dropdown centred (user's red-outline screenshot): desktop .dd__menu is now centred under 'Learn' (left:50% + translateX(-50%)), item text centred, box hugs the text (161px, equal 29px padding each side). Measured at 1440 and 1280. Mobile grid menu unchanged.

## Visitor counter upgrade DONE (user chose: live dot + rolling digits + 'Climber #' hover)
Markup in every page: .visitors (tabindex=0) > i.live + b#visitCount + span.lbl + .vtip#visTip. main.js builds odometer digit columns (.odo/.odo__col, --d) rolling 0->digit; reduced-motion = plain text. Hover/focus card: 'Climber #N', 'Your visits: X . first seen DATE' (localStorage aa_visits/aa_mine/aa_first), 'Counted in this browser only'. CSS §4c. Counter still increments on EVERY page load (per-browser demo, no server). Docs updated (requirement row + test T27).

## Counter rule + flip card fix (user: count only visits/refreshes; screenshot showed mirrored flip-card backs)
- Visitor counter now counts ONLY a new visit (first page in a tab/session: sessionStorage 'aa_session') or a refresh (navigation type 'reload'). Page-to-page clicks, Back/Forward do not count. New tab = new visit. Tested in Playwright. Docs T4 updated.
- Flip cards (CSS §28 cont.): besides backface-visibility, the turned-away face is faded via opacity at the flip midpoint, so the wrong/mirrored face can never show. Verified with backface-visibility force-disabled.
- NOTE: in full-page screenshots, sections below the scroll position look blank (scroll-reveal hasn't fired) - not a bug.

## RULE (user): NO visible text anywhere on the site may mention Aptech, eProject, 'project', students, or how the site was built (HTML/JS/no server etc.). Footer is now '© 2026 Alpine Ascents. All rights reserved.' Contact/Gallery FAQs and the quiz noscript line were reworded; gallery.js missing-video message is now visitor-friendly. Scan tool: /home/claude/work/textscan.py (ignore 'innerHTML' code hits and the phrase 'built with care' in sheltering). Code comments and docs/ (ReadMe, Report) may still mention the project - they are not site text.

## Fixes from user's 4 screenshots (CSS §31)
1) History: timeline now in .tl__wrap with a STICKY era photo on the right (.tl__photo; crossfades golden/early/modern + caption follows milestone via js/pages.js). 2) Techniques: 4th card 'Crampon technique' (.cards--4) so 'Four to master first' is true; Guidelines heading corrected to 'Three habits' (+ band stat 3). 3) .checks legends now inside boxes (float legend). 4) Records compare: height label covered select A (clicks landed on <b>); label now pointer-events:none and bar has 72px top margin; selects z-index 2.
ROOT-CAUSE NOTE: .section{overflow:hidden} (added for .sec-ph) silently broke position:sticky everywhere inside sections -> now overflow:clip (with hidden as fallback). When adding overflow rules, re-test sticky elements (.tl__photo, .sym__res, .sim__res).
RULE: headings with number words ('Four to...') must match the item count - checked all pages; only techniques and guidelines were wrong.

## Pinned timeline photo, v2 (user: photo looked half-cut while pinned; Records right side empty)
- .tl__photo .frame height = min(500px, 100vh-170px) (dvh where supported), pinned at top:96px -> never cut off, even in a 560px-tall window (tested 1440x900, 1366x640, 1280x560).
- Same component now on history (era photos via data-era), records, developments, contact (items get data-ph="p0.." matching <img data-ph>). js/pages.js: setPh uses el.dataset.ph||el.dataset.era; filter-chip hook guarded for pages without [data-filter]; first caption set on load.
- To add the photo to another timeline: wrap .timeline in .tl__wrap, add data-ph to each .tl, add <aside class=tl__photo> with matching <img data-ph>. (Python helper add_photo existed in the build session.)

## Gallery films = YouTube (user: 'just put a YouTube link')
videos/ folder REMOVED. The two video tiles use data-yt ids from Red Bull's official uploads: cjZvFY6__qw 'Everest: the first ski descent without oxygen' (Andrzej Bargiel, 2025) and TiGkU_eXJa8 'K2: the first ski descent'. js/gallery.js builds a youtube-nocookie iframe (autoplay, referrerpolicy strict-origin-when-cross-origin) + always-visible 'Watch on YouTube' link (embeds from file:// pages can fail with YouTube 'Error 153'; the link is the guaranteed fallback). CSS §19 cont. .lb__video. Closing the lightbox removes the iframe (stops playback). IDs came from search results (unable to test playback offline) - if a video is removed/blocked, swap the data-yt id in pages/gallery.html. Local-MP4 path (data-src) still supported in gallery.js.
USER DECISIONS: no saving photos locally (keep Unsplash hotlinks + illustration fallback).

## New logo + video thumbnails (user screenshots: YouTube Error 153 / black box; wanted a creative climber logo)
- LOGO: images/logo.svg = round badge, orange climber with raised ice axe on a snowy summit, pale sun, navy sky, glacier ring. Inline copy (class .lg) in every page's <a class="logo">; hover swings the axe arm (CSS §4d .lg-arm) + slight scale. Also the browser-tab favicon (<link rel=icon href=images/logo.svg>, added to all pages). Wordmark text unchanged. Logo size 42px (36px <=1400px wide).
- VIDEO: gallery video tiles now use real YouTube thumbnails (https://i.ytimg.com/vi/ID/hqdefault.jpg, cropped 16:9). Lightbox shows thumbnail + big play button (CSS §19 cont. .lb__poster/.lb__play). On http(s) pages the button swaps in the youtube-nocookie iframe; on file:// pages (YouTube blocks embeds there: Error 153) it opens YouTube in a new tab. 'Watch on YouTube' link always shown. Thumbnail chain: ytimg -> tile img -> fallback.svg.
- GOTCHA: do not run `pkill -f "http.server 8765"` inside a bash tool call (matches itself and kills the shell); use "[h]ttp.server".

## Logo is STILL (user: 'a still image logo please')
All hover animation removed (CSS §4d is now only a comment; no .lg-arm/.logo:hover rules). Logo files: images/logo.svg (vector), images/logo.png (512px, transparent), images/favicon.png (64px). Tab icon: svg + png fallback links on every page. The inline .lg copy in each nav is static.

## FINAL CHECKS + CODE COMMENTS DONE (user: 'do all final checks and put comments so the code is easy to understand')
- Final checks run & clean: static (links, anchors, ids, labels, headings, nav consistency, JS syntax, CSS usage, forbidden text), runtime 16 pages x 4 sizes in Chromium (0 problems; Firefox/WebKit NOT available in sandbox), reduced motion, phone menu, simulator selector, all regression tests, natural-scroll visual audit (342 elements, 0 problems). Fixes this round: -webkit- prefixes for backdrop-filter/appearance; simulator segmented control no longer uses :has().
- COMMENTS (generated by tests/annotate_*.py, verified to change NO rules/markup): css/style.css has a TOC header + '▸ .class — <tag> on: pages (§N)' above every class (201). Every page has a banner under <body> and a '▼' comment above each section/header/footer/ticker (278) listing CSS classes grouped by §N and the JS file. Every js/ and data/ file starts with a '◆ FILE GUIDE'. ReadMe section 5 explains how to read them.
- IF YOU EDIT THE SITE: re-run tests/annotate_css.py, annotate_html.py, annotate_js.py (set paths: they use /home/claude/alpine-ascents/ - change to your project root) so comments stay accurate; they are re-runnable.
- tests/: final_check.py, runtime_check.py, behaviour_check.py, visual_audit.py (replace <PROJECT_ROOT>), plus the annotate scripts.

## Visitor counter reset to 0 (user request)
Seed is now 0 (was 12480). One-time version marker localStorage 'aa_counter_v'='2' wipes old saved aa_visits/aa_mine/aa_first so the user's browser restarts at 0 too. ?resetcounter=1 on any page URL resets to 0 and does not count that load. First visit after reset shows 1 (the visitor counts). Rules unchanged: new tab/session or refresh counts, page changes do not. Tested incl. a browser holding an old value of 96.
