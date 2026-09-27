const landing = document.querySelector('.landing-intro');

if (landing) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  const clamp = value => Math.max(0, Math.min(1, value));

  function render() {
    frame = 0;
    if (reducedMotion.matches) {
      landing.style.setProperty('--landing-story-opacity', '1');
      return;
    }
    const rect = landing.getBoundingClientRect();
    const travel = Math.max(1, landing.offsetHeight - innerHeight);
    const progress = clamp(-rect.top / travel);
    landing.style.setProperty('--landing-story-opacity', (.42 + progress * .58).toFixed(4));
    landing.style.setProperty('--landing-story-shift', `${((1 - progress) * innerHeight * .025).toFixed(1)}px`);
    landing.style.setProperty('--landing-title-shift', `${(-progress * innerHeight * 1.15).toFixed(1)}px`);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reducedMotion.addEventListener('change', schedule);
  render();
}
