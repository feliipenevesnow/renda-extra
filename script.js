/** Visual enhancements only. Content, FAQ and checkout work without JavaScript. */
document.addEventListener('DOMContentLoaded', () => {
  initStickyMobileBar();
  init3DCardTilt();
  initScrollDetails();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initScrollCenterSpotlight();
  }
});

// Position follows scrolling in both directions, rather than a one-time animation.
function initScrollDetails() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements = Array.from(document.querySelectorAll(
    '.section-header, .author-intro, .learning-card, .filter-card, .sample-box, .bonus-card, .offer-box, .guarantee-card, .faq-item'
  ));
  const offsets = new Map();
  let frame = null;
  function update() {
    frame = null;
    if (reduced.matches) return;
    const viewport = window.innerHeight;
    // Read geometry first; subtract our previous translation to prevent feedback.
    const positions = elements.map(element => ({
      element, top: element.getBoundingClientRect().top - (offsets.get(element) || 0)
    }));
    positions.forEach(({ element, top }) => {
      const progress = Math.max(0, Math.min(1, (viewport * .94 - top) / (viewport * .34)));
      const offset = (1 - progress) * 38;
      offsets.set(element, offset);
      element.style.setProperty('--scroll-rise', `${offset.toFixed(2)}px`);
      element.style.setProperty('--scroll-opacity', (.78 + progress * .22).toFixed(3));
      element.classList.add('scroll-detail');
    });
  }
  function schedule() {
    if (!reduced.matches && frame === null) frame = requestAnimationFrame(update);
  }
  function syncPreference() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    if (reduced.matches) {
      elements.forEach(element => {
        element.classList.remove('scroll-detail');
        element.style.removeProperty('--scroll-rise');
        element.style.removeProperty('--scroll-opacity');
      });
      offsets.clear();
    } else schedule();
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  reduced.addEventListener('change', syncPreference);
  syncPreference();
}

function initStickyMobileBar() {
  const bar = document.getElementById('mobileStickyBar');
  const methods = document.getElementById('metodos');
  const offer = document.getElementById('comprar');
  const footer = document.getElementById('rodape');
  if (!bar || !methods || !offer || !footer) return;

  function updateBar() {
    const offerRect = offer.getBoundingClientRect();
    const inOffer = offerRect.top <= window.innerHeight && offerRect.bottom >= 0;
    const show = methods.getBoundingClientRect().top <= 150 && !inOffer &&
      footer.getBoundingClientRect().top > window.innerHeight;
    bar.hidden = !show;
    bar.classList.toggle('visible', show);
  }

  let pending = false;
  function scheduleUpdate() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; updateBar(); });
  }
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  updateBar();
}

function init3DCardTilt() {
  const card = document.getElementById('bookMockup');
  const wrapper = card?.closest('.mockup-wrapper');
  if (!wrapper) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (value) => Math.max(-1, Math.min(1, value));
  let pointerX = 0;
  let pointerY = 0;
  let frame = null;

  function update() {
    frame = null;
    if (reducedMotion.matches) return;
    // Measure the untransformed wrapper to avoid feeding the animation into itself.
    const rect = wrapper.getBoundingClientRect();
    const viewport = window.innerHeight;
    if (rect.bottom < -80 || rect.top > viewport + 80) return;
    const center = rect.top + card.offsetTop + card.offsetHeight / 2;
    const progress = clamp((viewport / 2 - center) / (viewport / 2 + card.offsetHeight / 2));
    wrapper.style.setProperty('--book-x', `${(-progress * 16 - pointerY * 3).toFixed(2)}deg`);
    wrapper.style.setProperty('--book-y', `${(progress * 22 + pointerX * 5).toFixed(2)}deg`);
    wrapper.style.setProperty('--book-lift', `${(-progress * 30).toFixed(2)}px`);
    wrapper.style.setProperty('--book-light', `${(50 + progress * 32 + pointerX * 12).toFixed(2)}%`);
    wrapper.style.setProperty('--glow-drift', `${(progress * 18).toFixed(2)}px`);
  }

  function scheduleUpdate() {
    if (!reducedMotion.matches && frame === null) frame = requestAnimationFrame(update);
  }

  function syncMotionPreference() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    pointerX = pointerY = 0;
    wrapper.classList.toggle('has-book-motion', !reducedMotion.matches);
    if (reducedMotion.matches) {
      ['--book-x', '--book-y', '--book-lift', '--book-light', '--glow-drift']
        .forEach(name => wrapper.style.removeProperty(name));
    } else {
      scheduleUpdate();
    }
  }

  wrapper.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches || event.pointerType === 'touch') return;
    const rect = wrapper.getBoundingClientRect();
    pointerX = clamp((event.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    pointerY = clamp((event.clientY - rect.top - rect.height / 2) / (rect.height / 2));
    scheduleUpdate();
  }, { passive: true });
  wrapper.addEventListener('pointerleave', () => {
    pointerX = pointerY = 0;
    scheduleUpdate();
  });
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  window.addEventListener('pageshow', scheduleUpdate);
  reducedMotion.addEventListener('change', syncMotionPreference);
  syncMotionPreference();
}

