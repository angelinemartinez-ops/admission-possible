import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync('public/hero-cinematic.js','utf8');
function scene(reduce=false) {
 let top=0; const events={}, classes=new Set();
 const panels=Array.from({length:4},()=>({style:{}})), satellites=Array.from({length:10},()=>({style:{}}));
 const stage={clientWidth:1440,clientHeight:900},track={style:{}},cue={style:{}},nav={};
 const hero={offsetHeight:reduce?900:5400,offsetTop:0,getBoundingClientRect:()=>({top,bottom:top+(reduce?900:5400)}),querySelector:s=>({'.cinematic-stage':stage,'.cinematic-track':track,'.cinematic-scroll-cue':cue,'.cinematic-copy':{style:{}},'.cinematic-skip':{addEventListener(){}}})[s],querySelectorAll:s=>s==='.cinematic-panel'?panels:satellites};
 vm.runInNewContext(source,{document:{querySelector:s=>s==='.cinematic-hero'?hero:nav,body:{classList:{add:x=>classes.add(x),toggle:(x,b)=>b?classes.add(x):classes.delete(x)}}},matchMedia:()=>({matches:reduce,addEventListener(){}}),addEventListener:(e,f)=>events[e]=f,requestAnimationFrame:f=>{f();return 0},ResizeObserver:class{observe(){}},scrollTo(){}});
 return {panels,track,nav,classes,at(p){top=-4500*p;events.scroll();}};
}
const s=scene();assert.equal(s.nav.inert,true);assert.equal(s.panels[0].style.transform,'scale(0.42)');
s.at(.30);assert.equal(s.panels[0].style.transform,'scale(1)');assert.equal(s.nav.inert,true);
s.at(.64);const middle=s.track.style.transform;assert.match(middle,/-2160px/);assert.equal(s.nav.inert,true);
s.at(1);assert.equal(s.nav.inert,false);assert.match(s.track.style.transform,/-4320px/);
s.at(.64);assert.equal(s.track.style.transform,middle);assert.equal(s.nav.inert,true);
const r=scene(true);r.at(.8);assert.equal(r.nav.inert,false);assert.equal(r.panels[0].style.transform,'scale(0.42)');
console.log('Hero checks passed: opening, full-screen seam, horizontal travel, release, reverse scroll, reduced motion.');
