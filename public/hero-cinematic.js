const hero = document.querySelector('.cinematic-hero');
if (hero) {
  const stage = hero.querySelector('.cinematic-stage');
  const track = hero.querySelector('.cinematic-track');
  const panels = [...hero.querySelectorAll('.cinematic-panel')];
  const satellites = [...hero.querySelectorAll('.cinematic-satellite')];
  const nav = document.querySelector('body > .nav');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = n => Math.max(0, Math.min(1, n));
  const smooth = n => n * n * (3 - 2 * n);
  // Viewport-relative positions: x, y, size, z-depth, rotation.
  const desktop = [
    [-.39,-.32,1.05,-45,-7],[-.14,-.36,.72,-90,5],[.18,-.34,.8,-65,-4],[.40,-.29,1.04,-20,6],
    [-.37,.00,1.05,35,7],[.34,.02,.92,30,6],
    [-.38,.34,1.1,-10,-5],[-.15,.36,.77,-70,7],[.18,.35,.88,-50,-7],[.39,.36,1.0,10,5],[-.30,.18,.7,-40,4]
  ];
  const mobile = [
    [-.32,-.34,1,-30,-7],[.03,-.39,.75,-50,6],[.34,-.31,.95,-20,-5],[.4,-.12,.7,-80,5],
    [-.32,-.06,.85,20,7],[.4,.15,.85,20,5],
    [-.34,.35,1,-10,-6],[-.03,.39,.65,-50,6],[.28,.34,.95,-25,-5],[.44,-.42,.55,-80,4],[-.36,.14,.7,-40,4]
  ];
  let frame = 0;
  function render() {
    frame = 0;
    const w = stage.clientWidth, h = stage.clientHeight;
    const rect = hero.getBoundingClientRect();
    const motion = !reduced.matches;
    const distance = Math.max(1, hero.offsetHeight - h);
    const progress = motion ? clamp(-rect.top / distance) : 0;
    // Expansion and travel share the same opening image element: no image swap at the seam.
    const expansion = smooth(clamp(progress / .28));
    const horizontal = clamp((progress - .32) / .64);
    hero.querySelector('.cinematic-copy').style.transform = `scale(${1 + .18 * horizontal})`;
    const complete = !motion || rect.bottom <= h + .5;
    document.body.classList.toggle('cinematic-complete', complete);
    nav.inert = !complete;
    const positions = w <= 720 ? mobile : desktop;
    satellites.forEach((photo, i) => {
      const [x,y,size,z,angle] = positions[i];
      const outward = 1 + expansion * 2.7;
      photo.style.transform = `translate(-50%,-50%) translate3d(${x*w*outward}px,${y*h*outward}px,${z + expansion*150}px) rotateY(${angle*1.5*(1-expansion)}deg) rotateZ(${angle*(1-expansion)}deg) scale(${size*(1+expansion*.8)})`;
      photo.style.opacity = String(1-smooth(clamp((expansion-.8)/.2)));
    });
    const initial = w <= 720 ? .58 : .42;
    panels[0].style.transform = `scale(${initial+(1-initial)*expansion})`;
    panels.slice(1).forEach(panel => { panel.style.visibility = expansion >= .999 ? 'visible' : 'hidden'; });
    track.style.transform = `translate3d(${-horizontal*(panels.length-1)*w}px,0,0)`;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  document.body.classList.add('cinematic-active');
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  new ResizeObserver(schedule).observe(stage);
  render();
}
