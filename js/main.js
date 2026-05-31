// FAQ Accordion
document.addEventListener('DOMContentLoaded', () => {
  const faqContainer = document.querySelector('.faq-content');

  if (faqContainer) {
    faqContainer.addEventListener('click', (e) => {
      const groupHeader = e.target.closest('.faq-group-header');

      if (!groupHeader) return;

      const group = groupHeader.parentElement;
      const groupBody = group.querySelector('.faq-group-body');
      const icon = groupHeader.querySelector('i');

      icon.classList.toggle('fa-plus');
      icon.classList.toggle('fa-minus');
      groupBody.classList.toggle('open');

      const otherGroups = faqContainer.querySelectorAll('.faq-group');

      otherGroups.forEach((otherGroup) => {
        if (otherGroup !== group) {
          const otherGroupBody = otherGroup.querySelector('.faq-group-body');
          const otherIcon = otherGroup.querySelector('.faq-group-header i');

          otherGroupBody.classList.remove('open');
          otherIcon.classList.remove('fa-minus');
          otherIcon.classList.add('fa-plus');
        }
      });
    });
  }
});

// Mobile Menu
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerButton = document.querySelector('.hamburger-button');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburgerButton && mobileMenu) {
    hamburgerButton.addEventListener('click', () =>
      mobileMenu.classList.toggle('active')
    );
  }
});

// Screenshot lightbox — klik op telefoon = 50% groter
document.addEventListener('DOMContentLoaded', () => {
  const zoomWrappers = document.querySelectorAll('.device-shot, .phone-frame');
  if (!zoomWrappers.length) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'screenshot-lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <button type="button" class="screenshot-lightbox-close" aria-label="Sluiten">&times;</button>
    <div class="screenshot-lightbox-inner">
      <img class="screenshot-lightbox-img" alt="">
    </div>
  `;
  document.body.appendChild(lightbox);

  const closeBtn = lightbox.querySelector('.screenshot-lightbox-close');
  const lightboxImg = lightbox.querySelector('.screenshot-lightbox-img');
  let lastFocused = null;

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  const openLightbox = (img, wrapper) => {
    lastFocused = wrapper;
    const renderedWidth = img.getBoundingClientRect().width;
    const targetWidth = Math.min(renderedWidth * 2, window.innerWidth * 0.92);

    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightboxImg.style.width = `${Math.round(targetWidth)}px`;
    lightboxImg.style.maxWidth = '92vw';
    lightboxImg.style.maxHeight = '90vh';

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  zoomWrappers.forEach((wrapper) => {
    const img = wrapper.querySelector('.app-screenshot');
    if (!img) return;

    wrapper.classList.add('is-zoomable');
    wrapper.setAttribute('title', 'Klik om te vergroten');
    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('role', 'button');
    wrapper.setAttribute('aria-label', `${img.alt || 'Screenshot'} vergroten`);

    const activate = () => openLightbox(img, wrapper);
    wrapper.addEventListener('click', activate);
    wrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
});

// Subtiele scroll-animaties
document.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const heroParts = document.querySelectorAll('.hero .hero-content, .hero .hero-visual');
  heroParts.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${index * 0.12}s`;
    requestAnimationFrame(() => el.classList.add('is-visible'));
  });

  const staggerGroups = [
    { selector: '.step-item', step: 0.08 },
    { selector: '.features-grid .card', step: 0.1 },
    { selector: '.pricing-grid .card', step: 0.12 },
    { selector: '.faq-group', step: 0.06 },
  ];

  const revealItems = document.querySelectorAll(
    '.steps-header, .steps-visual, .steps-cta, ' +
      '.features .section-heading, .features .section-lead, ' +
      '.pricing .container-sm > .section-heading, .pricing .container-sm > .section-lead, .pricing-footer, ' +
      '.faq .section-heading, ' +
      '.cta-band .cta-title, .cta-band .cta-lead, .cta-band .cta-buttons'
  );

  staggerGroups.forEach(({ selector, step }) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${index * step}s`;
    });
  });

  revealItems.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
  );

  document
    .querySelectorAll('.reveal:not(.is-visible)')
    .forEach((el) => observer.observe(el));
});
