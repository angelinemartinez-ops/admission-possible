// Original photo choreography, using only the project's university photographs.
export function initializePhotoScenes(images, reduced, isPaused) {
  const scenes = [...document.querySelectorAll('[data-scene]')].map(el => {
    const final = el.dataset.scene === 'final';
    const selection = final ? images : [0, 8, 4, 12, 2, 7, 14, 6, 13, 17, 1, 16, 3].map(i => images[i]);
    const nodes = selection.map((photo, i) => {
      const img = document.createElement('img');
      img.src = photo.src; img.alt = ''; img.className = 'photo-panel';
      img.loading = final ? 'lazy' : 'eager'; img.decoding = 'async';
      el.append(img);
      return {img, i};
    });
    const scene = {el, final, nodes, width: 0, height: 0, visible: false, started: null};
    new ResizeObserver(([entry]) => {scene.width = entry.contentRect.width; scene.height = entry.contentRect.height; size(scene)}).observe(el);
    return scene;
  });
  function size(scene) {
    const {width: w, height: h, final} = scene;
    const width = final ? Math.min(220, Math.max(112, w * .115)) : Math.min(260, Math.max(112, w * .16));
    const height = final ? width : Math.min(h * .92, w * .205);
    scene.nodes.forEach(({img}) => {img.style.width = `${width}px`; img.style.height = `${height}px`;});
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    const scene = scenes.find(s => s.el === entry.target); scene.visible = entry.isIntersecting;
  }), {rootMargin: '120px'});
  scenes.forEach(scene => observer.observe(scene.el));
  let time = 0, last = 0;
  function frame(now) {
    const delta = last ? Math.min(now - last, 50) / 1000 : 0; last = now;
    if (!isPaused() && !reduced.matches && !document.hidden) time += delta;
    scenes.forEach(scene => {
      if (!scene.visible || !scene.width) return;
      scene.started ??= time;
      const {width: w, height: h, final, nodes} = scene;
      nodes.forEach(({img, i}) => {
        let x, y, scale, rotate, perspective = 0, opacity = 1;
        if (final) {
          // Each panel crosses the same continuous arc and wraps entirely offscreen.
          const t = (i / nodes.length + time / 34) % 1;
          const extent = w + 620;
          x = -310 + t * extent;
          const n = (x - w / 2) / (w / 2);
          y = h * .36 + Math.cos(Math.min(1.4, Math.abs(n)) * Math.PI) * h * .20;
          scale = .88 + Math.min(1, Math.abs(n)) * .18;
          rotate = Math.sin(n * Math.PI) * 9;
        } else {
          // Continuous center-outward filmstrip: every frame is derived from one
          // shared phase so the two mirrored streams stay synchronized.
          const center = (nodes.length - 1) / 2;
          const phase = reduced.matches || isPaused() ? 0 : (time * 0.34) % 1;
          const q = i - center + phase;
          const side = q < 0 ? -1 : 1;
          const distance = Math.abs(q);
          const maxDistance = center + 1;
          const t = Math.min(1, distance / maxDistance);
          const base = Math.min(150, Math.max(74, w * .105));
          const width = base * (0.72 + t * 0.9);
          const height = Math.min(h * .46, width * 1.14);
          // Edge-to-edge near the vanishing point; perspective and rotation
          // create the outward fan as the panels move toward the viewer.
          const gapless = base * 0.72;
          const x = w / 2 + side * (gapless * (distance + 0.5 * t * distance));
          const y = h * .49 + Math.sin(time * .4 + i * .5) * 2;
          const scale = 0.72 + t * 0.7;
          const rotateY = side * (t * 34);
          const rotateZ = side * (-t * 7);
          const z = t * 260;
          img.style.width = `${width}px`;
          img.style.height = `${height}px`;
          img.style.transform = `translate3d(${x}px,${y}px,${z}px) translate(-50%,-50%) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
          img.style.opacity = 1;
          img.style.zIndex = String(100 + Math.round(t * 100));
          return;
        }
        img.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%) perspective(1000px) rotateY(${perspective}deg) rotate(${rotate}deg) scale(${scale})`;
        img.style.opacity = opacity;
        img.style.zIndex = String(final ? i : Math.abs(i - 6));
      });
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
