const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

export function initializeClosingExperience(surface) {
  if (!surface) return;
  const footer = surface.querySelector('.closing-footer');
  const brand = footer?.querySelector('.giant-brand');

  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion.matches) {
    surface.addEventListener('pointermove', event => {
      if (event.target.closest('.footer-panel')) {
        surface.style.setProperty('--spot-opacity', '0');
        return;
      }
      const bounds = surface.getBoundingClientRect();
      surface.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
      surface.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
      surface.style.setProperty('--spot-opacity', '1');
    }, { passive: true });
    surface.addEventListener('pointerleave', () => {
      surface.style.setProperty('--spot-opacity', '0');
    });
  }
  if (brand && matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion.matches) {
    brand.addEventListener('pointermove', event => {
      const bounds = brand.getBoundingClientRect();
      brand.style.setProperty('--logo-x', `${event.clientX - bounds.left}px`);
      brand.style.setProperty('--logo-y', `${event.clientY - bounds.top}px`);
      brand.style.setProperty('--logo-opacity', '1');
    }, { passive: true });
    brand.addEventListener('pointerleave', () => {
      brand.style.setProperty('--logo-opacity', '0');
    });
  }
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
}

if (document.body.classList.contains('cinematic-home')) {
  initializeClosingExperience(document.querySelector('.closing-experience'));
}
