/* ◆ FILE GUIDE ──────────────────────────────────────────────────────────────────────────────────
   js/clubs.js - CLUBS page only (pages/clubs.html); needs data/clubs.js (CLUBS + PEAKS) and the Leaflet map library
   WHAT IT DOES:
     Builds one compact card (.place) per club / peak in #placeList and one pin per item on #map (Esri map tiles).
     Click a card -> map flies there; click a pin -> its card opens. Search #placeSearch, filter chips (data-group "t" type / "r" region),
     "Find clubs near me" #geoBtn -> pulsing dot + nearest club in #geoStatus (uses window.AA_getPosition from main.js).
     Cards still render if the map cannot load. CSS: §17, §17b, §17c, §17d.
   HTML IT USES: #map #placeList #placeSearch #geoBtn #geoStatus #placeCount #placeEmpty .place
   (Each HTML section has a "▼" comment naming the JS file that powers it; CSS classes are explained in css/style.css.)
──────────────────────────────────────────────────────────────────────────────────────────────── */

/* Clubs and expeditions directory: cards <-> map pins, search, filters, geolocation. Styles: css/style.css §17 + §17b.
   Data: data/clubs.js. Cards render even if the map library cannot load. */
(function(){
  'use strict';
  const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
  const items=[...CLUBS.map(c=>({...c,t:'club'})),...PEAKS.map(p=>({...p,t:'peak'}))];
  const hasMap=typeof L!=='undefined', list=$('#placeList'), geo=$('#geoStatus'), count=$('#placeCount'), empty=$('#placeEmpty'), mapEl=$('#map');
  const st={t:'all',r:'all',q:''}, esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  let map=null;
  if(hasMap){
    map=L.map('map',{scrollWheelZoom:false,dragging:!L.Browser.mobile}).setView([30,50],3);
    /* Esri tiles: free, no API key, and they work from file:// (OpenStreetMap blocks pages with no Referer; CARTO now needs a key) */
    const topo=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',{maxZoom:17,attribution:'Tiles © Esri, USGS, NOAA'}).addTo(map);
    const sat=L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:17,attribution:'Tiles © Esri, Maxar, Earthstar Geographics'});
    L.control.layers({'Terrain':topo,'Satellite':sat},null,{position:'topright'}).addTo(map);
    let fails=0;topo.on('tileerror',()=>{if(++fails===6){map.removeLayer(topo);sat.addTo(map)}}); /* fall back to satellite if Terrain is ever blocked */
  }else{mapEl.style.display='grid';mapEl.style.placeItems='center';mapEl.style.padding='24px';mapEl.style.textAlign='center';mapEl.textContent='The map could not load. Check your internet connection and refresh. The directory still works.'}
  const pin=(t,c)=>L.divIcon({className:'pin pin--'+(c||t),iconSize:[18,18]});
  function activate(it,scroll){
    items.forEach(x=>x.btn.classList.toggle('active',x===it));
    if(scroll)list.scrollTo({top:it.li.offsetTop-list.offsetTop-8,behavior:'smooth'});
  }
  items.forEach(it=>{
    const li=document.createElement('li'),b=document.createElement('button');
    b.type='button';b.className='place '+it.t;
    b.innerHTML='<i>'+(it.t==='club'?'Club':'Peak')+'</i><b>'+esc(it.name)+'</b><span class="place__loc"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1a5 5 0 0 0-5 5c0 3.6 5 9 5 9s5-5.4 5-9a5 5 0 0 0-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>'+esc(it.place)+'</span><p class="place__desc">'+esc(it.note)+'</p><p class="place__trips"><strong>'+(it.t==='club'?'Known for':'Season')+':</strong> '+esc(it.trips.replace(/^Best season: /,''))+'</p>';
    li.appendChild(b);list.appendChild(li);it.li=li;it.btn=b;
    if(hasMap){
      it.marker=L.marker([it.lat,it.lng],{icon:pin(it.t),title:it.name}).addTo(map)
        .bindPopup('<strong>'+esc(it.name)+'</strong><br>'+esc(it.place)+'<br>'+esc(it.note));
      it.marker.on('click',()=>activate(it,true));
    }
    b.addEventListener('click',()=>{
      activate(it,false);
      if(hasMap){map.flyTo([it.lat,it.lng],it.t==='peak'?6:9,{duration:1.4});it.marker.openPopup();
        if(innerWidth<=960)mapEl.scrollIntoView({behavior:'smooth',block:'center'})}
    });
  });
  function apply(fit){
    const q=st.q.trim().toLowerCase();
    const vis=items.filter(i=>(st.t==='all'||st.t===i.t)&&(st.r==='all'||st.r===i.region)&&(!q||(i.name+' '+i.place+' '+i.note+' '+i.trips).toLowerCase().includes(q)));
    items.forEach(i=>{const on=vis.includes(i);i.li.hidden=!on;if(hasMap){on?i.marker.addTo(map):map.removeLayer(i.marker)}});
    count.textContent=vis.length+' of '+items.length+' shown';empty.hidden=vis.length>0;
    if(hasMap&&fit&&vis.length)map.flyToBounds(L.latLngBounds(vis.map(i=>[i.lat,i.lng])),{padding:[50,50],maxZoom:6,duration:1.2});
  }
  $$('.chips[data-group]').forEach(g=>g.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{
    g.querySelectorAll('.chip').forEach(x=>{x.classList.toggle('on',x===c);x.setAttribute('aria-pressed',x===c)});
    st[g.dataset.group]=c.dataset.f;apply(true);
  })));
  $('#placeSearch').addEventListener('input',e=>{st.q=e.target.value;apply(false)});
  /* Geolocation: show the visitor as a pulsing dot and name the nearest club */
  const rad=d=>d*Math.PI/180;
  const km=(a,b,c,d)=>{const x=Math.sin(rad(c-a)/2)**2+Math.cos(rad(a))*Math.cos(rad(c))*Math.sin(rad(d-b)/2)**2;return 12742*Math.asin(Math.sqrt(x))};
  $('#geoBtn').addEventListener('click',()=>{
    geo.textContent='Finding your position…';
    AA_getPosition(p=>{
      const la=p.coords.latitude,lo=p.coords.longitude;
      const near=CLUBS.map(c=>({c,d:km(la,lo,c.lat,c.lng)})).sort((a,b)=>a.d-b.d)[0];
      geo.textContent='Your location is shown as the pulsing white dot. Nearest club: '+near.c.name+', about '+Math.round(near.d).toLocaleString()+' km away.';
      const it=items.find(i=>i.name===near.c.name);activate(it,true);
      if(hasMap){L.marker([la,lo],{icon:pin('me','me')}).addTo(map).bindPopup('You are here');
        map.flyToBounds([[la,lo],[near.c.lat,near.c.lng]],{padding:[60,60],duration:1.6})}
    },()=>{geo.textContent='Location permission was denied, so the directory shows every club instead.'},{retry:true});
  });
  apply(false);
})();
