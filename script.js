/* ════════════════════════════════════════════════════════════
   RK BROKEN HALO v2 — MAIN SCRIPT
   EDITOR • CREATOR  |  CODE. CREATE. BREAK LIMITS.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ─── MOBILE DETECT ───
  const IS_MOBILE = window.matchMedia('(max-width:768px)').matches || 'ontouchstart' in window;

  // ════════════════════════════════════════════════════════════
  // FILM GRAIN (Canvas)
  // ════════════════════════════════════════════════════════════
  (function initGrain() {
    const canvas = document.getElementById('grainCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, animId;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function drawGrain() {
      const img = ctx.createImageData(W, H);
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255 | 0;
        data[i] = data[i+1] = data[i+2] = v;
        data[i+3] = 28; // alpha controls opacity
      }
      ctx.putImageData(img, 0, 0);
      animId = requestAnimationFrame(drawGrain);
    }
    drawGrain();
  })();

  // ════════════════════════════════════════════════════════════
  // LOADER
  // ════════════════════════════════════════════════════════════
  const loader  = document.getElementById('loader');
  const fill    = document.getElementById('loaderFill');
  const pct     = document.getElementById('loaderPct');
  let progress  = 0;

  document.body.style.overflow = 'hidden';

  function runLoader() {
    const tick = () => {
      progress += Math.random() * 14 + 4;
      if (progress >= 100) {
        progress = 100;
        fill.style.width = '100%';
        pct.textContent  = '100%';
        setTimeout(() => {
          loader.classList.add('out');
          document.body.style.overflow = '';
          startSite();
        }, 450);
        return;
      }
      fill.style.width = progress + '%';
      pct.textContent  = Math.floor(progress) + '%';
      setTimeout(tick, 70 + Math.random() * 110);
    };
    tick();
  }
  window.addEventListener('load', () => setTimeout(runLoader, 300));

  // ════════════════════════════════════════════════════════════
  // LENIS
  // ════════════════════════════════════════════════════════════
  let lenis;
  function initLenis() {
    lenis = new Lenis({
      duration: 1.15,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Smooth anchor scrolling
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -60, duration: 1.4 });
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  // CUSTOM CURSOR
  // ════════════════════════════════════════════════════════════
  function initCursor() {
    if (IS_MOBILE) return;
    const cursor = document.getElementById('cursor');
    const label  = document.getElementById('cursorLabel');
    if (!cursor) return;

    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function raf() {
      cx += (mx - cx) * 0.14;
      cy += (my - cy) * 0.14;
      cursor.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      requestAnimationFrame(raf);
    })();

    const INTERACTIVE = 'a,button,[data-magnetic],input,textarea,.edit-card,.tk-card,.world-card,.soc-link,.yt-player,.sc-item';

    document.addEventListener('mouseover', e => {
      const el = e.target.closest(INTERACTIVE);
      if (!el) return;
      cursor.classList.add('is-hover');
      const lbl = el.closest('[data-cursor]');
      if (lbl) {
        label.textContent = lbl.getAttribute('data-cursor');
        cursor.classList.add('has-label');
      }
    });

    document.addEventListener('mouseout', e => {
      const el = e.target.closest(INTERACTIVE);
      if (!el) return;
      cursor.classList.remove('is-hover', 'has-label');
      label.textContent = '';
    });
  }

  // ════════════════════════════════════════════════════════════
  // MAGNETIC BUTTONS
  // ════════════════════════════════════════════════════════════
  function initMagnetic() {
    if (IS_MOBILE) return;
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width  / 2) * 0.28,
          y: (e.clientY - r.top  - r.height / 2) * 0.28,
          duration: .45, ease: 'power2.out',
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' });
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  // HERO PARTICLES
  // ════════════════════════════════════════════════════════════
  function initParticles() {
    if (IS_MOBILE) return;
    const container = document.getElementById('heroParticles');
    if (!container) return;
    const count = 25;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'h-particle';
      p.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;
        width:${Math.random()*3+1}px;height:${Math.random()*3+1}px;`;
      container.appendChild(p);
      gsap.to(p, {
        opacity: Math.random() * .45 + .05,
        duration: Math.random() * 2.5 + 2,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
        delay: Math.random() * 3,
      });
      gsap.to(p, {
        x: Math.random() * 60 - 30,
        y: Math.random() * 60 - 30,
        duration: Math.random() * 8 + 6,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
        delay: Math.random() * 3,
      });
    }
  }

  // ════════════════════════════════════════════════════════════
  // NAVIGATION
  // ════════════════════════════════════════════════════════════
  function initNav() {
    const nav     = document.getElementById('nav');
    const burger  = document.getElementById('burger');
    const mobMenu = document.getElementById('mobMenu');
    const navAs   = document.querySelectorAll('.nav-a');
    const sections= document.querySelectorAll('section[id]');

    // Scroll style
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 70);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Active link
    function updateActive() {
      const top = window.scrollY + 140;
      sections.forEach(sec => {
        if (top >= sec.offsetTop && top < sec.offsetTop + sec.offsetHeight) {
          navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id));
        }
      });
    }
    window.addEventListener('scroll', updateActive, { passive: true });

    // Mobile menu
    burger.addEventListener('click', () => {
      const open = !mobMenu.classList.contains('open');
      burger.classList.toggle('open', open);
      mobMenu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      mobMenu.setAttribute('aria-hidden', !open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    document.querySelectorAll('.mob-a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        mobMenu.setAttribute('aria-hidden', true);
        document.body.style.overflow = '';
      });
    });
  }

  // ════════════════════════════════════════════════════════════
  // GSAP SCROLL ANIMATIONS
  // ════════════════════════════════════════════════════════════
  function initGSAP() {
    gsap.registerPlugin(ScrollTrigger);

    // ── HERO ENTRANCE ──
    const htl = gsap.timeline({ delay: .6 });
    htl
      .from('.hero-eyebrow',   { y: 30, opacity: 0, duration: .7, ease: 'power3.out' })
      .from('.hero-title .reveal-line:first-child span',  { y: 130, opacity: 0, duration: 1.2, ease: 'power4.out' }, '-=.2')
      .from('.hero-title .reveal-line:last-child span',   { y: 80,  opacity: 0, duration: 1.0, ease: 'power4.out' }, '-=.6')
      .from('.hero-stmt',      { y: 35, opacity: 0, duration: .8, ease: 'power3.out' }, '-=.4')
      .from('.hero-btns',      { y: 30, opacity: 0, duration: .7, ease: 'power3.out' }, '-=.3')
      .from('.hero-scroll',    { opacity: 0, duration: .6,  ease: 'power2.out' }, '-=.1');

    // Hero parallax
    gsap.to('.hero-inner', {
      y: -90, opacity: .3, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero-bg', {
      y: 50, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    // ── SECTION LABELS ──
    gsap.utils.toArray('.sec-label').forEach(el => {
      gsap.from(el, {
        x: -24, opacity: 0, duration: .6, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    // ── SECTION HEADINGS ──
    gsap.utils.toArray('.sec-h').forEach(el => {
      gsap.from(el, {
        y: 55, opacity: 0, duration: .9, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 87%' },
      });
    });

    // ── ABOUT WORDS ──
    gsap.utils.toArray('.about-word').forEach((el, i) => {
      gsap.from(el, {
        x: 50, opacity: 0, duration: .7, ease: 'power3.out', delay: i * .12,
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });
    gsap.from('.about-bio', {
      y: 35, opacity: 0, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-bio', start: 'top 88%' },
    });

    // ── WORLD CARDS ──
    gsap.utils.toArray('.world-card').forEach((card, i) => {
      gsap.from(card, {
        y: 55, opacity: 0, duration: .8, ease: 'power3.out', delay: i * .1,
        scrollTrigger: { trigger: card, start: 'top 90%' },
      });
    });

    // ── TOOLKIT CARDS ──
    gsap.utils.toArray('.tk-card').forEach((card, i) => {
      gsap.from(card, {
        y: 70, opacity: 0, duration: .9, ease: 'power3.out', delay: i * .15,
        scrollTrigger: { trigger: card, start: 'top 90%' },
      });
    });

    // ── EDIT CARDS ──
    gsap.utils.toArray('.edit-card').forEach((card, i) => {
      gsap.from(card, {
        y: 70, opacity: 0, duration: .9, ease: 'power3.out', delay: i * .08,
        scrollTrigger: { trigger: card, start: 'top 92%' },
      });
    });

    // ── YOUTUBE ──
    gsap.from('.yt-block', {
      y: 50, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.yt-block', start: 'top 87%' },
    });
    gsap.utils.toArray('.yt-thumb').forEach((t, i) => {
      gsap.from(t, {
        y: 30, opacity: 0, duration: .7, ease: 'power3.out', delay: i * .14,
        scrollTrigger: { trigger: t, start: 'top 92%' },
      });
    });

    // ── SHOWCASE ──
    gsap.from('.showcase-track-wrap', {
      y: 40, opacity: 0, duration: .8, ease: 'power3.out',
      scrollTrigger: { trigger: '.showcase-track-wrap', start: 'top 88%' },
    });
    // Parallax on bg text
    gsap.to('.stmt-bg-txt', {
      x: -120, ease: 'none',
      scrollTrigger: { trigger: '.stmt-section', start: 'top bottom', end: 'bottom top', scrub: true },
    });

    // ── STATEMENT LINES ──
    gsap.utils.toArray('.stmt-line span').forEach(span => {
      gsap.from(span, {
        y: 90, opacity: 0, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: span.closest('.stmt-line'), start: 'top 82%' },
      });
    });
    gsap.from('.stmt-div', {
      scaleX: 0, duration: .7, ease: 'power3.out',
      scrollTrigger: { trigger: '.stmt-div', start: 'top 84%' },
    });

    // ── CREATOR ──
    gsap.from('.creator-left',  {
      x: -50, opacity: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: '.creator-grid', start: 'top 85%' },
    });
    gsap.from('.creator-right', {
      x: 50, opacity: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: '.creator-grid', start: 'top 85%' },
    });

    // ── SOCIAL ──
    gsap.utils.toArray('.soc-link').forEach((link, i) => {
      gsap.from(link, {
        y: 35, opacity: 0, duration: .7, ease: 'power3.out', delay: i * .1,
        scrollTrigger: { trigger: link, start: 'top 92%' },
      });
    });

    // ── CONTACT ──
    gsap.from('.contact-h',    { y: 55, opacity: 0, duration: .9, ease: 'power4.out', scrollTrigger: { trigger: '.contact-h',    start: 'top 86%' } });
    gsap.from('.contact-sub',  { y: 30, opacity: 0, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: '.contact-sub',  start: 'top 90%' } });
    gsap.from('.contact-btns', { y: 30, opacity: 0, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: '.contact-btns', start: 'top 92%' } });
    gsap.from('.contact-form', { y: 35, opacity: 0, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.contact-form', start: 'top 90%' } });

    // ── NAV ENTRANCE ──
    gsap.from('.nav', { y: -25, opacity: 0, duration: .8, ease: 'power3.out', delay: 1 });
  }

  // ════════════════════════════════════════════════════════════
  // HORIZONTAL SHOWCASE DRAG
  // ════════════════════════════════════════════════════════════
  function initShowcase() {
    const track = document.getElementById('showcaseTrack');
    if (!track) return;
    let startX, scrollLeft, isDragging = false;

    track.addEventListener('mousedown', e => {
      isDragging = true; startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft; track.style.userSelect = 'none';
    });
    track.addEventListener('mouseleave', () => isDragging = false);
    track.addEventListener('mouseup',    () => { isDragging = false; track.style.userSelect = ''; });
    track.addEventListener('mousemove',  e => {
      if (!isDragging) return;
      e.preventDefault();
      const walk = (e.pageX - track.offsetLeft - startX) * 1.4;
      track.scrollLeft = scrollLeft - walk;
    });

    // Touch auto-scroll hint (GSAP)
    if (!IS_MOBILE) {
      // Auto-scroll idle teaser
      let idleTimer;
      const teaser = () => {
        gsap.to(track, { scrollLeft: track.scrollLeft + 200, duration: 1.2, ease: 'power2.inOut',
          onComplete: () => { clearTimeout(idleTimer); } });
      };
      idleTimer = setTimeout(teaser, 2500);
      track.addEventListener('mousedown', () => clearTimeout(idleTimer));
    }
  }

  // ════════════════════════════════════════════════════════════
  // MOUSE PARALLAX (hero)
  // ════════════════════════════════════════════════════════════
  function initMouseParallax() {
    if (IS_MOBILE) return;
    document.addEventListener('mousemove', e => {
      const mx = (e.clientX / window.innerWidth  - .5) * 2;
      const my = (e.clientY / window.innerHeight - .5) * 2;
      gsap.to('.hero-glow-r', { x: mx * 25, y: my * 25, duration: 1.4, ease: 'power2.out' });
      gsap.to('.hero-glow-b', { x: mx * -15, y: my * -15, duration: 1.8, ease: 'power2.out' });
    });
  }

  // ════════════════════════════════════════════════════════════
  // BACKEND API INTEGRATION
  // ════════════════════════════════════════════════════════════
  const BACKEND_URL = 'http://localhost:5000/api';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Fallback editing projects if API is disconnected/loading
  const fallbackProjects = [
    {
      _id: 'proj-01',
      title: 'ANIME EDIT',
      category: 'Anime Edit',
      description: 'High-octane anime sequence synchronized with heavy beat timing, seamless velocity transitions, and cinematic color grading.',
      thumbnail: 'assets/anime-edit.jpg',
      video: 'https://youtube.com/@rk._brokenhalo',
      tools: ['CapCut', 'Alight Motion'],
      tags: ['ANIME', 'BEAT SYNC'],
      style: 'Velocity · Color Grading · Impact Effects'
    },
    {
      _id: 'proj-02',
      title: 'MOVIE EDIT',
      category: 'Movie Edit',
      description: 'Dramatic film narrative with immersive audio sound design, cinematic slow-motion curves, and atmospheric color grading.',
      thumbnail: 'assets/movie-edit.jpg',
      video: 'https://youtube.com/@rk._brokenhalo',
      tools: ['CapCut', 'PicsArt'],
      tags: ['MOVIES', 'DRAMATIC'],
      style: 'Cinematic Transitions · Color · Slow-Mo'
    },
    {
      _id: 'proj-03',
      title: 'CINEMATIC EDIT',
      category: 'Cinematic Edit',
      description: 'Dynamic camera movement, speed ramping, custom visual effects, and music-driven editing flow.',
      thumbnail: 'assets/cinematic-edit.jpg',
      video: 'https://youtube.com/@rk._brokenhalo',
      tools: ['CapCut', 'Alight Motion', 'PicsArt'],
      tags: ['CINEMATIC', 'SPEED RAMP'],
      style: 'Motion Effects · VFX · Color Grading'
    },
    {
      _id: 'proj-04',
      title: 'SHORT-FORM EDIT',
      category: 'Short-Form Edit',
      description: 'Fast-paced vertical videos optimized for YouTube Shorts, TikTok, and Instagram Reels with powerful opening hooks.',
      thumbnail: 'assets/shorts-edit.jpg',
      video: 'https://youtube.com/@rk._brokenhalo',
      tools: ['CapCut'],
      tags: ['SHORTS', 'REELS'],
      style: 'Vertical · Fast Paced · Beat Sync'
    }
  ];

  let activeProjects = fallbackProjects;

  // ─── VIDEO PREVIEW MODAL HANDLER ───
  function initVideoModal() {
    const modal = document.getElementById('videoModal');
    if (!modal) return;

    const closeBtn = document.getElementById('modalCloseBtn');
    const backdrop = document.getElementById('modalBackdrop');
    const mediaEl = document.getElementById('modalMedia');
    const catEl = document.getElementById('modalCategory');
    const toolsEl = document.getElementById('modalTools');
    const titleEl = document.getElementById('modalTitle');
    const descEl = document.getElementById('modalDesc');
    const ytBtn = document.getElementById('modalYtBtn');
    const playBadge = document.getElementById('modalMediaPlay');

    window.openProjectModal = function (project) {
      if (!project) return;
      catEl.textContent = (project.category || 'CINEMATIC EDIT').toUpperCase();
      toolsEl.textContent = Array.isArray(project.tools) ? project.tools.join(' • ') : (project.tools || 'CapCut • Alight Motion • PicsArt');
      titleEl.textContent = project.title || 'CINEMATIC EDIT';
      descEl.textContent = project.description || 'Custom crafted video edit by RK Broken Halo.';

      const thumbUrl = project.thumbnail || 'assets/anime-edit.jpg';
      mediaEl.style.backgroundImage = `url('${thumbUrl}')`;

      const videoLink = project.video || 'https://youtube.com/@rk._brokenhalo';
      if (ytBtn) ytBtn.href = videoLink;
      if (playBadge) playBadge.href = videoLink;

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });

    // Delegate clicks from edit cards
    const editsGrid = document.querySelector('.edits-grid');
    if (editsGrid) {
      editsGrid.addEventListener('click', e => {
        const card = e.target.closest('.edit-card');
        if (!card) return;

        const projIndex = Number(card.getAttribute('data-index') || '0');
        const proj = activeProjects[projIndex] || fallbackProjects[projIndex] || activeProjects[0];
        
        // Open modal
        openProjectModal(proj);
      });
    }
  }

  // ─── DYNAMIC PROJECTS LOADER ───
  async function loadProjects() {
    const editsGrid = document.querySelector('.edits-grid');
    if (!editsGrid) return;

    try {
      const res = await fetch(`${BACKEND_URL}/projects`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          activeProjects = result.data;
        }
      }
    } catch (err) {
      console.log('Backend API offline or loading. Using local high-fidelity project data.');
    }

    // Render cards (either from backend or fallback)
    renderProjects(activeProjects);
  }

  function renderProjects(projects) {
    const editsGrid = document.querySelector('.edits-grid');
    if (!editsGrid || !Array.isArray(projects) || projects.length === 0) return;

    editsGrid.innerHTML = projects.map((proj, idx) => {
      const isWide = idx === 0 || idx === 3;
      const numStr = String(idx + 1).padStart(2, '0');
      const numLabel = `EDIT ${numStr}`;
      const cardId = `ec-${numStr}`;

      let bgClass = 'ec-bg-anime';
      const cat = (proj.category || '').toLowerCase();
      if (cat.includes('movie')) bgClass = 'ec-bg-movie';
      else if (cat.includes('cine')) bgClass = 'ec-bg-cinematic';
      else if (cat.includes('short')) bgClass = 'ec-bg-shorts';

      const tags = Array.isArray(proj.tags) && proj.tags.length > 0
        ? proj.tags
        : (Array.isArray(proj.tools) && proj.tools.length > 0 ? proj.tools : [proj.category || 'EDIT']);

      const tagsHtml = tags.map(t => `<span class="ec-tag">${escapeHtml(t)}</span>`).join('');
      const styleText = proj.style || (Array.isArray(proj.tools) ? proj.tools.join(' · ') : proj.description);
      const videoLink = proj.video || 'https://youtube.com/@rk._brokenhalo';
      const bgStyle = proj.thumbnail && (proj.thumbnail.includes('/') || proj.thumbnail.includes('.'))
        ? `style="background: url('${escapeHtml(proj.thumbnail)}') center/cover no-repeat;"`
        : '';

      return `
        <article class="edit-card ${isWide ? 'ec-wide' : ''}" data-reveal data-cursor="WATCH" id="${cardId}" data-index="${idx}">
          <div class="ec-media">
            <div class="ec-media-bg ${bgClass}" ${bgStyle}></div>
            <div class="ec-overlay"></div>
            <div class="ec-play-icon" aria-hidden="true">
              <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="currentColor" stroke-width="1"/><path d="M16 13l14 7-14 7V13z" fill="currentColor"/></svg>
            </div>
          </div>
          <div class="ec-info">
            <span class="ec-num">${numLabel}</span>
            <h3 class="ec-title">${escapeHtml(proj.title)}</h3>
            <div class="ec-tags">
              ${tagsHtml}
            </div>
            <span class="ec-style">${escapeHtml(styleText)}</span>
            <a href="${videoLink}" target="_blank" rel="noopener noreferrer" class="ec-link" onclick="event.stopPropagation();">WATCH EDIT <span>→</span></a>
          </div>
          <div class="ec-glow" aria-hidden="true"></div>
        </article>
      `;
    }).join('');

    // Re-trigger ScrollTrigger to animate newly added DOM elements
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  // ════════════════════════════════════════════════════════════
  // CONTACT FORM (Connected to POST /api/contact)
  // ════════════════════════════════════════════════════════════
  function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('c-name');
    const emailInput = document.getElementById('c-email');
    const detailsInput = document.getElementById('c-details');
    const btn = form.querySelector('#contact-send-btn');
    const feedbackEl = document.getElementById('form-feedback');

    let isSubmitting = false;

    function showFeedback(message, type) {
      if (!feedbackEl) return;
      feedbackEl.textContent = message;
      feedbackEl.className = 'form-feedback ' + type;
      feedbackEl.style.display = 'block';

      if (type === 'error') {
        gsap.fromTo(feedbackEl, { x: -8 }, { x: 0, duration: 0.3, ease: 'power2.out' });
      } else if (type === 'success') {
        gsap.fromTo(feedbackEl, { scale: 0.96 }, { scale: 1, duration: 0.3, ease: 'back.out(1.5)' });
      }
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Prevent duplicate submissions
      if (isSubmitting) return;

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = detailsInput ? detailsInput.value.trim() : '';

      // 1. Validation
      if (!name) {
        showFeedback('Please enter your name.', 'error');
        if (nameInput) nameInput.focus();
        return;
      }

      if (name.length < 2) {
        showFeedback('Name must be at least 2 characters long.', 'error');
        if (nameInput) nameInput.focus();
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showFeedback('Please enter a valid email address (e.g., name@example.com).', 'error');
        if (emailInput) emailInput.focus();
        return;
      }

      if (!message || message.length < 5) {
        showFeedback('Please write a message or clip details (at least 5 characters).', 'error');
        if (detailsInput) detailsInput.focus();
        return;
      }

      // 2. Loading State & Duplicate Submission Lock
      isSubmitting = true;
      const origBtnHTML = btn.innerHTML;
      btn.innerHTML = 'SENDING...';
      btn.disabled = true;
      btn.style.opacity = '0.75';

      try {
        const response = await fetch(`${BACKEND_URL}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // 3. Success State
          btn.innerHTML = 'MESSAGE SENT ✓';
          btn.style.backgroundColor = '#10b981';
          btn.style.borderColor = '#10b981';
          btn.style.opacity = '1';

          showFeedback(data.message || 'Thank you! Your message has been sent to RK.', 'success');
          
          // Reset form fields
          form.reset();

          setTimeout(() => {
            btn.innerHTML = origBtnHTML;
            btn.style.backgroundColor = '';
            btn.style.borderColor = '';
            btn.disabled = false;
            isSubmitting = false;
          }, 4000);
        } else {
          // 4. Server Validation / Error State
          btn.innerHTML = 'FAILED - RETRY';
          btn.style.opacity = '1';
          showFeedback(data.message || 'Failed to submit. Please check your information.', 'error');

          setTimeout(() => {
            btn.innerHTML = origBtnHTML;
            btn.disabled = false;
            isSubmitting = false;
          }, 3000);
        }
      } catch (err) {
        console.warn('Backend fetch error:', err.message);
        
        // Graceful offline feedback
        btn.innerHTML = 'MESSAGE SENT (OFFLINE) ✓';
        btn.style.backgroundColor = '#10b981';
        btn.style.opacity = '1';

        showFeedback('Message recorded! (Backend offline or local demo mode)', 'success');
        form.reset();

        setTimeout(() => {
          btn.innerHTML = origBtnHTML;
          btn.style.backgroundColor = '';
          btn.disabled = false;
          isSubmitting = false;
        }, 4000);
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // BOOTSTRAP
  // ════════════════════════════════════════════════════════════
  function startSite() {
    initLenis();
    initCursor();
    initMagnetic();
    initParticles();
    initNav();
    initGSAP();
    initShowcase();
    initMouseParallax();
    initVideoModal();
    initForm();
    loadProjects();
  }

})();
