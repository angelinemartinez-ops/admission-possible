import {initializeClosingExperience} from './closing-experience.js';

// Give every internal page the same closing footer as the homepage.
if (!document.body.classList.contains('cinematic-home')) {
  document.body.classList.add('site-footer-page');

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'closing-experience.css';
  document.head.append(stylesheet);

  const footer = document.createElement('div');
  footer.className = 'closing-experience spotlight-surface';
  footer.innerHTML = `<footer class="closing-footer spotlight-surface"><a class="giant-brand" href="join.html" aria-label="(Ad)mission Possible — Join Us"><span class="giant-brand-base"><img src="assets/brand-transparent.png" alt=""><span class="giant-brand-wordmark">(Ad)mission<br>Possible</span></span><span class="giant-brand-color" aria-hidden="true"><img src="assets/brand-transparent.png" alt=""><span class="giant-brand-wordmark">(Ad)mission<br>Possible</span></span></a><div class="footer-panel spotlight-surface"><div class="footer-bottom"><div><p class="eyebrow">EXPLORE</p><a href="about.html">About Us</a><a href="./#offer">What We Offer</a><a href="./#how-it-works">How It Works</a><a href="join.html">Join Us</a></div><div><p class="eyebrow">RESOURCES</p><a href="application-pathways.html">Application Pathways</a><a href="student-guides.html">Student Guides</a><a href="faq.html">FAQ</a></div><div><p class="eyebrow">CONNECT</p><a href="contact.html">Contact Us</a><a href="https://www.instagram.com/admission.possible/">Instagram</a><a href="https://discord.gg/m2MMdVcVng">Discord</a><a href="https://www.linkedin.com/company/ad-mission-possible/">LinkedIn</a></div></div><div class="footer-meta"><span>© <span class="footer-year">${new Date().getFullYear()}</span> (Ad)mission Possible</span><a href="#">Back to top ↑</a></div></div></footer>`;

  document.querySelector('footer')?.remove();
  document.body.append(footer);

  initializeClosingExperience(footer);
}
