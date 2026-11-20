/* ◆ FILE GUIDE ──────────────────────────────────────────────────────────────────────────────────
   data/sim-peaks.js - data for the SIMULATOR page (loaded by pages/simulator.html before js/simulator.js)
   WHAT IT DOES:
     window.SIM_PEAKS = the 7 mountains: permit fee, operator fees [budget, guided, premium], days, flights, gear, insurance, difficulty,
     base success rate, best/shoulder months, whether bottled oxygen applies (o2) and the main risks. All amounts are rough USD estimates.
   HTML IT USES: SIM_PEAKS
   (Each HTML section has a "▼" comment naming the JS file that powers it; CSS classes are explained in css/style.css.)
──────────────────────────────────────────────────────────────────────────────────────────────── */

/* Data for pages/simulator.html. ALL VALUES ARE ROUGH 2026 ESTIMATES IN USD.
   Sources: Nepal Everest royalty $15,000 (Alan Arnette; Global Summit Guide), Denali $450, Aconcagua ~$980,
   Kilimanjaro park fees $500-1,500, operator ranges from Global Summit Guide / Alan Arnette. K2, Nanga Parbat and
   Mont Blanc operator costs are modelled estimates. op = [budget, guided, premium] operator fee per person EXCLUDING permit and bottled oxygen. */
window.SIM_PEAKS=[
 {id:'everest',name:'Mount Everest',range:'Himalaya',country:'Nepal / China',h:8849,lat:27.9881,lng:86.925,permit:15000,op:[20000,38000,65000],days:60,flights:1200,gear:6000,ins:2200,diff:8.5,base:.55,best:[4,5],shoulder:[3,10,11],o2:true,
  risks:['Khumbu Icefall: shifting ice towers and crevasses','Altitude illness (HAPE and HACE) above 7,000 m','Crowding and narrow summit-day weather windows']},
 {id:'k2',name:'K2',range:'Karakoram',country:'Pakistan / China',h:8611,lat:35.8825,lng:76.5133,permit:2500,op:[18000,32000,55000],days:55,flights:900,gear:5500,ins:2200,diff:9.7,base:.35,best:[7],shoulder:[6,8],o2:true,
  risks:['Rockfall and avalanche below the Bottleneck serac','Extremely steep technical climbing in high winds','Remote location, so rescue is slow']},
 {id:'nanga',name:'Nanga Parbat',range:'Karakoram',country:'Pakistan',h:8126,lat:35.2375,lng:74.5892,permit:2000,op:[12000,22000,38000],days:45,flights:800,gear:5000,ins:2000,diff:9.2,base:.3,best:[6,7],shoulder:[5,8],o2:true,
  risks:['Huge avalanche-prone faces','Violent storms and extreme cold','Long approach and difficult evacuation']},
 {id:'denali',name:'Denali',range:'Alaska',country:'USA',h:6190,lat:63.0692,lng:-151.007,permit:450,op:[8000,10500,15000],days:21,flights:2400,gear:3500,ins:900,diff:7.5,base:.55,best:[5,6],shoulder:[4,7],o2:false,
  risks:['Arctic cold, with temperatures far below freezing','Multi-day storms that pin teams in camp','Crevasses on the lower glacier']},
 {id:'aconcagua',name:'Aconcagua',range:'Andes',country:'Argentina',h:6961,lat:-32.6532,lng:-70.0109,permit:980,op:[4500,6800,10000],days:18,flights:1800,gear:2800,ins:800,diff:6.2,base:.5,best:[12,1,2],shoulder:[11,3],o2:false,
  risks:['Altitude sickness, since it is the highest peak outside Asia','Strong, cold winds on the upper mountain','Dehydration and fatigue on a long summit day']},
 {id:'kilimanjaro',name:'Kilimanjaro',range:'Africa',country:'Tanzania',h:5895,lat:-3.0674,lng:37.3556,permit:1000,op:[1800,3000,5000],days:8,flights:1100,gear:700,ins:300,diff:3.5,base:.65,best:[1,2,8,9],shoulder:[3,6,7,10,12],o2:false,
  risks:['Altitude sickness from a fast ascent','Cold and wind at the summit','Heavy rain in the wet seasons']},
 {id:'montblanc',name:'Mont Blanc',range:'Alps',country:'France / Italy',h:4806,lat:45.8326,lng:6.8652,permit:0,op:[900,1800,3200],days:5,flights:350,gear:1200,ins:200,diff:5.5,base:.6,best:[7,8],shoulder:[6,9],o2:false,
  risks:['Rockfall in the Grand Couloir','Crevasses and unstable snow bridges','Sudden storms and crowded huts']}
];
