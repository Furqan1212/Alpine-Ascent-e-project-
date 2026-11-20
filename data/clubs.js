/* ◆ FILE GUIDE ──────────────────────────────────────────────────────────────────────────────────
   data/clubs.js - data for the CLUBS page (loaded by pages/clubs.html before js/clubs.js)
   WHAT IT DOES:
     window.CLUBS = mountaineering clubs; window.PEAKS = expedition peaks. Fields: name, place, region (asia/europe/americas/africa),
     lat, lng, note (shown on the card + map popup), trips ("Known for" / season line). Add or edit entries here - no other file needs changing.
   HTML IT USES: CLUBS PEAKS
   (Each HTML section has a "▼" comment naming the JS file that powers it; CSS classes are explained in css/style.css.)
──────────────────────────────────────────────────────────────────────────────────────────────── */

/* Local data for pages/clubs.html (a .js file because fetch() of .json is blocked on file://).
   region: asia | europe | americas | africa.  Descriptions are deliberately general; founding years are the clubs' own. */
window.CLUBS=[
 {name:"Alpine Club of Pakistan",place:"Islamabad, Pakistan",region:"asia",lat:33.6844,lng:73.0479,note:"The national body for mountaineering in Pakistan. Supports climbers and expeditions in the Karakoram, Hindu Kush and Himalaya.",trips:"Karakoram and Hindu Kush expeditions"},
 {name:"Nepal Mountaineering Association",place:"Kathmandu, Nepal",region:"asia",lat:27.7172,lng:85.324,note:"Founded in 1973. Supports climbers and Sherpa communities and issues permits for Nepal's trekking peaks.",trips:"Trekking peaks and Himalayan permits"},
 {name:"Himalayan Mountaineering Institute",place:"Darjeeling, India",region:"asia",lat:27.0360,lng:88.2627,note:"Founded in 1954 after the first Everest ascent. Trains climbers and guides in basic and advanced courses.",trips:"Training courses and Sikkim expeditions"},
 {name:"The Himalayan Club",place:"Mumbai, India",region:"asia",lat:19.076,lng:72.8777,note:"Founded in 1928 to encourage Himalayan exploration, with a respected library and journal.",trips:"Himalayan treks and exploration"},
 {name:"Indian Mountaineering Foundation",place:"New Delhi, India",region:"asia",lat:28.6139,lng:77.209,note:"Founded in 1961. Coordinates expeditions and mountaineering policy across India.",trips:"Expedition permissions and training"},
 {name:"Chinese Mountaineering Association",place:"Beijing, China",region:"asia",lat:39.9042,lng:116.4074,note:"Founded in 1958. Governs mountaineering in China, including peaks on the Tibetan side of the Himalaya.",trips:"Tibetan-side peaks and permits"},
 {name:"Japanese Alpine Club",place:"Tokyo, Japan",region:"asia",lat:35.6762,lng:139.6503,note:"Founded in 1905. One of Asia's oldest climbing clubs, with a strong history of Himalayan expeditions.",trips:"Japan Alps and Himalayan expeditions"},
 {name:"UIAA",place:"Bern, Switzerland",region:"europe",lat:46.948,lng:7.4474,note:"Founded in 1932. The international mountaineering federation and a leading voice on safety standards.",trips:"Safety standards and international events"},
 {name:"The Alpine Club",place:"London, United Kingdom",region:"europe",lat:51.5074,lng:-0.1278,note:"Founded in 1857. The world's first mountaineering club, with a famous library and photographic archive.",trips:"Alpine meets and expedition support"},
 {name:"British Mountaineering Council",place:"Manchester, United Kingdom",region:"europe",lat:53.4808,lng:-2.2426,note:"Founded in 1944. Represents climbers and hill walkers and promotes access and safety.",trips:"Courses, access and safety guidance"},
 {name:"Club Alpin Français",place:"Paris, France",region:"europe",lat:48.8566,lng:2.3522,note:"Founded in 1874. Runs mountain huts and courses across the French Alps.",trips:"Mont Blanc and French Alps"},
 {name:"Swiss Alpine Club",place:"Bern, Switzerland",region:"europe",lat:46.9481,lng:7.4474,note:"Founded in 1863. Looks after a large network of mountain huts across the Swiss Alps.",trips:"Hut-to-hut routes and Alpine courses"},
 {name:"German Alpine Club (DAV)",place:"Munich, Germany",region:"europe",lat:48.1351,lng:11.582,note:"Founded in 1869. One of the world's largest mountaineering associations, with a huge hut and climbing-wall network.",trips:"Alpine routes, courses and climbing halls"},
 {name:"Club Alpino Italiano",place:"Milan, Italy",region:"europe",lat:45.4642,lng:9.19,note:"Founded in Turin in 1863. Maintains huts and trails across the Italian Alps and Dolomites.",trips:"Dolomites and Italian Alps"},
 {name:"American Alpine Club",place:"Golden, Colorado, USA",region:"americas",lat:39.7555,lng:-105.2211,note:"Founded in 1902. Publishes the American Alpine Journal and supports climbing research and rescue.",trips:"Rescue insurance and expedition grants"},
 {name:"Alpine Club of Canada",place:"Canmore, Alberta, Canada",region:"americas",lat:51.0884,lng:-115.3479,note:"Founded in 1906. Runs huts, courses and trips in the Canadian Rockies.",trips:"Canadian Rockies huts and courses"},
 {name:"Mountain Club of South Africa",place:"Cape Town, South Africa",region:"africa",lat:-33.9249,lng:18.4241,note:"Founded in 1891. Organises climbing, hiking and mountain rescue around Table Mountain and beyond.",trips:"Table Mountain and Drakensberg"},
 {name:"Kilimanjaro National Park Authority",place:"Moshi, Tanzania",region:"africa",lat:-3.3349,lng:37.3404,note:"Manages Kilimanjaro National Park, sets park fees and regulates guides and porters on Africa's highest peak.",trips:"Kilimanjaro routes and permits"}
];
window.PEAKS=[
 {name:"Mount Everest",place:"Nepal / China · 8,849 m",region:"asia",lat:27.9881,lng:86.925,note:"Highest mountain on Earth. First climbed in 1953.",trips:"Best season: April to May"},
 {name:"K2",place:"Pakistan / China · 8,611 m",region:"asia",lat:35.8825,lng:76.5133,note:"Second highest, and the hardest of the 8,000ers. First climbed in 1954.",trips:"Best season: July"},
 {name:"Kangchenjunga",place:"Nepal / India · 8,586 m",region:"asia",lat:27.7025,lng:88.1475,note:"Third highest mountain. First climbed in 1955.",trips:"Best season: April to May"},
 {name:"Nanga Parbat",place:"Pakistan · 8,126 m",region:"asia",lat:35.2375,lng:74.5892,note:"The 'Killer Mountain'. First climbed solo by Hermann Buhl in 1953.",trips:"Best season: June to July"}
];
