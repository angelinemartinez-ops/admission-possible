const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion.matches) {
  document.querySelectorAll('.spotlight-surface').forEach(surface => {
    surface.addEventListener('pointermove', event => {
      const bounds = surface.getBoundingClientRect();
      surface.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
      surface.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
      surface.style.setProperty('--spot-opacity', '1');
    }, { passive: true });
    surface.addEventListener('pointerleave', () => {
      surface.style.setProperty('--spot-opacity', '0');
    });
  });
}

const footer = document.querySelector('.closing-footer');
const brand = footer?.querySelector('.giant-brand');
if (footer && brand && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      brand.classList.add('is-visible');
      observer.disconnect();
    }
  }, { threshold: .15 });
  observer.observe(brand);
  footer.classList.add('closing-motion-ready');
}
