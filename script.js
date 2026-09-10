/**
 * DINHEIRO ONLINE AGORA 2026
 * Interactive Logic: ROI Simulator, Social Proof Toasts, FAQ Accordion, Sticky CTA & 3D Tilt
 */

document.addEventListener('DOMContentLoaded', () => {
  initAttentionGate();
  initSimulator();
  initFaqAccordion();
  initSocialProofToasts();
  initStickyMobileBar();
  init3DCardTilt();
  initLiveUsersCounter();
  initScarcityCounter();
  initExitIntentModal();
  initScrollCenterSpotlight();
});

/* --------------------------------------------------------------------------
   1. Interactive Extra Income Simulator
   -------------------------------------------------------------------------- */
function initSimulator() {
  const hoursRange = document.getElementById('hoursRange');
  const methodsRange = document.getElementById('methodsRange');
  const hoursVal = document.getElementById('hoursVal');
  const methodsVal = document.getElementById('methodsVal');
  const earningsDisplay = document.getElementById('calculatedEarnings');

  if (!hoursRange || !methodsRange || !earningsDisplay) return;

  function updateSimulation() {
    const hours = parseFloat(hoursRange.value);
    const methods = parseInt(methodsRange.value, 10);

    // Update labels
    if (hours === 1) {
      hoursVal.textContent = '1 hora / dia';
    } else if (hours % 1 === 0) {
      hoursVal.textContent = `${hours} horas / dia`;
    } else {
      const whole = Math.floor(hours);
      hoursVal.textContent = `${whole}h 30min / dia`;
    }

    if (methods === 1) {
      methodsVal.textContent = '1 Método focado';
    } else {
      methodsVal.textContent = `${methods} Métodos combinados`;
    }

    // Calculation formula based on realistic projections from the guide:
    // 1 method at 1h/day ~ R$ 1.200/mo. Scale smoothly with hours and methods.
    const basePerMethod = 950;
    const hoursMultiplier = 0.65 + (hours * 0.45);
    const methodsMultiplier = methods === 1 ? 1.0 : (methods === 2 ? 1.85 : 2.6);

    const rawTotal = Math.round((basePerMethod * hoursMultiplier * methodsMultiplier) / 50) * 50;
    const formatted = `R$ ${rawTotal.toLocaleString('pt-BR')}`;

    const yearlyDisplay = document.getElementById('calculatedYearly');
    if (yearlyDisplay) {
      yearlyDisplay.textContent = `R$ ${(rawTotal * 12).toLocaleString('pt-BR')}`;
    }

    animateEarningsCounter(earningsDisplay, rawTotal);
  }

  let currentTotal = 1850;
  function animateEarningsCounter(element, target) {
    const start = currentTotal;
    const diff = target - start;
    const duration = 280;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (diff * ease));
      element.textContent = `R$ ${value.toLocaleString('pt-BR')}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        currentTotal = target;
      }
    }
    requestAnimationFrame(step);
  }

  hoursRange.addEventListener('input', updateSimulation);
  methodsRange.addEventListener('input', updateSimulation);
  updateSimulation();
}

/* --------------------------------------------------------------------------
   2. FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Optional: close other open items for cleaner mobile reading
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const btn = otherItem.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Live Click Notifications Docked to Footer / Purchase Bar
   Appears from the left, parks at center, then exits to the right.
   100% width, flush with bottom when bar is inactive, flush on top when active.
   -------------------------------------------------------------------------- */
function initSocialProofToasts() {
  const dock = document.getElementById('conversionDock');
  const toast = document.getElementById('socialToast');
  const toastAvatar = document.getElementById('toastAvatar');
  const toastName = document.getElementById('toastName');
  const toastAction = document.getElementById('toastAction');
  const toastTime = document.getElementById('toastTime');

  if (!toast || !toastAvatar || !toastName) return;

  const clicks = [
    { name: 'Mariana C.', city: 'Campinas – SP', initials: 'MC', action: 'acabou de clicar no link de compra', time: 'agora mesmo' },
    { name: 'Lucas M.', city: 'São Paulo – SP', initials: 'LM', action: 'acessou o checkout oficial', time: 'há 14 seg' },
    { name: 'Rodrigo P.', city: 'Curitiba – PR', initials: 'RP', action: 'clicou no link de compra', time: 'há 28 seg' },
    { name: 'Amanda S.', city: 'Belo Horizonte – MG', initials: 'AS', action: 'abriu a página de pagamento', time: 'há 42 seg' },
    { name: 'Gabriel T.', city: 'Rio de Janeiro – RJ', initials: 'GT', action: 'acabou de clicar no link de compra', time: 'agora mesmo' },
    { name: 'Juliana F.', city: 'Porto Alegre – RS', initials: 'JF', action: 'acessou o checkout oficial', time: 'há 18 seg' },
    { name: 'Felipe R.', city: 'Fortaleza – CE', initials: 'FR', action: 'clicou no link de compra', time: 'há 35 seg' },
    { name: 'Patrícia V.', city: 'Goiânia – GO', initials: 'PV', action: 'abriu a página de pagamento', time: 'há 50 seg' },
    { name: 'Bruno K.', city: 'Florianópolis – SC', initials: 'BK', action: 'acabou de clicar no link de compra', time: 'agora mesmo' },
    { name: 'Camila L.', city: 'Salvador – BA', initials: 'CL', action: 'acessou o checkout oficial', time: 'há 22 seg' }
  ];

  let currentIndex = 0;
  let toastTimer = null;
  let isAnimating = false;

  function showNextToast() {
    if (isAnimating) return;

    isAnimating = true;
    const click = clicks[currentIndex];
    toastAvatar.textContent = click.initials;
    toastName.textContent = `${click.name} (${click.city})`;
    if (toastAction) toastAction.textContent = click.action;
    if (toastTime) toastTime.textContent = `• ${click.time}`;

    if (dock) dock.classList.add('toast-active');

    // Reset classes and trigger layout reflow
    toast.className = 'dock-toast-card';
    void toast.offsetWidth;

    // 1. Enter from Left
    toast.className = 'dock-toast-card toast-anim-in';

    // 2. Settle and stay at Center for 4.2 seconds
    setTimeout(() => {
      toast.className = 'dock-toast-card toast-anim-active';

      // 3. Exit to Right
      setTimeout(() => {
        toast.className = 'dock-toast-card toast-anim-out';

        // 4. Reset & schedule next notification
        setTimeout(() => {
          toast.className = 'dock-toast-card';
          if (dock) dock.classList.remove('toast-active');
          isAnimating = false;
          currentIndex = (currentIndex + 1) % clicks.length;

          // Next notification in 6 to 11 seconds
          const nextDelay = Math.floor(Math.random() * 5000) + 6000;
          clearTimeout(toastTimer);
          toastTimer = setTimeout(showNextToast, nextDelay);
        }, 500);

      }, 4200);

    }, 600);
  }

  // Start first toast after 5 seconds
  toastTimer = setTimeout(showNextToast, 5000);
}

/* --------------------------------------------------------------------------
   4. Sticky Bottom CTA Bar
   -------------------------------------------------------------------------- */
function initStickyMobileBar() {
  const stickyBar = document.getElementById('mobileStickyBar');
  const methodsSection = document.getElementById('metodos') || document.getElementById('inicio');
  const offerSection = document.getElementById('comprar');

  if (!stickyBar || !methodsSection) return;

  function onScroll() {
    const methodsTop = methodsSection.getBoundingClientRect().top;
    const isPastMethods = methodsTop <= 150;

    // Hide when inside or below the main offer box so buttons don't duplicate
    let isInsideOffer = false;
    if (offerSection) {
      const offerRect = offerSection.getBoundingClientRect();
      if (offerRect.top <= window.innerHeight && offerRect.bottom >= 0) {
        isInsideOffer = true;
      }
    }

    if (isPastMethods && !isInsideOffer) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

/* --------------------------------------------------------------------------
   5. Interactive 3D Card Tilt for E-book Mockup
   -------------------------------------------------------------------------- */
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

/* --------------------------------------------------------------------------
   6. Psychological Attention Gate (Tensão Máxima 2026)
   -------------------------------------------------------------------------- */
function initAttentionGate() {
  const gate = document.getElementById('entryFocusGate');
  const btn = document.getElementById('btnEnterSite');

  if (!gate || !btn) return;

  // Key v3 ensures the leveled-out welcome gate displays immediately
  if (sessionStorage.getItem('renda_gate_passed_v3') === 'true') {
    gate.style.display = 'none';
    return;
  }

  // Prevent background scrolling while the user is at the welcome gate
  document.body.style.overflow = 'hidden';

  btn.addEventListener('click', () => {
    btn.style.transform = 'scale(0.96)';
    
    setTimeout(() => {
      // Add smooth dismiss class (scale, blur out and fade)
      gate.classList.add('gate-dismiss');
      document.body.style.overflow = '';
      sessionStorage.setItem('renda_gate_passed_v3', 'true');
    }, 120);

    // Remove from layout after animation completes
    setTimeout(() => {
      gate.style.display = 'none';
    }, 550);
  });
}

/* --------------------------------------------------------------------------
   7. Live Online Visitors (Randomized on Every Refresh)
   -------------------------------------------------------------------------- */
function initLiveUsersCounter() {
  const usersEl = document.getElementById('liveUsersCount');
  if (!usersEl) return;

  // On EVERY page load / refresh, generate a unique random realistic number between 38 and 64!
  let currentUsers = Math.floor(Math.random() * 27) + 38;
  usersEl.textContent = currentUsers;

  function fluctuateUsers() {
    const delta = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3 + 1);
    currentUsers = Math.min(68, Math.max(35, currentUsers + delta));
    usersEl.textContent = currentUsers;

    const nextDelay = Math.floor(Math.random() * 4000) + 5000;
    setTimeout(fluctuateUsers, nextDelay);
  }

  setTimeout(fluctuateUsers, 6000);
}

/* --------------------------------------------------------------------------
   8. Dynamic Scarcity Counter (Spots Remaining)
   -------------------------------------------------------------------------- */
function initScarcityCounter() {
  const heroSpots = document.getElementById('heroSpotsLeft');
  const offerSpots = document.getElementById('offerSpotsLeft');
  const fillBar = document.getElementById('scarcityFillBar');

  let spots = 6;

  setTimeout(() => {
    spots = 5;
    if (heroSpots) {
      heroSpots.textContent = `${spots} licenças`;
      heroSpots.style.color = '#ef4444';
    }
    if (offerSpots) offerSpots.textContent = `${spots - 1} licenças`;
    if (fillBar) fillBar.style.width = '96%';
  }, 28000);

  setTimeout(() => {
    spots = 4;
    if (heroSpots) heroSpots.textContent = `${spots} licenças`;
    if (offerSpots) offerSpots.textContent = `${spots - 1} licenças`;
    if (fillBar) fillBar.style.width = '98%';
  }, 75000);
}

/* --------------------------------------------------------------------------
   9. Exit-Intent Psychological Retention Modal
   -------------------------------------------------------------------------- */
function initExitIntentModal() {
  const modal = document.getElementById('exitModalOverlay');
  const closeBtn = document.getElementById('closeExitModalBtn');
  const skipBtn = document.getElementById('skipExitModalBtn');

  if (!modal) return;

  let shownThisSession = sessionStorage.getItem('renda_exit_modal_shown') === 'true';

  function showModal() {
    if (shownThisSession) return;
    shownThisSession = true;
    sessionStorage.setItem('renda_exit_modal_shown', 'true');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }

  function hideModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', hideModal);
  if (skipBtn) skipBtn.addEventListener('click', hideModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) hideModal();
  });

  // Desktop: Detect mouse moving outside the top of the viewport
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 15) {
      showModal();
    }
  });

  // Mobile fallback: trigger after 60 seconds
  setTimeout(() => {
    if (window.innerWidth <= 768 && !shownThisSession) {
      showModal();
    }
  }, 60000);
}

/* --------------------------------------------------------------------------
   10. Scroll-Triggered Center Spotlight (Auto-Hover on Scroll for Mobile)
   As users scroll/drag their finger, the element crossing the optical reading
   center of the screen automatically lights up with its focus/hover effect!
   -------------------------------------------------------------------------- */
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