function initScrollCenterSpotlight() {
  const bookMockup = document.getElementById('bookMockup');
  const mockupWrapper = bookMockup ? bookMockup.closest('.mockup-wrapper') : null;
  const pillarsContainer = document.getElementById('pillarsStack');
  const pillarCards = pillarsContainer ? Array.from(pillarsContainer.querySelectorAll('.pillar-card')) : [];
  const bonusCards = Array.from(document.querySelectorAll('.bonus-card'));

  let ticking = false;

  function updateSpotlight() {
    ticking = false;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    // Optical focal line: approximately 46% down the viewport (ergonomic mobile reading level)
    const focalY = vh * 0.46;

    // 1. Hero 3D Book Mockup
    if (bookMockup && mockupWrapper) {
      const rect = mockupWrapper.getBoundingClientRect();
      const elemCenter = rect.top + rect.height / 2;
      const inFocalZone = rect.top < vh * 0.78 && rect.bottom > vh * 0.18 && Math.abs(elemCenter - focalY) < vh * 0.32;

      if (inFocalZone) {
        bookMockup.classList.add('is-center-active');
        mockupWrapper.classList.add('is-center-active');
      } else {
        bookMockup.classList.remove('is-center-active');
        mockupWrapper.classList.remove('is-center-active');
      }
    }

    // 2. Stacked Pillar Cards (10 Methods Deck)
    if (pillarCards.length > 0 && pillarsContainer) {
      const contRect = pillarsContainer.getBoundingClientRect();
      // If container is completely off-screen, clear all
      if (contRect.bottom < 50 || contRect.top > vh - 50) {
        pillarCards.forEach(card => card.classList.remove('is-center-active'));
      } else {
        const rects = pillarCards.map(c => c.getBoundingClientRect());
        let activeIdx = -1;
        let bestDist = Infinity;

        for (let i = 0; i < pillarCards.length; i++) {
          const rect = rects[i];
          const nextRect = i < pillarCards.length - 1 ? rects[i + 1] : null;

          // Because cards are sticky stacked, card i is visible from its top down to the next card's top
          const visTop = Math.max(rect.top, 50);
          const visBottom = (nextRect && nextRect.top < rect.bottom) ? nextRect.top : rect.bottom;

          if (visBottom <= visTop) continue; // Completely covered by subsequent cards

          let dist = 0;
          if (focalY >= visTop && focalY <= visBottom) {
            dist = 0; // The focal eye-line is directly inside this card!
          } else if (focalY < visTop) {
            dist = visTop - focalY;
          } else {
            dist = focalY - visBottom;
          }

          if (dist < bestDist) {
            bestDist = dist;
            activeIdx = i;
          }
        }

        pillarCards.forEach((card, idx) => {
          if (idx === activeIdx) {
            card.classList.add('is-center-active');
          } else {
            card.classList.remove('is-center-active');
          }
        });
      }
    }

    // 3. Bonus Cards
    if (bonusCards.length > 0) {
      bonusCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        if (rect.top < vh && rect.bottom > 0 && Math.abs(cardCenter - focalY) < Math.max(rect.height * 0.52, 110)) {
          card.classList.add('is-center-active');
        } else {
          card.classList.remove('is-center-active');
        }
      });
    }
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateSpotlight);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });

  // Initial check
  requestUpdate();
}

