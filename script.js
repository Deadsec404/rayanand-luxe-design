/**
 * RAYANAND LUXE DESIGN — ARCHITECTURAL & INTERIOR STUDIO
 * CINEMATIC SCROLL ENGINE & INTERACTIVE CONTROLLER
 * FROM LINE TO SPACE
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP ScrollTrigger if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // --- INITIALIZE ALL MODULES ---
  initCustomCursor();
  initHeaderNav();
  initCinemaScrollEngine();
  initPlanInteractiveToggles();
  initBeforeAfterSlider();
  initServicesFilterAndQuickSelect();
  initVastuCompassInteraction();
  initQuoteFormHandler();
  initScrollRevealAndSpy();
});

/* ==========================================================================
   1. CUSTOM ARCHITECTURAL CURSOR
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const cursorLabel = document.getElementById('cursorLabel');
  if (!cursor) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  // Hover target detectors
  const hoverTargets = document.querySelectorAll('a, button, .spatial-card, .service-panel, .project-case, .ba-slider-container');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const label = el.getAttribute('data-cursor') || (el.classList.contains('spatial-card') ? 'VIEW DESIGN' : el.classList.contains('project-case') ? 'EXPLORE' : 'OPEN →');
      if (cursorLabel) cursorLabel.textContent = label;
      document.body.classList.add('cursor-active');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-active');
    });
  });
}

/* ==========================================================================
   2. HEADER & SMOOTH NAVIGATION
   ========================================================================== */
