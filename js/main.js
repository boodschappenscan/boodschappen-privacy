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

      if (!groupBody) return;

      groupBody.classList.toggle('open');
      if (icon) {
        icon.classList.toggle('fa-plus');
        icon.classList.toggle('fa-minus');
      }

      const otherGroups = faqContainer.querySelectorAll('.faq-group');

      otherGroups.forEach((otherGroup) => {
        if (otherGroup !== group) {
          const otherGroupBody = otherGroup.querySelector('.faq-group-body');
          const otherIcon = otherGroup.querySelector('.faq-group-header i');

          otherGroupBody?.classList.remove('open');
          if (otherIcon) {
            otherIcon.classList.remove('fa-minus');
            otherIcon.classList.add('fa-plus');
          }
        }
      });
    });
  }
});

// Mobile Menu
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerButton = document.querySelector('.hamburger-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuBackdrop = document.querySelector('.mobile-menu-backdrop');

  // Buiten sticky navbar: iOS Safari klemt fixed menu anders in de balk (kruis wel, menu niet).
  if (menuBackdrop && menuBackdrop.parentElement !== document.body) {
    document.body.appendChild(menuBackdrop);
  }
  if (mobileMenu && mobileMenu.parentElement !== document.body) {
    document.body.appendChild(mobileMenu);
  }
  beschermMobielMenuTegenReveal();

  if (hamburgerButton && mobileMenu) {
    let hamburgerNaMenuTimer = null;

    const setMenuOpen = (isOpen) => {
      if (hamburgerNaMenuTimer !== null) {
        clearTimeout(hamburgerNaMenuTimer);
        hamburgerNaMenuTimer = null;
      }

      if (isOpen) {
        beschermMobielMenuTegenReveal();
        menuBackdrop?.classList.add('is-visible');
        if (menuBackdrop) menuBackdrop.hidden = false;
        mobileMenu.classList.add('active');
        document.body.classList.add('menu-open');
        hamburgerButton.setAttribute('aria-expanded', 'true');
        hamburgerButton.setAttribute('aria-label', 'Menu sluiten');
        // Eerst menu laten inschuiven; daarna pas ☰ → ✕ (voorkomt flits van alleen het kruis).
        hamburgerNaMenuTimer = window.setTimeout(() => {
          hamburgerButton.classList.add('is-active');
          hamburgerNaMenuTimer = null;
        }, 140);
      } else {
        hamburgerButton.classList.remove('is-active');
        mobileMenu.classList.remove('active');
        menuBackdrop?.classList.remove('is-visible');
        if (menuBackdrop) menuBackdrop.hidden = true;
        document.body.classList.remove('menu-open');
        hamburgerButton.setAttribute('aria-expanded', 'false');
        hamburgerButton.setAttribute('aria-label', 'Menu openen');
      }
    };

    const closeMenu = () => setMenuOpen(false);

    hamburgerButton.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('active');
      setMenuOpen(isOpen);
    });

    menuBackdrop?.addEventListener('click', closeMenu);

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMenu();
        hamburgerButton.focus();
      }
    });
  }
});

// Navbar: schaduw bij scrollen
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const updateNavbar = () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  };

  updateNavbar();
  window.addEventListener('scroll', updateNavbar, { passive: true });
});

// Screenshot lightbox — klik op telefoon = vergroten
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

    let tapLocked = false;
    const activate = () => {
      if (tapLocked) return;
      tapLocked = true;
      openLightbox(img, wrapper);
      setTimeout(() => {
        tapLocked = false;
      }, 400);
    };

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

function beschermMobielMenuTegenReveal() {
  document.querySelectorAll('.mobile-menu, .mobile-menu *, .mobile-menu-backdrop').forEach((el) => {
    el.classList.remove('reveal', 'reveal-scale');
    el.classList.add('is-visible');
  });
}

// Scroll-animaties en subtiele beweging
document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const magRevealKrijgen = (el) => !el.closest('.mobile-menu, .mobile-menu-backdrop');

  const heroParts = document.querySelectorAll('.hero .hero-content, .hero .hero-visual');
  heroParts.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${index * 0.12}s`;
    if (!reducedMotion) {
      requestAnimationFrame(() => el.classList.add('is-visible'));
    } else {
      el.classList.add('is-visible');
    }
  });

  document.querySelectorAll('.hero-trust span').forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${0.28 + index * 0.08}s`;
    if (reducedMotion) el.classList.add('is-visible');
  });

  const staggerGroups = [
    { selector: '.step-item', step: 0.08 },
    { selector: '.features-grid .card', step: 0.1 },
    { selector: '.pricing-grid .card', step: 0.12 },
    { selector: '.faq-group', step: 0.06 },
    { selector: '.guide-step', step: 0.06 },
  ];

  const revealItems = document.querySelectorAll(
    '.steps-header, .steps-visual, .steps-cta, ' +
      '.features .section-heading, .features .section-lead, ' +
      '.pricing .container-sm > .section-heading, .pricing .container-sm > .section-lead, .pricing-footer, ' +
      '.faq .section-heading, ' +
      '.cta-band .cta-title, .cta-band .cta-lead, .cta-band .cta-buttons, ' +
      '.page-hero .container-md > *, .page-hero .container > *, ' +
      '.guide-intro .box, .guide-toc, ' +
      '.content-page .container-md > .box, .content-page .container > .box, ' +
      '.footer-brand, .footer-links'
  );

  staggerGroups.forEach(({ selector, step }) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      if (!magRevealKrijgen(el)) return;
      el.classList.add('reveal');
      if (step > 0) el.style.transitionDelay = `${index * step}s`;
    });
  });

  revealItems.forEach((el) => {
    if (!magRevealKrijgen(el)) return;
    el.classList.add('reveal');
  });

  document.querySelectorAll('.text-center.section-heading').forEach((heading) => {
    if (!magRevealKrijgen(heading)) return;
    heading.classList.add('reveal');
  });

  beschermMobielMenuTegenReveal();

  if (reducedMotion) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -24px 0px' }
  );

  document
    .querySelectorAll('.reveal:not(.is-visible)')
    .forEach((el) => observer.observe(el));

  // Lichte parallax op hero-kolom (alleen desktop; niet op device-shot — daar draait float-animatie)
  const heroVisual = document.querySelector('.hero .hero-visual');
  if (heroVisual && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const offset = Math.min(window.scrollY * 0.05, 28);
          heroVisual.style.transform = `translateY(${offset}px)`;
          ticking = false;
        });
      },
      { passive: true }
    );
  }
});
