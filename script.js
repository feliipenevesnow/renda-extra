/** Visual enhancements only. Content, FAQ and checkout work without JavaScript. */
document.addEventListener('DOMContentLoaded', () => {
  initStickyMobileBar();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    init3DCardTilt();
    initScrollCenterSpotlight();
  }
});

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
  if (!card) return;

  // Only apply tilt on desktop devices with hover support
  if (window.matchMedia('(hover: hover)').matches) {
    const wrapper = card.parentElement;
    if (!wrapper) return;

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      // Base rotation + dynamic mouse offset
      const rotateY = -12 + (deltaX * 14);
      const rotateX = 6 - (deltaY * 12);

      card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.03)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  }
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

