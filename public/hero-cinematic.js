const hero=document.querySelector('.cinematic-hero');
if(hero){
  const stage=hero.querySelector('.cinematic-stage');
  const photos=[...hero.querySelectorAll('.cinematic-photo')];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let raf=0;
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const ease=n=>n*n*(3-2*n);
  function setComplete(done){document.documentElement.classList.toggle('cinematic-done',done);document.documentElement.classList.toggle('cinematic-pending',!done);document.body.classList.toggle('cinematic-sequence-complete',done);}
  function layout(){
    if(reduced.matches){setComplete(true);return;}
    const rect=hero.getBoundingClientRect();
    const travel=Math.max(1,hero.offsetHeight-innerHeight);
    const p=clamp(-rect.top/travel);
    const spread=.12 + ease(clamp(p/.62))*.88;
    const release=clamp((p-.72)/.28);
    stage.style.setProperty('--hero-progress',p.toFixed(4));
    const w=innerWidth,h=innerHeight;
    const specs=[
      [0,0,0,0,0,.1],[-1,-.16,-.08,-18,-16,.95],[-1,-.33,-.16,-28,-13,1],[-1,-.52,-.25,-39,-10,1],[-1,-.72,-.33,-50,-8,1],
      [1,.16,.08,18,16,.95],[1,.33,.16,28,13,1],[1,.52,.25,39,10,1],[1,.72,.33,50,8,1]
    ];
    photos.forEach((photo,i)=>{const [side,x,y,ry,rz,base]=specs[i];let tx=x*w*(.22+.85*spread),ty=y*h*(.12+.16*spread),tz=-80+spread*420,scale=.32+spread*(i===0?.5:.48),opacity=base;
      if(i===0){tx=0;ty=0;tz=-20+spread*540;scale=.42+spread*2.35;opacity=1-release*.8;}
      else {tx+=side*release*w*.15;ty+=release*h*(i%2?-.04:.05);tz-=release*180;scale+=release*.2;opacity=Math.max(.08,1-release*.8)}
      photo.style.opacity=opacity;photo.style.transform=`translate3d(calc(-50% + ${tx}px),calc(-50% + ${ty}px),${tz}px) rotateY(${side*ry*spread}deg) rotateZ(${side*rz*spread}deg) scale(${scale})`;
      photo.style.zIndex=String(i===0?6:Math.round(7-Math.abs(x)*2));
    });
    setComplete(p>=.93);
  }
  const request=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;layout()})};
  addEventListener('scroll',request,{passive:true});addEventListener('resize',request);reduced.addEventListener('change',request);
  hero.querySelector('.cinematic-skip')?.addEventListener('click',()=>{window.scrollTo({top:hero.offsetTop+hero.offsetHeight-innerHeight+4,behavior:reduced.matches?'auto':'smooth'});});
  layout();
}