function initHeaderNav() {
  const header = document.getElementById('siteHeader');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileClose = document.getElementById('mobileNavClose');
  const mobileOverlay = document.getElementById('mobileNavOverlay');

  // Header blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  function openMobileMenu() {
    mobileOverlay?.classList.add('open');
    mobileBtn?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileOverlay?.classList.remove('open');
    mobileBtn?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Mobile menu toggle
  mobileBtn?.addEventListener('click', () => {
    if (mobileOverlay?.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  mobileClose?.addEventListener('click', closeMobileMenu);

  // Smooth scroll handler for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      closeMobileMenu();

      const cinema = document.getElementById('cinema');
      const cinemaTop = cinema ? cinema.offsetTop : 0;
      const cinemaHeight = cinema ? (cinema.offsetHeight - window.innerHeight) : 1900;

      let targetScrollY = null;

      if (targetId === '#cinema') {
        targetScrollY = 0;
      } else if (targetId === '#storyPlan' || anchor.getAttribute('data-nav') === 'plan') {
        targetScrollY = cinemaTop + cinemaHeight * 0.32;
      } else if (targetId === '#story3d') {
        targetScrollY = cinemaTop + cinemaHeight * 0.60;
      } else if (targetId === '#storyConstruction' || anchor.getAttribute('data-nav') === 'process') {
        targetScrollY = cinemaTop + cinemaHeight * 0.85;
      } else {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          const rect = targetEl.getBoundingClientRect();
          targetScrollY = window.pageYOffset + rect.top - 80;
        }
      }

      if (targetScrollY !== null) {
        e.preventDefault();
        window.scrollTo({
          top: Math.max(0, targetScrollY),
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   3. CINEMATIC SCROLL ENGINE (STAGE CHOREOGRAPHY 0px - 1900px)
   ========================================================================== */
function initCinemaScrollEngine() {
  const cinema = document.getElementById('cinema');
  if (!cinema) return;

  const blueprintGrid = document.getElementById('blueprintGrid');
  const blueprintLayer = document.getElementById('blueprintLayer');
  const wireframeLayer = document.getElementById('wireframeLayer');
  const materialLayer = document.getElementById('materialLayer');
  const renderLayer = document.getElementById('renderLayer');
  const heroContent = document.getElementById('heroContent');
  const dimensionLines = document.getElementById('dimensionLines');

  const introCopy = document.getElementById('introCopy');
  const storyPlan = document.getElementById('storyPlan');
  const story3d = document.getElementById('story3d');
  const storyConstruction = document.getElementById('storyConstruction');

  const transformSteps = document.querySelectorAll('.t-step');

  // Helper function to clamp & map ranges
  function mapRange(value, inMin, inMax, outMin, outMax) {
    if (value <= inMin) return outMin;
    if (value >= inMax) return outMax;
    return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
  }

  function onScroll() {
    const rect = cinema.getBoundingClientRect();
    const scrollY = -rect.top; // scroll position relative to cinema section start
    const totalHeight = cinema.offsetHeight - window.innerHeight;
    if (totalHeight <= 0) return;

    const progress = Math.max(0, Math.min(1, scrollY / totalHeight));

    // --- PHASE 1: HERO TITLE & BRAND STATEMENT (0.0 to 0.22) ---
    const heroOpacity = mapRange(progress, 0.04, 0.18, 1, 0);
    const heroY = mapRange(progress, 0, 0.22, 0, -35);
    if (heroContent) {
      const activeOp = Math.max(0, Math.min(1, heroOpacity));
      heroContent.style.opacity = activeOp;
      heroContent.style.transform = `translateY(-50%) translateY(${heroY}px)`;
      heroContent.style.pointerEvents = activeOp > 0.15 ? 'auto' : 'none';
      heroContent.style.visibility = activeOp > 0.01 ? 'visible' : 'hidden';
    }

    // Grid Opacity
    if (blueprintGrid) {
      blueprintGrid.style.opacity = mapRange(progress, 0, 0.5, 0.12, 0.24);
    }

    // --- BACKGROUND RENDER LAYER (Photorealistic Space Morphing) ---
    const baseRenderOp = mapRange(progress, 0, 0.22, 0.7, 0.22) + mapRange(progress, 0.72, 0.96, 0, 0.68);
    const renderScale = mapRange(progress, 0, 1, 1, 1.05);
    if (renderLayer) {
      renderLayer.style.opacity = Math.min(1, Math.max(0.18, baseRenderOp));
      renderLayer.style.transform = `scale(${renderScale})`;
    }

    // --- PHASE 2: 2D BLUEPRINT PLAN & STORY (0.16 to 0.48) ---
    const bpOpacity = mapRange(progress, 0.14, 0.25, 0.2, 0.85) * mapRange(progress, 0.44, 0.52, 1, 0);
    const bpScale = mapRange(progress, 0.15, 0.48, 1, 0.92);
    if (blueprintLayer) {
      blueprintLayer.style.opacity = Math.max(0, bpOpacity);
      blueprintLayer.style.transform = `scale(${bpScale})`;
    }

    if (dimensionLines) {
      const dimOpacity = mapRange(progress, 0.16, 0.28, 0, 0.45) * mapRange(progress, 0.44, 0.52, 1, 0);
      dimensionLines.style.opacity = dimOpacity;
    }

    if (storyPlan) {
      const planOp = mapRange(progress, 0.18, 0.26, 0, 1) * mapRange(progress, 0.44, 0.50, 1, 0);
      const active = planOp > 0.06;
      storyPlan.classList.toggle('active', active);
      storyPlan.style.opacity = Math.max(0, Math.min(1, planOp));
      storyPlan.style.visibility = active ? 'visible' : 'hidden';
    }

    // --- PHASE 3: 3D WIREFRAME TRANSFORMATION & STORY (0.46 to 0.76) ---
    const wfOpacity = mapRange(progress, 0.44, 0.54, 0, 1) * mapRange(progress, 0.70, 0.78, 1, 0);
    const wfScale = mapRange(progress, 0.44, 0.74, 0.90, 1.04);
    if (wireframeLayer) {
      wireframeLayer.style.opacity = Math.max(0, wfOpacity);
      wireframeLayer.style.transform = `scale(${wfScale})`;
    }

    if (story3d) {
      const s3dOp = mapRange(progress, 0.48, 0.56, 0, 1) * mapRange(progress, 0.70, 0.76, 1, 0);
      const active = s3dOp > 0.06;
      story3d.classList.toggle('active', active);
      story3d.style.opacity = Math.max(0, Math.min(1, s3dOp));
      story3d.style.visibility = active ? 'visible' : 'hidden';

      // Dynamically activate sequential wireframe build steps
      const stepIdx = Math.floor(mapRange(progress, 0.50, 0.74, 0, 5.99));
      transformSteps.forEach((step, idx) => {
        step.classList.toggle('active', idx === stepIdx);
      });
    }

    // --- PHASE 4: MATERIAL & CONSTRUCTION STORY (0.72 to 1.0) ---
    const matOpacity = mapRange(progress, 0.70, 0.78, 0, 1) * mapRange(progress, 0.92, 1.0, 1, 0);
    if (materialLayer) {
      materialLayer.style.opacity = Math.max(0, matOpacity);
    }

    if (storyConstruction) {
      const scOp = mapRange(progress, 0.74, 0.82, 0, 1) * mapRange(progress, 0.92, 1.0, 1, 0);
      const active = scOp > 0.06;
      storyConstruction.classList.toggle('active', active);
      storyConstruction.style.opacity = Math.max(0, Math.min(1, scOp));
      storyConstruction.style.visibility = active ? 'visible' : 'hidden';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   4. INTERACTIVE 2D PLAN LAYER TOGGLES
   ========================================================================== */
function initPlanInteractiveToggles() {
  const toggleBtns = document.querySelectorAll('#planToggles .toggle-btn');
  const bpWalls = document.querySelector('.bp-walls');
  const bpDoors = document.querySelector('.bp-doors');
  const bpFurniture = document.querySelector('.bp-furniture');
  const bpLabels = document.querySelector('.bp-labels');

  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const targetLayer = btn.getAttribute('data-layer');

      if (bpWalls) bpWalls.style.opacity = (targetLayer === 'all' || targetLayer === 'walls') ? '1' : '0.2';
      if (bpDoors) bpDoors.style.opacity = (targetLayer === 'all' || targetLayer === 'walls') ? '1' : '0.2';
      if (bpFurniture) bpFurniture.style.opacity = (targetLayer === 'all' || targetLayer === 'furniture') ? '1' : '0.1';
      if (bpLabels) bpLabels.style.opacity = (targetLayer === 'all' || targetLayer === 'labels') ? '1' : '0.1';
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE BEFORE / AFTER SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('baContainer');
  const beforeImg = document.getElementById('baBefore');
  const handle = document.getElementById('baHandle');

  if (!container || !beforeImg || !handle) return;

  let isDragging = false;

  function setSliderPosition(x) {
    const rect = container.getBoundingClientRect();
    let positionX = x - rect.left;
    positionX = Math.max(0, Math.min(positionX, rect.width));

    const percentage = (positionX / rect.width) * 100;
    beforeImg.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;

    const innerImg = beforeImg.querySelector('img');
    if (innerImg) {
      innerImg.style.width = `${rect.width}px`;
    }
  }

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch support for mobile
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches[0]) setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches[0]) return;
    setSliderPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ==========================================================================
   5B. SERVICES DISCIPLINE FILTER & QUICK-SELECT
   ========================================================================== */
function initServicesFilterAndQuickSelect() {
  const filterBtns = document.querySelectorAll('.svc-filter-btn');
  const servicePanels = document.querySelectorAll('.service-panel');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      servicePanels.forEach(panel => {
        const category = panel.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          panel.classList.remove('hidden-by-filter');
        } else {
          panel.classList.add('hidden-by-filter');
        }
      });
    });
  });

  // Pre-select service in quote form when clicking "REQUEST QUOTATION →"
  const inquireLinks = document.querySelectorAll('.service-inquire-link');
  inquireLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetService = link.getAttribute('data-service-select');
      if (!targetService) return;

      const checkbox = document.querySelector(`input[name="services"][value="${targetService}"]`);
      if (checkbox) {
        checkbox.checked = true;
      }
    });
  });
}

