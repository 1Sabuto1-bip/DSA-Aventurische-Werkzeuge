const items = [
  // Reisebedarf
  ['Feldflasche','travel',6,.25,false],['Lederrucksack','travel',34,2,false],['Lederranzen','travel',17,1,false],['Umhängetasche','travel',12,.5,false],['Gürteltasche','travel',4,.2,false],['Brotbeutel','travel',3,.2,false],['Schlafsack','travel',7,2,false],['Wolldecke','travel',5,2,false],['Hängematte','travel',10,1.5,false],['Zelt, 2 Personen','travel',14,6,false],['Zelt, 4 Personen','travel',25,10,false],['Feuerstein und Stahl','travel',2,.1,false],['Zunder, 25 Portionen','travel',.5,.1,false],['Seil, 10 Schritt','travel',12,4,false],['Kletterhaken','travel',2,.25,false],['Karabinerhaken','travel',8,.15,false],['Kompass (Südweiser)','travel',60,.3,true],['Fernrohr','travel',250,1,true],['Peilscheibe','travel',75,.5,true],['Pergament des Reisenden','travel',80,.1,true],['Schneeschuhe','travel',8,2,false],['Wasserschlauch','travel',5,.5,false],['Laterne','travel',8,1,false],['Kerze','travel',.2,.05,false],['Öllampe','travel',2,.5,false],
  // Handwerk
  ['Hammer','craft',5,1,false],['Vorschlaghammer','craft',10,5,false],['Beil / Handaxt','craft',20,1.5,false],['Brecheisen','craft',12,3,false],['Spaten','craft',8,2.5,false],['Spitzhacke','craft',15,4,false],['Sichel','craft',10,1,false],['Sense','craft',20,3,false],['Schere','craft',5,.2,false],['Nadel- und Zwirnset','craft',3,.1,false],['Kohlestift','craft',.2,.02,false],['Kreide','craft',.1,.02,false],['Federkiel und Tinte','craft',4,.2,false],['Federmesser','craft',6,.15,false],['Dietrich','craft',5,.05,false],['Keil','craft',.5,.5,false],['Kette, 1 Schritt','craft',8,3,false],['Vorhängeschloss','craft',20,.5,false],['Zimmermannskasten','craft',45,8,false],['Kartographiewerkzeug','craft',35,2,true],['Abakus','craft',10,.5,true],['Astrolabium','craft',120,2,true],['Stundenglas','craft',30,1,true],['Taschenuhr (Vinsalter Ei)','craft',1000,.2,true],['Prisma','craft',40,.2,true],
  // Alchemie
  ['Phiole','alchemy',1,.05,false],['Tiegel','alchemy',2,.15,false],['Kupferkessel','alchemy',25,5,false],['Atemmaske','alchemy',18,.5,false],['Schutzkleidung','alchemy',50,3,false],['Alchimistenwerkzeug','alchemy',75,4,false],['Alchimistenschale','alchemy',30,1,false],['Archaisches Labor','alchemy',150,25,false],['Hexenküche','alchemy',250,30,true],['Alchimistenlabor','alchemy',500,50,true],['Analysekoffer','alchemy',300,8,true],['Athanor, fest verbaut','alchemy',750,100,true],['Koschbasalt','alchemy',80,1,true],['Blaubasalt','alchemy',120,1,true],['Unauer Glas, Rohmaterial','alchemy',25,.5,true],['Zauberkreide','alchemy',15,.05,true],
  // Essen & Proviant
  ['Proviant für 1 Tag','food',.5,1.5,false],['Brot, 1 Laib','food',.4,.5,false],['Hartwurst','food',.8,.5,false],['Käse','food',.6,.5,false],['Trockenfleisch','food',1,.5,false],['Getrocknete Früchte','food',.8,.5,false],['Nüsse','food',.5,.5,false],['Mehl, 1 Stein','food',.2,1,false],['Salz, 1 Stein','food',.5,1,false],['Honig, 1 Krug','food',2,1,false],['Bier, 1 Maß','food',.2,1,false],['Wein, einfacher, 1 Maß','food',.5,1,false],['Rotwein, guter, 1 Maß','food',3,1,true],['Gewürzmischung','food',8,.1,true],['Kaffee, 1 Pfund','food',12,.5,true],['Tee, 1 Pfund','food',8,.5,true],['Südfrucht','food',2,.25,true],['Proviantpaket Wüstenreich','food',8,4,true]
].map(([name,category,price,weight,special])=>({name,category,price,weight,special}));