/* ==========================================================================
   6. VASTU COMPASS INTERACTION
   ========================================================================== */
function initVastuCompassInteraction() {
  const compassBox = document.querySelector('.compass-blueprint-box');
  const compassRose = document.getElementById('compassRose');

  if (!compassBox || !compassRose) return;

  compassBox.addEventListener('mousemove', (e) => {
    const rect = compassBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const angleDeg = angleRad * (180 / Math.PI) + 90;

    compassRose.style.transform = `rotate(${angleDeg}deg)`;
    compassRose.style.animation = 'none'; // pause auto loop during direct interaction
  });

  compassBox.addEventListener('mouseleave', () => {
    compassRose.style.animation = 'slowCompassRotate 60s linear infinite';
  });
}

/* ==========================================================================
   7. ARCHITECTURAL QUOTATION FORM HANDLER (DIRECT TO WHATSAPP)
   ========================================================================== */
function initQuoteFormHandler() {
  const quoteForm = document.getElementById('quoteForm');
  const TARGET_WHATSAPP_NUMBER = '919834266062'; // Rayanand Luxe Design WhatsApp (+91 98342 66062)

  // Helper to escape HTML characters in templates
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  window.handleQuoteSubmit = function() {
    const nameInput = document.getElementById('clientName');
    const phoneInput = document.getElementById('clientPhone');
    const emailInput = document.getElementById('clientEmail');
    const typeInput = document.getElementById('projectType');
    const locationInput = document.getElementById('projectLocation');
    const areaInput = document.getElementById('carpetArea');
    const budgetInput = document.getElementById('budgetRange');
    const messageInput = document.getElementById('projectMessage');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    // Clear any previous error styling
    [nameInput, phoneInput, emailInput, typeInput, locationInput, areaInput].forEach(el => {
      el?.classList.remove('field-error-highlight');
    });

    const name = nameInput?.value?.trim() || '';
    const phone = phoneInput?.value?.trim() || '';
    const email = emailInput?.value?.trim() || '';
    const projectType = typeInput?.value || '';
    const location = locationInput?.value?.trim() || '';
    const area = areaInput?.value?.trim() || '';
    const budget = budgetInput?.value || 'Flexible / To Be Estimated';
    const message = messageInput?.value?.trim() || '';

    // Collect checked services
    const checkedSvcs = Array.from(document.querySelectorAll('input[name="services"]:checked'))
      .map(cb => cb.value);

    // Validate required fields
    const missing = [];
    if (!name) { missing.push('Client Name'); nameInput?.classList.add('field-error-highlight'); }
    if (!phone) { missing.push('Phone Number'); phoneInput?.classList.add('field-error-highlight'); }
    if (!email) { missing.push('Email Address'); emailInput?.classList.add('field-error-highlight'); }
    if (!projectType) { missing.push('Project Type'); typeInput?.classList.add('field-error-highlight'); }
    if (!location) { missing.push('Project Location'); locationInput?.classList.add('field-error-highlight'); }
    if (!area) { missing.push('Carpet Area'); areaInput?.classList.add('field-error-highlight'); }

    if (missing.length > 0) {
      if (formStatus) {
        formStatus.style.display = 'block';
        formStatus.innerHTML = `
          <div style="color: #ff8a80; font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.5;">
            ⚠️ <strong>MISSING SPECIFICATION FIELDS:</strong> Please complete ${missing.join(', ')} before sending to WhatsApp.
          </div>
        `;
        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="btn-submit-icon">⏳</span>
        <span class="btn-submit-text">PACKAGING SPECIFICATION FOR WHATSAPP...</span>
      `;
    }

    // Build the structured WhatsApp message
    const specId = `RLD-${Math.floor(1000 + Math.random() * 9000)}`;
    const servicesList = checkedSvcs.length > 0
      ? checkedSvcs.map(s => `  • ${s}`).join('\n')
      : '  • Comprehensive Architectural & Luxe Interior';

    const rawWhatsAppText = 
`🏛️ *NEW PROJECT SPECIFICATION — RAYANAND LUXE DESIGN*
*Inquiry Ref:* #${specId}
━━━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${name}
📱 *Phone Number:* ${phone}
✉️ *Email Address:* ${email}
🏠 *Project Type:* ${projectType}
📍 *Project Location:* ${location}
📐 *Approx. Carpet Area:* ${area} sq. ft.
💰 *Budget Scope:* ${budget}
━━━━━━━━━━━━━━━━━━━━━━
🛠️ *Required Disciplines:*
${servicesList}
${message ? `\n📝 *Special Requirements / Notes:*\n"${message}"\n` : ''}━━━━━━━━━━━━━━━━━━━━━━
_Sent via rayanandluxedesign.com Architectural Specification Sheet_`;

    const encodedText = encodeURIComponent(rawWhatsAppText);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${TARGET_WHATSAPP_NUMBER}&text=${encodedText}`;

    // Programmatically open WhatsApp in a new tab/app immediately
    try {
      window.open(whatsappUrl, '_blank');
    } catch (e) {
      console.warn('Popup blocked or iframe limitation:', e);
    }

    // Render luxury confirmation card
    setTimeout(() => {
      if (formStatus) {
        formStatus.style.display = 'block';
        formStatus.innerHTML = `
          <div class="form-status-badge">✓ SPECIFICATION #${specId} COMPILED & SENT TO WHATSAPP</div>
          <div class="form-status-lead">
            Thank you, <strong>${escapeHtml(name)}</strong>. Your project inquiry has been formatted directly for our Principal Architect on WhatsApp (<strong>+91 98342 66062</strong>).
          </div>
          <div class="form-status-meta">
            <strong>Project Overview:</strong> ${escapeHtml(area)} sq. ft. ${escapeHtml(projectType)} in ${escapeHtml(location)}<br>
            <strong>Disciplines:</strong> ${checkedSvcs.map(s => escapeHtml(s)).join(' • ') || 'Full Turnkey Excellence'}<br>
            <strong>Target Phone:</strong> +91 98342 66062 (Rayanand Luxe Design)
          </div>

          <div class="form-status-actions">
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-wa-direct-launch" id="btnWaDirect">
              <span>💬 OPEN IN WHATSAPP TO SEND DETAILS (+91 98342 66062) →</span>
            </a>
            <div class="btn-wa-subtext">
              Tap the green button above if WhatsApp did not open automatically on your device.
            </div>

            <div class="form-status-secondary-row">
              <button type="button" class="btn-status-ghost" id="btnCopyInquiry">
                📋 COPY INQUIRY DETAILS
              </button>
              <button type="button" class="btn-status-ghost" id="btnResetInquiry">
                ↺ SUBMIT ANOTHER INQUIRY
              </button>
            </div>

            <details class="wa-preview-collapse">
              <summary class="wa-preview-summary">VIEW EXACT WHATSAPP MESSAGE PREVIEW ▾</summary>
              <pre class="wa-preview-body">${escapeHtml(rawWhatsAppText)}</pre>
            </details>
          </div>
        `;

        // Wire copy button
        const copyBtn = document.getElementById('btnCopyInquiry');
        if (copyBtn) {
          copyBtn.addEventListener('click', () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(rawWhatsAppText).then(() => {
                copyBtn.textContent = '✓ COPIED TO CLIPBOARD!';
                setTimeout(() => {
                  copyBtn.textContent = '📋 COPY INQUIRY DETAILS';
                }, 2500);
              }).catch(() => {
                copyBtn.textContent = 'COPIED TO CLIPBOARD!';
              });
            } else {
              // Fallback for non-secure contexts
              const textarea = document.createElement('textarea');
              textarea.value = rawWhatsAppText;
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand('copy');
              document.body.removeChild(textarea);
              copyBtn.textContent = '✓ COPIED TO CLIPBOARD!';
              setTimeout(() => {
                copyBtn.textContent = '📋 COPY INQUIRY DETAILS';
              }, 2500);
            }
          });
        }

        // Wire reset button
        const resetBtn = document.getElementById('btnResetInquiry');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            quoteForm?.reset();
            formStatus.style.display = 'none';
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = `
                <span class="btn-submit-icon">💬</span>
                <span class="btn-submit-text">SUBMIT & SEND INQUIRY TO WHATSAPP →</span>
              `;
            }
            quoteForm?.scrollIntoView({ behavior: 'smooth' });
          });
        }

        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span class="btn-submit-icon">💬</span>
          <span class="btn-submit-text">RE-SEND INQUIRY TO WHATSAPP →</span>
        `;
      }
    }, 400);
  };

  quoteForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    window.handleQuoteSubmit();
  });
}

/* ==========================================================================
   8. SCROLL REVEAL OBSERVER & SCROLLSPY
   ========================================================================== */
function initScrollRevealAndSpy() {
  const revealElements = document.querySelectorAll(
    '.section-block, .spatial-card, .service-panel, .project-case, .quote-sheet, .vastu-grid, .philo-card, .ba-slider-container'
  );

  revealElements.forEach((el, index) => {
    el.classList.add('reveal-fade-up');
    const stagger = (index % 3) + 1;
    el.classList.add(`reveal-stagger-${stagger}`);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.06
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Immediate fallback for browsers without IntersectionObserver
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // Active navigation scrollspy
  const navLinks = {
    plan: document.querySelector('.nav-link[data-nav="plan"]'),
    services: document.querySelector('.nav-link[data-nav="services"]'),
    process: document.querySelector('.nav-link[data-nav="process"]'),
    projects: document.querySelector('.nav-link[data-nav="projects"]'),
    vastu: document.querySelector('.nav-link[data-nav="vastu"]'),
    quote: document.querySelector('.nav-link[data-nav="quote"]')
  };

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 180;
    const cinema = document.getElementById('cinema');
    const cinemaTop = cinema ? cinema.offsetTop : 0;
    const cinemaHeight = cinema ? (cinema.offsetHeight - window.innerHeight) : 1900;

    let activeKey = null;

    if (scrollPos > cinemaTop + cinemaHeight * 0.20 && scrollPos <= cinemaTop + cinemaHeight * 0.55) {
      activeKey = 'plan';
    } else if (scrollPos > cinemaTop + cinemaHeight * 0.55 && scrollPos <= cinemaTop + cinemaHeight * 0.95) {
      activeKey = 'process';
    } else if (scrollPos > cinemaTop + cinemaHeight * 0.95) {
      const servicesEl = document.getElementById('services');
      const projectsEl = document.getElementById('projects');
      const vastuEl = document.getElementById('vastu');
      const quoteEl = document.getElementById('quote');

      if (quoteEl && scrollPos >= quoteEl.offsetTop - 120) {
        activeKey = 'quote';
      } else if (vastuEl && scrollPos >= vastuEl.offsetTop - 120) {
        activeKey = 'vastu';
      } else if (projectsEl && scrollPos >= projectsEl.offsetTop - 120) {
        activeKey = 'projects';
      } else if (servicesEl && scrollPos >= servicesEl.offsetTop - 120) {
        activeKey = 'services';
      }
    }

    Object.values(navLinks).forEach(link => link?.classList.remove('active'));
    if (activeKey && navLinks[activeKey]) {
      navLinks[activeKey].classList.add('active');
    }
  }, { passive: true });
}