items.push(...combatItems);

const quality = {
  small:{label:'Kleiner Krämerladen',count:[5,7],special:[0,0],qty:[1,4]},
  normal:{label:'Normales Sortiment',count:[7,10],special:[0,1],qty:[1,6]},
  good:{label:'Gutes Sortiment',count:[9,12],special:[1,2],qty:[1,8]},
  veryGood:{label:'Sehr gutes Sortiment',count:[11,14],special:[2,3],qty:[2,10]},
  excellent:{label:'Exzellente Auswahl',count:[13,16],special:[3,4],qty:[2,12]}
};
const categoryNames={mixed:'Gemischtwaren',travel:'Reisebedarf',craft:'Handwerkszeug',alchemy:'Alchemie',food:'Essen & Proviant',weapons:'Waffen',armor:'Rüstungen'};
const itemCategoryNames={travel:'Reise',craft:'Handwerk',alchemy:'Alchemie',food:'Proviant',weapons:'Waffen',armor:'Rüstung'};
const first=['Zum','Bei','Am','Im Haus zum'];
const nouns=['gefüllten Reisebeutel','silbernen Südweiser','roten Kupferkessel','flinken Packesel','ehrlichen Handel','goldenen Löffel','sicheren Weg','grünen Kräuterbund','klugen Raben','alten Wegstein'];
const $=id=>document.getElementById(id);
const random=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1]);
const money=value=>`${value.toLocaleString('de-DE',{minimumFractionDigits:value<1?2:0,maximumFractionDigits:2})} S`;
let current=[];

function shopName(){ $('shop-name').textContent=`${first[random(0,first.length-1)]} ${nouns[random(0,nouns.length-1)]}`; }
function poolFor(category,special){
  const base=items.filter(i=>i.special===special);
  if(category==='mixed') return base;
  const direct=base.filter(i=>i.category===category);
  if(direct.length>=4) return direct;
  return base;
}
function generate(){
  const qKey=document.querySelector('[name=quality]:checked').value;
  const q=quality[qKey],cat=$('category').value,mult=Number($('price-level').value);
  const total=random(...q.count),specialCount=Math.min(random(...q.special),total);
  const chosenSpecial=shuffle(poolFor(cat,true)).slice(0,specialCount);
  const regularPool=shuffle(poolFor(cat,false));
  let regular=[];
  if(cat==='mixed'){
    regular=['travel','craft','alchemy','food','weapons','armor'].map(group=>shuffle(items.filter(i=>!i.special&&i.category===group))[0]);
    const seeded=new Set(regular.map(i=>i.name));
    regular=regular.concat(regularPool.filter(i=>!seeded.has(i.name)).slice(0,Math.max(0,total-specialCount-regular.length)));
  } else {
    regular=regularPool.slice(0,total-specialCount);
  }
  current=shuffle([...regular,...chosenSpecial]).map(i=>({...i,stock:i.special?random(1,2):random(...q.qty),sale:Math.round(i.price*mult*100)/100}));
  $('shop-type').textContent=`${q.label} · ${categoryNames[cat]}`;
  $('summary').innerHTML=`<span>${current.length} Waren</span><span class="special">${specialCount} besondere ${specialCount===1?'Ware':'Waren'}</span><span>Preisfaktor ${mult.toLocaleString('de-DE',{maximumFractionDigits:2})}</span>`;
  $('stock').innerHTML=current.map(i=>`<tr><td>${i.special?'<span class="star" title="Besondere Ware">★</span>':''}<strong>${i.name}</strong><small>${i.weight.toLocaleString('de-DE',{maximumFractionDigits:2})} Stein</small></td><td>${itemCategoryNames[i.category]}</td><td class="number">${i.stock}</td><td class="number">${mult!==1?`<span class="price-original">${money(i.price)}</span>`:''}<strong>${money(i.sale)}</strong></td></tr>`).join('');
  shopName();
}
$('generator-form').addEventListener('submit',e=>{e.preventDefault();generate()});
$('reroll-name').addEventListener('click',shopName);
generate();
